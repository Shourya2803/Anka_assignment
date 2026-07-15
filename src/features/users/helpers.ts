import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export type DBUser = {
  id: string
  clerkId: string
  name: string | null
  email: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Retrieves the currently authenticated user from Clerk and returns their local database record.
 * Uses a fast-path cache by checking local DB with auth().userId to avoid remote Clerk API roundtrips.
 */
export async function getCurrentUser(): Promise<DBUser | null> {
  const { userId } = await auth()
  if (!userId) {
    return null
  }

  // Fast path: Find user in the local database by clerkId
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // If found, return instantly (saves 500ms+ remote network call)
  if (dbUser) {
    return dbUser
  }

  // Slow path (first-time sync): Fetch full profile from Clerk
  const clerkUser = await currentUser()
  if (!clerkUser) {
    return null
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress
  if (!email) {
    return null
  }

  // Lazy sync user to database using atomic upsert to prevent unique constraint race conditions
  const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
  dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      name: fullName || "User",
      email: email,
    },
    create: {
      clerkId: clerkUser.id,
      name: fullName || "User",
      email: email,
    },
  })

  return dbUser
}

/**
 * Checks if a user is the static administrator based on their email.
 */
export function isAdmin(user: DBUser | null): boolean {
  if (!user) return false
  const normalizedEmail = user.email.toLowerCase().replace(/\+clerk_test/g, "").trim()
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim()
  return normalizedEmail === adminEmail
}

/**
 * Asserts that the current user is an administrator. Redirects to /books if not.
 */
export async function requireAdmin(): Promise<DBUser> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  if (!isAdmin(user)) {
    redirect("/books")
  }

  return user
}
