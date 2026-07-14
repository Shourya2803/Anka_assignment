"use client"

import React, { useState, useEffect } from "react"

interface CategoryItem {
  id: string
  name: string
  level: number
  isLeaf: boolean
}

interface BookFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  initialData?: {
    id: string
    title: string
    author: string
    description: string
    categoryId: string
    coverImage: string
  } | null
  categories: CategoryItem[]
  isPending: boolean
}

export default function BookForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories = [],
  isPending,
}: BookFormProps) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setAuthor(initialData.author)
      setDescription(initialData.description)
      setCategoryId(initialData.categoryId)
      setCoverFile(null)
    } else {
      setTitle("")
      setAuthor("")
      setDescription("")
      setCategoryId("")
      setCoverFile(null)
    }
  }, [initialData, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !author.trim() || !description.trim() || !categoryId) return

    const formData = new FormData()
    formData.append("title", title)
    formData.append("author", author)
    formData.append("description", description)
    formData.append("categoryId", categoryId)
    if (coverFile) {
      formData.append("coverImage", coverFile)
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Dark blur overlay backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Mockup Center White Card */}
      <div className="relative z-10 w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Label-to-Input Grid Column Layout */}
          <div className="grid grid-cols-[140px_1fr] items-start gap-y-5 gap-x-6">
            
            {/* Title Field */}
            <label htmlFor="book-title" className="text-sm font-semibold text-slate-700 self-center">
              Title
            </label>
            <input
              id="book-title"
              type="text"
              placeholder="e.g. Pride and Prejudice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isPending}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
            />

            {/* Author Field */}
            <label htmlFor="book-author" className="text-sm font-semibold text-slate-700 self-center">
              Author
            </label>
            <input
              id="book-author"
              type="text"
              placeholder="e.g. Jane Austen"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled={isPending}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
            />

            {/* Description Field */}
            <label htmlFor="book-desc" className="text-sm font-semibold text-slate-700 pt-2">
              Description
            </label>
            <textarea
              id="book-desc"
              placeholder="e.g. The story revolves around the Bennet family..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              disabled={isPending}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all resize-none shadow-sm"
            />

            {/* Category Breadcrumbs Field */}
            <label htmlFor="book-category" className="text-sm font-semibold text-slate-700">
              Category<br/>
              <span className="text-xs font-normal text-slate-500">(Leaf Level Only)</span>
            </label>
            <select
              id="book-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={isPending}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-sm cursor-pointer font-medium"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => {
                const indent = "\u00A0\u00A0".repeat(cat.level - 1)
                return (
                  <option key={cat.id} value={cat.id} disabled={!cat.isLeaf}>
                    {indent + cat.name}
                  </option>
                )
              })}
            </select>

            {/* File upload Field */}
            <label className="text-sm font-semibold text-slate-700 self-center">
              Book Cover
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="cover-upload"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md cursor-pointer text-xs font-semibold text-slate-700 transition shadow-sm whitespace-nowrap"
              >
                Choose File
              </label>
              <input
                id="cover-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                disabled={isPending}
                className="hidden"
              />
              <span className="text-xs text-slate-500 truncate max-w-[240px]">
                {coverFile ? coverFile.name : (initialData ? "pride.jpg" : "No file chosen")}
              </span>
            </div>

          </div>

          {/* Action buttons (Horizontally aligned at the bottom left) */}
          <div className="flex items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={isPending || !title.trim() || !author.trim() || !categoryId}
              className="bg-[#0f60c4] hover:bg-[#0c50a3] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
            >
              {isPending ? "Saving..." : "Save Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
