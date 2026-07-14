import prisma from "@/lib/prisma"
import { createAuditLog } from "@/features/reports/services/audit.service"
import { isLeafCategory } from "@/features/categories/services/category.service"

export interface BookInput {
  title: string
  author: string
  description: string
  categoryId: string
  coverImage: string
}

/**
 * Creates a new book record. Enforces that the book is assigned to a leaf-node category.
 */
export async function createBook(adminId: string, data: BookInput) {
  const { title, author, description, categoryId, coverImage } = data

  // Enforce leaf category constraint
  const categoryIsLeaf = await isLeafCategory(categoryId)
  if (!categoryIsLeaf) {
    throw new Error("Books can only be assigned to leaf categories (categories with no subcategories).")
  }

  const book = await prisma.book.create({
    data: {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      coverImage: coverImage,
      categoryId: categoryId,
      createdBy: adminId,
    },
  })

  // Log action
  await createAuditLog(adminId, "CREATE_BOOK", "BOOK", book.id)

  return book
}

/**
 * Updates an existing book. Enforces that the book is assigned to a leaf-node category.
 */
export async function updateBook(
  adminId: string,
  bookId: string,
  data: Partial<BookInput>
) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  })

  if (!book) {
    throw new Error("Book not found.")
  }

  const updateData: any = {}

  if (data.title !== undefined) updateData.title = data.title.trim()
  if (data.author !== undefined) updateData.author = data.author.trim()
  if (data.description !== undefined) updateData.description = data.description.trim()
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage

  if (data.categoryId !== undefined) {
    // Enforce leaf category constraint
    const categoryIsLeaf = await isLeafCategory(data.categoryId)
    if (!categoryIsLeaf) {
      throw new Error("Books can only be assigned to leaf categories (categories with no subcategories).")
    }
    updateData.categoryId = data.categoryId
  }

  const updatedBook = await prisma.book.update({
    where: { id: bookId },
    data: updateData,
  })

  // Log action
  await createAuditLog(adminId, "UPDATE_BOOK", "BOOK", bookId)

  return updatedBook
}

/**
 * Deletes a book record.
 */
export async function deleteBook(adminId: string, bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  })

  if (!book) {
    throw new Error("Book not found.")
  }

  await prisma.book.delete({
    where: { id: bookId },
  })

  // Log action
  await createAuditLog(adminId, "DELETE_BOOK", "BOOK", bookId)

  return true
}

async function getDescendantCategoryIds(categoryId: string): Promise<string[]> {
  const allCategories = await prisma.category.findMany({
    select: { id: true, parentId: true },
  })

  const ids = [categoryId]
  let currentParentIds = [categoryId]

  for (let depth = 0; depth < 2; depth++) {
    const children = allCategories.filter((c) => c.parentId && currentParentIds.includes(c.parentId))
    if (children.length === 0) break
    const childrenIds = children.map((c) => c.id)
    ids.push(...childrenIds)
    currentParentIds = childrenIds
  }

  return ids
}

/**
 * Fetches all books from the database with pagination and optional category filter.
 */
export async function getBooks(params: {
  page: number
  limit: number
  categoryId?: string
  search?: string
}) {
  const { page, limit, categoryId, search } = params
  const skip = (page - 1) * limit

  const whereClause: any = {}

  if (categoryId) {
    const categoryIds = await getDescendantCategoryIds(categoryId)
    whereClause.categoryId = { in: categoryIds }
  }

  if (search && search.trim() !== "") {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
    ]
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.book.count({
      where: whereClause,
    }),
  ])

  return {
    books,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  }
}

/**
 * Fetches a single book by ID.
 */
export async function getBookById(id: string) {
  return await prisma.book.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })
}
