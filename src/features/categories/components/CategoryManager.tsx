"use client"

import React, { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Folder, Trash2, ChevronDown, ChevronRight, AlertCircle, Loader2 } from "lucide-react"
import { createCategoryAction, deleteCategoryAction } from "../actions/category.actions"
import { CategoryTreeItem } from "../services/category.service"
import { toast } from "sonner"
import ConfirmationModal from "@/components/ui/ConfirmationModal"

interface CategoryManagerProps {
  initialTree: CategoryTreeItem[]
  flatCategories: { id: string; name: string; level: number }[]
}

export default function CategoryManager({
  initialTree,
  flatCategories,
}: CategoryManagerProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState("")
  const [computedLevel, setComputedLevel] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Confirmation Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  // Filter out level 3 categories since they cannot be parents (max depth is 3)
  const availableParents = flatCategories.filter((cat) => cat.level < 3)

  // Keep track of collapsed categories
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({})

  // Automatically update the calculated level when parent category changes
  useEffect(() => {
    if (!parentId) {
      setComputedLevel(1)
      return
    }
    const parent = flatCategories.find((c) => c.id === parentId)
    if (parent) {
      setComputedLevel(parent.level + 1)
    }
  }, [parentId, flatCategories])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setError(null)
    startTransition(async () => {
      const res = await createCategoryAction(name, parentId || null)
      if (res.success) {
        setName("")
        setParentId("")
        toast.success("Category created successfully!")
        router.refresh()
      } else {
        setError(res.error || "Failed to create category")
        toast.error(res.error || "Failed to create category")
      }
    })
  }

  const handleOpenDeleteConfirm = (id: string) => {
    setIdToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!idToDelete) return
    setError(null)
    setDeletingId(idToDelete)
    setDeleteConfirmOpen(false)

    const res = await deleteCategoryAction(idToDelete)
    setDeletingId(null)
    setIdToDelete(null)

    if (res.success) {
      toast.success("Category deleted successfully!")
      router.refresh()
    } else {
      setError(res.error || "Failed to delete category")
      toast.error(res.error || "Failed to delete category")
    }
  }

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Recursive Category Node Renderer matching the mockup tree layout
  const renderCategoryNode = (item: CategoryTreeItem) => {
    const isDeleting = deletingId === item.id
    const hasChildren = item.children && item.children.length > 0
    const isCollapsed = collapsedNodes[item.id]

    return (
      <div key={item.id} className="flex flex-col w-full">
        {/* Category Row */}
        <div className="group flex items-center justify-between py-1.5 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-all">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Toggle Arrow */}
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleCollapse(item.id)}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
              </div>
            )}

            {/* Folder Icon */}
            <Folder className="w-4 h-4 text-slate-400 shrink-0 fill-slate-100 transition-transform duration-200 group-hover:scale-110" />
            
            {/* Category Name */}
            <span className="text-sm font-semibold text-slate-700 truncate transition-colors duration-200 group-hover:text-blue-600">
              {item.name}
            </span>
          </div>

          {/* Delete Action (visible on hover on desktop, always visible with low opacity on touch devices) */}
          <button
            onClick={() => handleOpenDeleteConfirm(item.id)}
            disabled={isDeleting || isPending}
            className="opacity-40 hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50 transition-all cursor-pointer"
            title="Delete Category"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Children Render with Dashed Connector Lines */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col w-full border-l border-dashed border-slate-200 ml-6.5 pl-3 mt-1">
            {item.children.map((child) => renderCategoryNode(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[520px]">
        
        {/* Left Column: Categories List */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Categories
            </h2>
            <button
              onClick={() => {
                setParentId("")
                const inputEl = document.getElementById("cat-name")
                if (inputEl) inputEl.focus()
              }}
              className="bg-[#0f60c4] hover:bg-[#0c50a3] text-white px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              + Add Root Category
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {initialTree.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50 flex-1 flex flex-col items-center justify-center">
              <Folder className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm font-semibold">No categories yet</p>
              <p className="text-slate-400 text-xs mt-1">Add a category using the panel on the right.</p>
            </div>
          ) : (
            <div className="flex flex-col w-full max-h-[500px] overflow-y-auto pr-2 mt-2 gap-1">
              {initialTree.map((rootItem) => renderCategoryNode(rootItem))}
            </div>
          )}
        </div>

        {/* Right Column: Add Category Form */}
        <div className="p-4 sm:p-6 md:p-8 bg-slate-50/30 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800">
            Add Category
          </h2>

          <form onSubmit={handleCreate} className="flex flex-col gap-6">
            {/* Parent Category Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="cat-parent" className="text-xs font-bold text-slate-500">
                Parent Category
              </label>
              <select
                id="cat-parent"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                disabled={isPending}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-sm cursor-pointer"
              >
                <option value="">-- No Parent (Root Category) --</option>
                {availableParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="cat-name" className="text-xs font-bold text-slate-500">
                Category Name
              </label>
              <input
                id="cat-name"
                type="text"
                placeholder="e.g., Classic"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
              />
            </div>

            {/* Computed Level Display (Matches Level dropdown mockup) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="cat-level" className="text-xs font-bold text-slate-500">
                Level
              </label>
              <select
                id="cat-level"
                value={computedLevel.toString()}
                disabled={true}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none transition-all shadow-sm cursor-not-allowed appearance-none"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="mt-2 py-2.5 px-8 rounded-lg bg-[#0f60c4] hover:bg-[#0c50a3] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 self-start cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setIdToDelete(null)
        }}
        isPending={deletingId !== null}
      />
    </div>
  )
}
