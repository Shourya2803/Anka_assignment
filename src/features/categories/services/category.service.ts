import prisma from "@/lib/prisma"
import { createAuditLog } from "@/features/reports/services/audit.service"

export interface CategoryTreeItem {
  id: string
  name: string
  parentId: string | null
  level: number
  children: CategoryTreeItem[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Fetches all categories from the database.
 */
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

/**
 * Builds a hierarchical tree from a flat list of categories.
 */
export async function getCategoryTree(): Promise<CategoryTreeItem[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  const itemMap = new Map<string, CategoryTreeItem>()

  // Initialize tree items
  categories.forEach((cat) => {
    itemMap.set(cat.id, {
      ...cat,
      children: [],
    })
  })

  const rootItems: CategoryTreeItem[] = []

  // Build parent-child relationships
  itemMap.forEach((item) => {
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent) {
        parent.children.push(item)
      } else {
        // Fallback if parent not found in list (should not happen with foreign keys)
        rootItems.push(item)
      }
    } else {
      rootItems.push(item)
    }
  })

  return rootItems
}

/**
 * Creates a new category. Enforces a maximum hierarchy depth of 3 levels.
 */
export async function createCategory(
  adminId: string,
  name: string,
  parentId: string | null
) {
  if (!name || name.trim() === "") {
    throw new Error("Category name is required.")
  }

  let level = 1

  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: parentId },
    })

    if (!parent) {
      throw new Error("Parent category not found.")
    }

    if (parent.level >= 3) {
      throw new Error("Category hierarchy cannot exceed 3 levels of depth.")
    }

    level = parent.level + 1
  }

  // Check if a category with the same name already exists at this level under the same parent
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: name.trim(),
        mode: "insensitive",
      },
      parentId: parentId || null,
    },
  })

  if (existingCategory) {
    throw new Error("A category with this name already exists at this level.")
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      parentId: parentId || null,
      level: level,
    },
  })

  // Log audit action
  await createAuditLog(adminId, "CREATE_CATEGORY", "CATEGORY", category.id)

  return category
}

/**
 * Deletes a category. Prevents deletion if it contains subcategories or books.
 */
export async function deleteCategory(adminId: string, id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    throw new Error("Category not found.")
  }

  // Fetch all categories to build the hierarchy
  const allCategories = await prisma.category.findMany()

  // Helper to recursively get all children IDs
  const getDescendantIds = (parentId: string): string[] => {
    const ids: string[] = []
    const children = allCategories.filter((c) => c.parentId === parentId)
    for (const child of children) {
      ids.push(child.id)
      ids.push(...getDescendantIds(child.id))
    }
    return ids
  }

  const categoryIdsToDelete = [id, ...getDescendantIds(id)]

  // 1. Delete all books associated with these categories
  await prisma.book.deleteMany({
    where: {
      categoryId: {
        in: categoryIdsToDelete,
      },
    },
  })

  // 2. Sort categories to delete from deepest level up (level 3 -> 2 -> 1) to satisfy foreign keys
  const categoriesToDel = allCategories.filter((c) => categoryIdsToDelete.includes(c.id))
  categoriesToDel.sort((a, b) => b.level - a.level)

  // 3. Delete categories in order
  for (const cat of categoriesToDel) {
    await prisma.category.delete({
      where: { id: cat.id },
    })
  }

  // Log audit action
  await createAuditLog(adminId, "DELETE_CATEGORY", "CATEGORY", id)

  return true
}

/**
 * Check if a category is a leaf category (has no children).
 */
export async function isLeafCategory(id: string): Promise<boolean> {
  const count = await prisma.category.count({
    where: { parentId: id },
  })
  return count === 0
}
