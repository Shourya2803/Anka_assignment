import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import PublicNavbar from "@/components/layout/PublicNavbar"
import { getUserFavorites } from "@/features/favorites/services/favorite.service"
import { getCurrentUser } from "@/features/users/helpers"
import FavoriteButton from "@/features/favorites/components/FavoriteButton"
import prisma from "@/lib/prisma"
import { Heart } from "lucide-react"

export const metadata = {
  title: "BookStore | My Favorites",
  description: "View and manage your curated library collection.",
}

export default async function FavoritesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Fetch user favorites and all categories for path building
  const [favorites, allCategories] = await Promise.all([
    getUserFavorites(user.id),
    prisma.category.findMany(),
  ])

  // Helper to build 3-level breadcrumb path
  const buildPath = (catId: string): string => {
    const path: string[] = []
    let current = allCategories.find((c) => c.id === catId)
    while (current) {
      path.unshift(current.name)
      current = current.parentId ? allCategories.find((c) => c.id === current!.parentId) : undefined
    }
    return path.join(" > ")
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation */}
      <PublicNavbar />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 flex flex-col gap-6">

        {/* Outer Frame Card */}
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Favorite Books
            </h1>
          </div>

          {/* Favorites List Container */}
          {favorites.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white shadow-sm">
              <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold">Your favorites list is empty.</p>
              <p className="text-slate-400 text-xs mt-1">
                Explore the{" "}
                <Link href="/books" className="text-blue-600 hover:underline font-bold">
                  books catalog
                </Link>{" "}
                and tap the heart icon on any book cover to save it here.
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden">
              {favorites.map((fav) => {
                const { book } = fav
                const categoryPath = buildPath(book.categoryId)

                return (
                  <div
                    key={book.id}
                    className="group flex items-center gap-6 p-6 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Small Cover Art on Left */}
                    <div className="w-[72px] h-[108px] rounded-[6px] overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <Link href={`/books/${book.id}`}>
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </Link>
                    </div>

                    {/* Middle Column: Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <Link href={`/books/${book.id}`}>
                        <h2 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {book.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-slate-500 truncate">
                        {book.author}
                      </p>
                      <div className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mt-2">
                        <Link href={`/books?categoryId=${book.categoryId}`}>
                          {categoryPath}
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Remove Button */}
                    <div className="flex-shrink-0">
                      <FavoriteButton bookId={book.id} initialFavorited={true} variant="remove-btn" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
