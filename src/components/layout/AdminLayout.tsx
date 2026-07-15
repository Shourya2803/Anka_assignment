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
          : "text-[#93a2ae] hover:text-white hover:bg-[#1c303f]/50 hover:translate-x-1"
      }`}
    >
      {label}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f3f6f9] text-slate-800 font-sans">
      
      {/* Mobile Sticky Navigation Header (visible only on mobile) */}
      <header className="lg:hidden w-full bg-[#15232e] text-white sticky top-0 z-50 flex flex-col px-4 py-3 border-b border-[#1c303f] gap-2">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-sm font-bold tracking-tight">
            Admin Panel
          </Link>
          <SignOutButton redirectUrl="/">
            <button className="text-xs font-semibold text-[#93a2ae] hover:text-white transition-colors cursor-pointer bg-[#1c303f]/50 px-3 py-1.5 rounded-lg">
              Logout
            </button>
          </SignOutButton>
        </div>
        {/* Horizontal scroll of navigation categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Link 
            href="/admin/dashboard" 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              pathname === "/admin/dashboard" 
                ? "bg-[#1c303f] text-white" 
                : "text-[#93a2ae] hover:bg-[#1c303f]/30 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/books" 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              pathname.startsWith("/admin/books") 
                ? "bg-[#1c303f] text-white" 
                : "text-[#93a2ae] hover:bg-[#1c303f]/30 hover:text-white"
            }`}
          >
            Books
          </Link>
          <Link 
            href="/admin/categories" 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              pathname.startsWith("/admin/categories") 
                ? "bg-[#1c303f] text-white" 
                : "text-[#93a2ae] hover:bg-[#1c303f]/30 hover:text-white"
            }`}
          >
            Categories
          </Link>
          <Link 
            href="/admin/reports" 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              pathname.startsWith("/admin/reports") 
                ? "bg-[#1c303f] text-white" 
                : "text-[#93a2ae] hover:bg-[#1c303f]/30 hover:text-white"
            }`}
          >
            Reports
          </Link>
        </div>
      </header>

      {/* Sticky Left Sidebar (Visible only on desktop) */}
      <aside className="hidden lg:flex w-64 bg-[#15232e] flex-col justify-between py-10 px-4 shrink-0 sticky top-0 h-screen">
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
              <button className="w-full text-left block px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-[#93a2ae] hover:text-white hover:bg-[#1c303f]/50 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                Logout
              </button>
            </SignOutButton>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8fafc]">
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
