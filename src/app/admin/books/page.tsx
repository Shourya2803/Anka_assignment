import React from "react"
import { getBooks } from "@/features/books/services/book.service"
import prisma from "@/lib/prisma"
import BookManager from "@/features/books/components/BookManager"

export const metadata = {
  title: "BookStore Admin | Manage Books",
  description: "Create, edit, and delete books in the database catalog.",
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    categoryId?: string
  }>
}

export default async function AdminBooksPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page) || 1
  const search = resolvedParams.search || ""
  const categoryId = resolvedParams.categoryId || ""

  // Fetch paginated books from service layer
  const { books, total, totalPages, currentPage } = await getBooks({
    page,
    limit: 10,
    search,
    categoryId,
  })

  // Compute leaf categories on the server side with breadcrumbs
  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })
  
  // Compute category path helper for book list display
  const buildPath = (catId: string): string => {
    const path: string[] = []
    let current = allCategories.find((c) => c.id === catId)
    while (current) {
      path.unshift(current.name)
      current = current.parentId ? allCategories.find((c) => c.id === current!.parentId) : undefined
    }
    return path.join(" > ")
  }

  // Build hierarchical categories list (Root -> Child -> Grandchild)
  const buildHierarchicalList = () => {
    const list: { id: string; name: string; level: number; isLeaf: boolean; path: string }[] = []
    
    const traverse = (parentId: string | null, level: number) => {
      const children = allCategories.filter((c) => c.parentId === parentId)
      children.sort((a, b) => a.name.localeCompare(b.name))
      
      for (const child of children) {
        const hasChildren = allCategories.some((c) => c.parentId === child.id)
        list.push({
          id: child.id,
          name: child.name,
          level: level,
          isLeaf: !hasChildren,
          path: buildPath(child.id),
        })
        traverse(child.id, level + 1)
      }
    }
    
    traverse(null, 1)
    return list
  }

  const categoriesList = buildHierarchicalList()

  // Convert books to plain objects for client component compliance
  const formattedBooks = books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    description: b.description,
    coverImage: b.coverImage,
    categoryId: b.categoryId,
    category: {
      id: b.category.id,
      name: buildPath(b.categoryId),
    },
    createdAt: b.createdAt,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Library Catalog
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Manage all cataloged books in the database system.
        </p>
      </div>

      <BookManager
        initialBooks={formattedBooks}
        totalBooks={total}
        totalPages={totalPages}
        currentPage={currentPage}
        categories={categoriesList}
      />
    </div>
  )
}
