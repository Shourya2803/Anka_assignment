import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isPrivateRoute = createRouteMatcher(["/favorites(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Protect admin routes: enforce authentication in middleware
  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }
    // Authorization (admin check) is offloaded to the layout server component
    // to avoid slow blocking Clerk API calls on every request.
  }

  // Protect regular private user routes (favorites)
  if (isPrivateRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
}
