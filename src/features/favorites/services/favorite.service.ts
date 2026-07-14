import prisma from "@/lib/prisma"

/**
 * Toggles a book's favorite status for a user.
 * Returns a boolean representing the new status (true if favorited, false if removed).
 */
export async function toggleFavorite(userId: string, bookId: string): Promise<boolean> {
  try {
    // Attempt deleting immediately (saves 1 network roundtrip if it exists)
    await prisma.favorite.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })
    return false
  } catch (error: any) {
    // Prisma error code for Record to delete not found
    if (error.code === "P2025") {
      await prisma.favorite.create({
        data: {
          userId,
          bookId,
        },
      })
      return true
    }
    throw error
  }
}

/**
 * Checks if a book is favorited by a specific user.
 */
export async function isFavorited(userId: string, bookId: string): Promise<boolean> {
  const count = await prisma.favorite.count({
    where: {
      userId,
      bookId,
    },
  })
  return count > 0
}

/**
 * Retrieves all books favorited by a specific user.
 */
export async function getUserFavorites(userId: string) {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      book: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}
