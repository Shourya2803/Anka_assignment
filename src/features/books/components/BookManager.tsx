"use client"

import React, { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  BookOpen,
  Loader2,
} from "lucide-react"
import { createBookAction, updateBookAction, deleteBookAction } from "../actions/book.actions"
import BookForm from "./BookForm"
import { toast } from "sonner"
import ConfirmationModal from "@/components/ui/ConfirmationModal"

interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  categoryId: string
  category: {
    id: string
    name: string
  }
  createdAt: Date
}

interface CategoryItem {
  id: string
  name: string
  level: number
  isLeaf: boolean
  path: string
}

interface BookManagerProps {
  initialBooks: Book[]
  totalBooks: number
  totalPages: number
  currentPage: number
  categories?: CategoryItem[]
}

export default function BookManager({
  initialBooks,
  totalBooks: serverTotalBooks,
  totalPages: serverTotalPages,
  currentPage: serverCurrentPage,
  categories = [],
}: BookManagerProps) {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [totalBooks, setTotalBooks] = useState(serverTotalBooks)
  const [totalPages, setTotalPages] = useState(serverTotalPages)
  const [currentPage, setCurrentPage] = useState(serverCurrentPage)

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Confirmation Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  // Synchronize state when server side props update
  useEffect(() => {
    setBooks(initialBooks)
    setTotalBooks(serverTotalBooks)
    setTotalPages(serverTotalPages)
    setCurrentPage(serverCurrentPage)
  }, [initialBooks, serverTotalBooks, serverTotalPages, serverCurrentPage])

  const fetchData = async (page: number, searchVal: string, catVal: string) => {
    const query = new URLSearchParams()
    query.set("page", page.toString())
    if (searchVal) query.set("search", searchVal)
    if (catVal) query.set("categoryId", catVal)

    const url = `${window.location.pathname}?${query.toString()}`
    router.push(url)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    fetchData(page, search, selectedCategory)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchData(1, search, selectedCategory)
  }

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedCategory(val)
    setCurrentPage(1)
    fetchData(1, search, val)
  }

  const handleResetFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setCurrentPage(1)
    fetchData(1, "", "")
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setSearch(params.get("search") || "")
      setSelectedCategory(params.get("categoryId") || "")
    }
  }, [])

  const handleOpenCreate = () => {
    setEditingBook(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
      let res
      if (editingBook) {
        res = await updateBookAction(editingBook.id, formData)
      } else {
        res = await createBookAction(formData)
      }

      if (res.success) {
        setIsFormOpen(false)
        setEditingBook(null)
        toast.success(editingBook ? "Book updated successfully!" : "Book created successfully!")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to save book")
      }
    })
  }

  const handleOpenDeleteConfirm = (bookId: string) => {
    setIdToDelete(bookId)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!idToDelete) return
    setDeletingId(idToDelete)
    setDeleteConfirmOpen(false)

    const res = await deleteBookAction(idToDelete)
    setDeletingId(null)
    setIdToDelete(null)

    if (res.success) {
      toast.success("Book deleted successfully!")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to delete book")
    }
  }

  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="relative w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 pr-10 py-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const indent = "\u00A0\u00A0".repeat(cat.level - 1)
                return (
                  <option key={cat.id} value={cat.id}>
                    {indent + cat.name}
                  </option>
                )
              })}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {(search || selectedCategory) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              Reset
            </button>
          )}

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-[#0f60c4] hover:bg-[#0c50a3] text-xs font-bold text-white shadow-sm flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Main Books White Card */}
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-800">
          All Books
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
            <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-500 font-semibold">No books matching your criteria.</p>
            <p className="text-slate-400 text-xs mt-1">Try resetting the search query or category filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {books.map((book) => {
              const isDeleting = deletingId === book.id
              return (
                <div
                  key={book.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-slate-50/55 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all shadow-sm w-full gap-4"
                >
                  {/* Left block: Cover, main titles, and description */}
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-14 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm transition-all duration-300">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-base leading-snug truncate transition-colors duration-200 group-hover:text-blue-600" title={book.title}>
                        {book.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-slate-500 font-semibold" title={book.author}>
                          by {book.author}
                        </span>
                      </div>
                      {book.description && (
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-1 max-w-2xl">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center block: Category breadcrumbs tag */}
                  <div className="shrink-0 flex items-center pr-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-2xs">
                      {book.category.name}
                    </span>
                  </div>

                  {/* Right block: Action buttons with text labels */}
                  <div className="flex items-center gap-2 shrink-0 sm:pl-4 sm:border-l border-slate-100">
                    <button
                      onClick={() => handleOpenEdit(book)}
                      disabled={isPending || isDeleting}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition shadow-2xs cursor-pointer"
                      title="Edit Book"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteConfirm(book.id)}
                      disabled={isPending || isDeleting}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-red-600 hover:border-red-200 transition shadow-2xs cursor-pointer"
                      title="Delete Book"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Centered Numbered Pagination Panel */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8 border-t border-slate-100 pt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
            >
              «
            </button>
            
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold border transition cursor-pointer ${
                  currentPage === p
                    ? "bg-[#0f60c4] text-white border-[#0f60c4]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
            >
              »
            </button>
          </div>
        )}

      </div>

      {/* Book Form Panel */}
      <BookForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBook}
        categories={categories}
        isPending={isPending}
      />

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
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
