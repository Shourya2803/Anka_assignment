import React from "react"
import { getDashboardStats } from "@/features/reports/services/report.service"
import DashboardCharts from "@/features/reports/components/DashboardCharts"
import { BookOpen, FolderTree, Users, Heart, Star, Sparkles } from "lucide-react"

export const metadata = {
  title: "BookStore Admin | Dashboard",
  description: "View system metrics, category statistics, and activity analysis.",
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <span className="text-3xl font-extrabold text-slate-900 mt-1">{value}</span>
      </div>
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-650">
        {icon}
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          System Overview
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Monitor your digital library's growth, engagement, and catalogs.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<FolderTree className="w-5 h-5" />}
        />
        <StatCard
          title="Registered Readers"
          value={stats.totalUsers}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Saved Favorites"
          value={stats.totalFavorites}
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      {/* Recharts Graphical Visualizer */}
      <DashboardCharts
        booksPerCategory={stats.booksPerCategory}
        favoritesTimeline={stats.favoritesTimeline}
      />

      {/* Lists Row (Top Favorites vs Recently Added) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Most Popular Books */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-500" />
            Top 5 Popular Books
          </h3>
          {stats.topBooks.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No favorites saved yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {stats.topBooks.map((book, idx) => (
                <div key={book.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-400 w-4">#{idx + 1}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm truncate">{book.title}</div>
                      <div className="text-slate-500 text-xs truncate mt-0.5">{book.author}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4 shrink-0">
                    <span className="text-xs font-bold text-slate-700">{book.favoriteCount}</span>
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Books */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-500" />
            Recently Cataloged
          </h3>
          {stats.recentBooks.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No books added yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {stats.recentBooks.map((book) => (
                <div key={book.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{book.title}</div>
                    <div className="text-slate-500 text-xs truncate mt-0.5">{book.author}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider ml-4">
                    {new Date(book.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
