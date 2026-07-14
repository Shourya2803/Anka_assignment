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
        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-55 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
      >
        {isFavorited ? "Remove" : "Add"}
      </button>
    )
  }

  if (variant === "detail") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center shrink-0">
          <Heart
            className={`w-6 h-6 transition-all duration-300 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-slate-300"
            }`}
          />
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>
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
