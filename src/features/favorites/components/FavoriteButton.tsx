"use client"

import React, { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { toggleFavoriteAction } from "../actions/favorite.actions"
import { toast } from "sonner"

interface FavoriteButtonProps {
  bookId: string
  initialFavorited: boolean
  variant?: "icon" | "detail" | "remove-btn"
}

export default function FavoriteButton({
  bookId,
  initialFavorited,
  variant = "icon",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Optimistically update UI
    const previousState = isFavorited
    setIsFavorited(!previousState)

    startTransition(async () => {
      const res = await toggleFavoriteAction(bookId)
      
      if (!res.success) {
        // Revert to previous state if action fails
        setIsFavorited(previousState)
        toast.error(res.error || "Failed to update favorites")
      } else {
        toast.success(
          res.isFavorited
            ? "Added to favorites!"
            : "Removed from favorites!"
        )
      }
    })
  }

  if (variant === "remove-btn") {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`px-4 py-2 bg-white border rounded-xl text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50 transition-all duration-300 ${
          isFavorited
            ? "border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            : "border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
        }`}
      >
        {isFavorited ? "Remove" : "Add"}
      </button>
    )
  }

  if (variant === "detail") {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 border rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-sm ${
          isFavorited
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100/70"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            isFavorited ? "fill-red-500 text-red-500 scale-110" : "text-slate-400"
          }`}
        />
        <span>{isFavorited ? "Remove from Favorites" : "Add to Favorites"}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2.5 rounded-full border transition-all duration-300 transform active:scale-95 ${
        isFavorited
          ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      }`}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-300 ${
          isFavorited ? "fill-current scale-110" : "scale-100"
        }`}
      />
    </button>
  )
}
