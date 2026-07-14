"use server"

import { requireAdmin } from "@/features/users/helpers"
import * as bookService from "../services/book.service"
import { uploadBookCover } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"

export async function createBookAction(formData: FormData) {
  try {
    const admin = await requireAdmin()

    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string
    const coverImageFile = formData.get("coverImage") as File | null

    if (!title || !author || !description || !categoryId) {
      throw new Error("Missing required book fields.")
    }

    // Upload to Cloudinary (falls back to premium mock covers if credentials missing)
    const coverImage = await uploadBookCover(coverImageFile, title)

    await bookService.createBook(admin.id, {
      title,
      author,
      description,
      categoryId,
      coverImage,
    })

    revalidatePath("/admin/books")
    revalidatePath("/books")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    }
  }
}

export async function updateBookAction(bookId: string, formData: FormData) {
  try {
    const admin = await requireAdmin()

    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string
    const coverImageFile = formData.get("coverImage") as File | null

    const updateData: any = {}
    if (title) updateData.title = title
    if (author) updateData.author = author
    if (description) updateData.description = description
    if (categoryId) updateData.categoryId = categoryId

    // If new file is uploaded, upload to Cloudinary and update field
    if (coverImageFile && coverImageFile.size > 0) {
      const coverImage = await uploadBookCover(coverImageFile, title || "Book")
      updateData.coverImage = coverImage
    }

    await bookService.updateBook(admin.id, bookId, updateData)

    revalidatePath("/admin/books")
    revalidatePath("/books")
    revalidatePath(`/books/${bookId}`)
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    }
  }
}

export async function deleteBookAction(bookId: string) {
  try {
    const admin = await requireAdmin()

    await bookService.deleteBook(admin.id, bookId)

    revalidatePath("/admin/books")
    revalidatePath("/books")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    }
  }
}
