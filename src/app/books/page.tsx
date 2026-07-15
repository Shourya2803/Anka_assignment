import React, { Suspense } from "react"
import Link from "next/link"
import PublicNavbar from "@/components/layout/PublicNavbar"
import { getBooks } from "@/features/books/services/book.service"
import { getCategories } from "@/features/categories/services/category.service"
import { getCurrentUser } from "@/features/users/helpers"
import prisma from "@/lib/prisma"
import FavoriteButton from "@/features/favorites/components/FavoriteButton"
import CategorySidebar from "@/features/categories/components/CategorySidebar"
import { BookOpen } from "lucide-react"

export const metadata = {
  title: "BookStore | Explore Books",
  description: "Browse genres, search categories, and save favorites to your personal library.",
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    categoryId?: string
  }>
}

function BooksCatalogSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Info Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-col gap-1.5 w-1/3">
          <div className="h-3 w-20 bg-slate-200/80 rounded animate-pulse" />
          <div className="h-6 w-32 bg-slate-200/80 rounded-md animate-pulse mt-0.5" />
        </div>
        <div className="h-4 w-24 bg-slate-200/60 rounded animate-pulse" />
      </div>

      {/* Book Cards Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <div className="aspect-[2/3] w-full rounded-lg bg-slate-200/60 animate-pulse border border-slate-100" />
            <div className="flex flex-col gap-1.5 px-1">
              <div className="h-4 w-3/4 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface BooksListContainerProps {
  page: number
  categoryId: string
  user: any
  categories: any[]
}

async function BooksListContainer({ page, categoryId, user, categories }: BooksListContainerProps) {
  const { books, totalPages } = await getBooks({ page, limit: 12, search: "", categoryId })

  // Get user favorites for display (batch query, N+1 optimized)
  const favoriteBookIds = new Set<string>()
  if (user) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { bookId: true },
    })
    favorites.forEach((f) => favoriteBookIds.add(f.bookId))
  }

  // Find label of active category
  const activeCategory = categories.find((c) => c.id === categoryId)
  const currentCategoryLabel = activeCategory ? activeCategory.name : "All Genres"

  return (
    <>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Category</span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">{currentCategoryLabel}</h1>
        </div>

        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          {books.length} Books Found
        </div>
      </div>

      {/* Book Cards Grid */}
      {books.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No books found in this category.</p>
          <p className="text-slate-400 text-xs mt-1">Please select another category in the sidebar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
          {books.map((book) => {
            const isFavorited = favoriteBookIds.has(book.id)
            return (
              <div key={book.id} className="group relative flex flex-col gap-3">
                {/* Cover Art Wrapper */}
                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-slate-100">
                  <Link href={`/books/${book.id}`} className="block w-full h-full">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </Link>
                  
                  {/* Floating Favorite Button */}
                  <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                    <FavoriteButton bookId={book.id} initialFavorited={isFavorited} />
                  </div>
                </div>

                {/* Book Text Content */}
                <div className="flex flex-col pr-2">
                  <Link href={`/books/${book.id}`}>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {book.author}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-10">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
            {/* Previous Button */}
            <Link
              href={`/books?page=${page - 1}${categoryId ? `&categoryId=${categoryId}` : ""}`}
              className={`w-10 h-10 flex items-center justify-center text-xs font-semibold border-r border-slate-200 transition-colors ${
                page === 1
                  ? "text-slate-300 pointer-events-none bg-slate-50"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              «
            </Link>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === page
              const isLast = p === totalPages
              return (
                <Link
                  key={p}
                  href={`/books?page=${p}${categoryId ? `&categoryId=${categoryId}` : ""}`}
                  className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 bg-white"
                  } ${!isLast ? "border-r border-slate-200" : ""}`}
                >
                  {p}
                </Link>
              )
            })}

            {/* Next Button */}
            <Link
              href={`/books?page=${page + 1}${categoryId ? `&categoryId=${categoryId}` : ""}`}
              className={`w-10 h-10 flex items-center justify-center text-xs font-semibold border-l border-slate-200 transition-colors ${
                page === totalPages
                  ? "text-slate-300 pointer-events-none bg-slate-50"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              »
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default async function BooksCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page) || 1
  const categoryId = resolvedParams.categoryId || ""

  // Fetch quick layout requirements (categories and user details)
  const [categories, user] = await Promise.all([
    getCategories(),
    getCurrentUser(),
  ])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation */}
      <PublicNavbar />

      {/* Main Layout */}
      <div className="flex-1 w-full mx-auto px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar: Categories Filter */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
          <CategorySidebar categories={categories} selectedCategoryId={categoryId} />
        </aside>

        {/* Catalog Listing */}
        <main className="flex-1 flex flex-col gap-6">
          <Suspense key={`${page}-${categoryId}`} fallback={<BooksCatalogSkeleton />}>
            <BooksListContainer page={page} categoryId={categoryId} user={user} categories={categories} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
