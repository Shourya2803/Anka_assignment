"use server"

import { requireAdmin } from "@/features/users/helpers"
import * as categoryService from "../services/category.service"
import { revalidatePath } from "next/cache"

export async function createCategoryAction(name: string, parentId: string | null) {
  try {
    const admin = await requireAdmin()
    await categoryService.createCategory(admin.id, name, parentId)
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    }
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const admin = await requireAdmin()
    await categoryService.deleteCategory(admin.id, id)
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    }
  }
}
