import React from "react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import PublicNavbar from "@/components/layout/PublicNavbar"
import { getBookById } from "@/features/books/services/book.service"
import { isFavorited } from "@/features/favorites/services/favorite.service"
import { getCurrentUser } from "@/features/users/helpers"
import prisma from "@/lib/prisma"
import FavoriteButton from "@/features/favorites/components/FavoriteButton"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "BookStore | Book Details",
  description: "View cover art, synopsis, and other metadata for this library book.",
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params

  // Auth Guard: Only logged-in users can view details
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Fetch book details
  const book = await getBookById(id)
  if (!book) {
    notFound()
  }

  // Check if book is favorited
  const favorited = await isFavorited(user.id, book.id)

  // Compute category path
  const allCategories = await prisma.category.findMany()
  const buildPath = (catId: string): string => {
    const path: string[] = []
    let current = allCategories.find((c) => c.id === catId)
    while (current) {
      path.unshift(current.name)
      current = current.parentId ? allCategories.find((c) => c.id === current!.parentId) : undefined
    }
    return path.join(" > ")
  }

  const categoryPath = buildPath(book.categoryId)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-grow w-full max-w-8xl mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col gap-6">
        {/* Back navigation */}
        <div>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Detailed Book Content */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          
          {/* Left Column: Cover and Favorite Button */}
          <div className="w-full max-w-[240px] md:max-w-none mx-auto md:w-64 lg:w-72 flex-shrink-0 flex flex-col gap-6">
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            </div>

            {/* Favorites Toggler */}
            <FavoriteButton bookId={book.id} initialFavorited={favorited} variant="detail" />
          </div>

          {/* Right Column: Metadata details */}
          <div className="flex-grow flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
                {book.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-500 font-medium">
                {book.author}
              </p>
            </div>

            {/* Category Breadcrumbs (Blue tag badge) */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100/50 transition-colors w-fit">
              <Link href={`/books?categoryId=${book.categoryId}`}>
                {categoryPath}
              </Link>
            </div>

            <hr className="border-slate-100" />

            {/* Synopsis */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Synopsis
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
