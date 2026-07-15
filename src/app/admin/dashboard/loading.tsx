import React from "react"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 font-sans w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-9 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 rounded-md animate-pulse" />
      </div>

      {/* Stats Cards Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex flex-col gap-2 w-2/3">
              <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
              <div className="h-8 w-12 bg-slate-200/80 rounded-md mt-1 animate-pulse" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Recharts Graphical Visualizer Skeleton */}
      <div className="w-full h-80 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
        <div className="h-4 w-32 bg-slate-200/80 rounded animate-pulse" />
        <div className="flex-1 w-full bg-slate-50/60 rounded-xl animate-pulse" />
      </div>

      {/* Lists Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Popular Books Skeleton */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="h-4 w-36 bg-slate-200/80 rounded animate-pulse" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3 w-3/4">
                  <div className="h-3 w-4 bg-slate-100 rounded animate-pulse" />
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-8 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Recently Cataloged Skeleton */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="h-4 w-36 bg-slate-200/80 rounded animate-pulse" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between border-b border-slate-50 last:border-0">
                <div className="flex flex-col gap-1.5 w-2/3">
                  <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
