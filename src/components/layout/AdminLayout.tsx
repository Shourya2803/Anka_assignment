"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton } from "@clerk/nextjs"

interface SidebarItemProps {
  href: string
  label: string
  active: boolean
}

function SidebarItem({ href, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`block px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
        active
          ? "bg-[#1c303f] text-white"
          : "text-[#93a2ae] hover:text-white hover:bg-[#1c303f]/50"
      }`}
    >
      {label}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#f3f6f9] text-slate-800 font-sans">
      {/* Sticky Left Sidebar (Exactly matches mockup colors & items) */}
      <aside className="w-64 bg-[#15232e] flex flex-col justify-between py-10 px-4 shrink-0 sticky top-0 h-screen">
        <div className="flex flex-col gap-8">
          {/* Navigation Link List */}
          <nav className="flex flex-col gap-1">
            <SidebarItem
              href="/admin/dashboard"
              label="Dashboard"
              active={pathname === "/admin/dashboard"}
            />
            <SidebarItem
              href="/admin/books"
              label="Books"
              active={pathname.startsWith("/admin/books")}
            />
            <SidebarItem
              href="/admin/categories"
              label="Categories"
              active={pathname.startsWith("/admin/categories")}
            />
            <SidebarItem
              href="/admin/reports"
              label="Reports"
              active={pathname.startsWith("/admin/reports")}
            />

            {/* Logout Option (Same list formatting as other items) */}
            <SignOutButton redirectUrl="/">
              <button className="w-full text-left block px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-[#93a2ae] hover:text-white hover:bg-[#1c303f]/50 transition-all duration-200 cursor-pointer">
                Logout
              </button>
            </SignOutButton>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8fafc]">
        <main className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
