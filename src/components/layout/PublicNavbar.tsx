import React from "react"
import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { getCurrentUser, isAdmin } from "@/features/users/helpers"

export default async function PublicNavbar() {
  const user = await getCurrentUser()
  const userIsAdmin = isAdmin(user)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            BookStore
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/books"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            All Books
          </Link>

          {user ? (
            <>
              {userIsAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/favorites"
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                My Favorites
              </Link>
              <SignOutButton>
                <button className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
