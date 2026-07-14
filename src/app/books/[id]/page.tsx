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

      <main className="flex-grow w-full mx-auto px-8 py-12 flex flex-col gap-6">
        {/* Back navigation */}
        <div>
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Detailed Book Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-4">
          
          {/* Left Column: Cover and Favorite Button */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 shadow-sm">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            </div>
            
            {/* Favorites Toggler */}
            <div className="pt-1">
              <FavoriteButton bookId={book.id} initialFavorited={favorited} variant="detail" />
            </div>
          </div>

          {/* Right Column: Metadata details */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">{book.title}</h1>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                <span>{book.author}</span>
              </p>
            </div>

            {/* Category Breadcrumbs (Blue Text) */}
            <div className="text-xs font-bold text-blue-600 hover:underline">
              <Link href={`/books?categoryId=${book.categoryId}`}>
                {categoryPath}
              </Link>
            </div>

            {/* Synopsis */}
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mt-2">
              {book.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
