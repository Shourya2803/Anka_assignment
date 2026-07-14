import { redirect } from "next/navigation"
import { getCurrentUser, isAdmin } from "@/features/users/helpers"

export default async function AuthCallbackPage() {
  const user = await getCurrentUser()
  
  if (user && isAdmin(user)) {
    redirect("/admin/dashboard")
  }
  
  redirect("/books")
}
