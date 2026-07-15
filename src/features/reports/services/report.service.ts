import prisma from "@/lib/prisma"

export interface DashboardStats {
  totalUsers: number
  totalBooks: number
  totalCategories: number
  totalFavorites: number
  topBooks: {
    id: string
    title: string
    author: string
    categoryName: string
    favoriteCount: number
  }[]
  recentBooks: {
    id: string
    title: string
    author: string
    categoryName: string
    createdAt: Date
  }[]
  booksPerCategory: {
    name: string
    value: number
  }[]
  favoritesTimeline: {
    month: string
    count: number
  }[]
}

/**
 * Compiles comprehensive analytics metrics and charts datasets for the administrator.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    totalBooks,
    totalCategories,
    totalFavorites,
    rawTopBooks,
    rawRecentBooks,
    rawBooksPerCategory,
    favorites,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.category.count(),
    prisma.favorite.count(),
    prisma.book.findMany({
      take: 5,
      include: {
        _count: {
          select: { favorites: true },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: {
        favorites: {
          _count: "desc",
        },
      },
    }),
    prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { name: true },
        },
      },
    }),
    prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { books: true },
        },
      },
    }),
    prisma.favorite.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: { createdAt: true },
    }),
  ])

  const topBooks = rawTopBooks.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    categoryName: b.category.name,
    favoriteCount: b._count.favorites,
  }))

  const recentBooks = rawRecentBooks.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    categoryName: b.category.name,
    createdAt: b.createdAt,
  }))

  const booksPerCategory = rawBooksPerCategory
    .map((c) => ({
      name: c.name,
      value: c._count.books,
    }))
    .filter((c) => c.value > 0) // Only show categories with books in the chart

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const countsByMonth: { [key: string]: number } = {}

  // Initialize last 6 months
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`
    countsByMonth[label] = 0
  }

  // Populate actual favorites count
  favorites.forEach((f) => {
    const d = new Date(f.createdAt)
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`
    if (countsByMonth[label] !== undefined) {
      countsByMonth[label]++
    }
  })

  const favoritesTimeline = Object.entries(countsByMonth).map(([month, count]) => ({
    month,
    count,
  }))

  return {
    totalUsers,
    totalBooks,
    totalCategories,
    totalFavorites,
    topBooks,
    recentBooks,
    booksPerCategory,
    favoritesTimeline,
  }
}
