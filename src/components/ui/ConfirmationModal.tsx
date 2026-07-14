"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isPending = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in" onClick={onCancel} />

      {/* Modal Dialog Box */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-6 flex flex-col items-center text-center gap-4 animate-scale-in">
        
        {/* Warning Icon Container */}
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-slate-800">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-normal">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-sm transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isPending ? "Processing..." : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}
