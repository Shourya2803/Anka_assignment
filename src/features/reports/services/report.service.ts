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
  const [totalUsers, totalBooks, totalCategories, totalFavorites] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.category.count(),
    prisma.favorite.count(),
  ])

  // Top 5 Most Favorited Books
  const rawTopBooks = await prisma.book.findMany({
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
  })

  const topBooks = rawTopBooks.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    categoryName: b.category.name,
    favoriteCount: b._count.favorites,
  }))

  // Recently Added Books (5)
  const rawRecentBooks = await prisma.book.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true },
      },
    },
  })

  const recentBooks = rawRecentBooks.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    categoryName: b.category.name,
    createdAt: b.createdAt,
  }))

  // Books Per Category
  const rawBooksPerCategory = await prisma.category.findMany({
    select: {
      name: true,
      _count: {
        select: { books: true },
      },
    },
  })

  const booksPerCategory = rawBooksPerCategory
    .map((c) => ({
      name: c.name,
      value: c._count.books,
    }))
    .filter((c) => c.value > 0) // Only show categories with books in the chart

  // Favorites Timeline (Grouped by Month)
  const favorites = await prisma.favorite.findMany({
    select: { createdAt: true },
  })

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
