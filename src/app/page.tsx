import Link from "next/link"
import { getCurrentUser, isAdmin } from "@/features/users/helpers"

export default async function Home() {
  const user = await getCurrentUser()
  const userIsAdmin = isAdmin(user)

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-900 overflow-hidden font-sans">
      {/* Header / Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-slate-100">
        <div className="text-xl font-bold tracking-tight text-slate-900">
          BookStore
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/books"
            className="text-sm font-semibold text-slate-650 hover:text-slate-900 transition-colors"
          >
            All Books
          </Link>
          {user ? (
            <Link
              href={userIsAdmin ? "/admin/dashboard" : "/books"}
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all duration-200"
            >
              Enter App
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          Production-Ready Architecture
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8 text-slate-950">
          The ultimate platform to{" "}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            curate & catalog
          </span>{" "}
          your digital library
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
          An elegant Book Management solution powered by Next.js 15, Clerk, and Prisma. Access a clean database architecture with hierarchical categories, favorites, and detailed audit logging.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Link
              href={userIsAdmin ? "/admin/dashboard" : "/books"}
              className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              Go to {userIsAdmin ? "Admin Dashboard" : "Book Catalog"}
            </Link>
          ) : (
            <>
              <Link
                href="/books"
                className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                Browse Catalog
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-base transition-all duration-200"
              >
                Sign In / Register
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-650 font-bold mb-4 border border-violet-100">
              📚
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Book Cataloging</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Curate books with cover images, details, and authors. Enforces categorization strictly at the category leaf-node levels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-655 font-bold mb-4 border border-indigo-100">
              🗂️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hierarchical Categories</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organize books using a multi-level self-referential category tree structure. Maximum category depth is restricted to 3.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-650 font-bold mb-4 border border-emerald-100">
              ✨
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Favorites & Security</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Save books to your favorites collection, fully protected by middleware, with comprehensive activity auditing for admins.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 py-8 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} BookStore. Developed with Next.js 15, Prisma, and Clerk.</p>
      </footer>
    </div>
  )
}
