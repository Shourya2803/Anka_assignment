"use server"

import { getCurrentUser } from "@/features/users/helpers"
import * as favoriteService from "../services/favorite.service"
import { revalidatePath } from "next/cache"

export async function toggleFavoriteAction(bookId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Please sign in to add favorites." }
    }

    const isNowFavorited = await favoriteService.toggleFavorite(user.id, bookId)
    
    // Only revalidate the favorites index page cache.
    // The catalog list and details route have active hook states that manage toggles instantly.
    revalidatePath("/favorites")

    return { success: true, isFavorited: isNowFavorited }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    }
  }
}
