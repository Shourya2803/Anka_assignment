import React from "react"
import { getCurrentUser, isAdmin } from "@/features/users/helpers"
import LandingClient from "./LandingClient"

export default async function Home() {
  const user = await getCurrentUser()
  const userIsAdmin = isAdmin(user)

  return <LandingClient user={user} userIsAdmin={userIsAdmin} />
}
