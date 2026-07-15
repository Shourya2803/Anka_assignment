import React from "react"

export default function AuthCallbackLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans p-6">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        {/* Animated Custom Spinner */}
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 animate-pulse" />
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
        
        <div className="flex flex-col gap-1 mt-2">
          <h2 className="text-lg font-bold text-slate-800">Authenticating...</h2>
          <p className="text-sm text-slate-400 font-medium">
            Please wait while we sync your secure session data.
          </p>
        </div>
      </div>
    </div>
  )
}
