import React from "react"
import { requireAdmin } from "@/features/users/helpers"
import AdminLayoutClient from "@/components/layout/AdminLayout"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce that only the administrator can access routes inside this folder
  await requireAdmin()

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
