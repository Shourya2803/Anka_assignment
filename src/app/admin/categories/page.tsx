import React from "react"
import { getCategoryTree, getCategories } from "@/features/categories/services/category.service"
import CategoryManager from "@/features/categories/components/CategoryManager"

export const metadata = {
  title: "BookStore Admin | Category Management",
  description: "Organize books into a hierarchical taxonomy. Restrict depth to 3 levels.",
}

export default async function AdminCategoriesPage() {
  const tree = await getCategoryTree()
  const flat = await getCategories()

  // Pick only the data we need for props to make it lightweight
  const flatCategoriesInfo = flat.map((c) => ({
    id: c.id,
    name: c.name,
    level: c.level,
  }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Categories
        </h1>
      </div>

      <CategoryManager initialTree={tree} flatCategories={flatCategoriesInfo} />
    </div>
  )
}
