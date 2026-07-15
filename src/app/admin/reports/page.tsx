import React from "react"
import prisma from "@/lib/prisma"
import { ClipboardList, User, Calendar, ShieldAlert } from "lucide-react"
import FavoritesReportChart from "@/features/reports/components/FavoritesReportChart"

export const metadata = {
  title: "BookStore Admin | Audit Reports",
  description: "Review system activity logs and administrative operations.",
}

export default async function AdminReportsPage() {
  // Fetch activity audit logs from the database
  const logs = await prisma.auditLog.findMany({
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100, // Limit to recent 100 entries for readability
  })

  // Calculate dynamic favorites statistics for the last 30 days
  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Total favorites created in the last 30 days
  const lastMonthFavoritesCount = await prisma.favorite.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  })

  // Fetch all favorites created in the last 30 days to build the growth chart
  const recentFavorites = await prisma.favorite.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Compile the chart timeline data points (12 steps spanning the last 30 days)
  const chartData = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getTime() - i * (30 / 11) * 24 * 60 * 60 * 1000)
    const label = `${monthNames[date.getMonth()]} ${date.getDate()}`
    
    // Cumulative count of favorites created in this 30-day window up to this timestamp
    const countAtDate = recentFavorites.filter(f => f.createdAt <= date).length
    
    // We space out X-axis tick labels for 5 specific points to replicate the mockup style
    const showTick = (11 - i) % 3 === 0 || i === 0
    
    chartData.push({
      name: label,
      count: countAtDate,
      showTick,
    })
  }

  // Format action text for clean badges
  const getActionStyles = (action: string) => {
    if (action.startsWith("CREATE_")) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (action.startsWith("UPDATE_")) return "bg-indigo-50 text-indigo-700 border-indigo-200"
    if (action.startsWith("DELETE_")) return "bg-red-50 text-red-700 border-red-200"
    return "bg-slate-50 text-slate-600 border border-slate-200"
  }

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Reports
        </h1>
      </div>

      {/* Dynamic Favorites Line/Area Chart Card */}
      <div className="flex justify-start">
        <FavoritesReportChart
          totalCount={lastMonthFavoritesCount}
          chartData={chartData}
        />
      </div>

      {/* Activity Table Card (Audit Logs) */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-slate-500" />
            Audit Trail Logs (Recent 100 Actions)
          </h2>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
            Immutable log
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No audit logs found.</p>
            <p className="text-slate-400 text-xs mt-1">Actions performed by admins will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-4 pl-2">Timestamp</th>
                  <th className="pb-4">Administrator</th>
                  <th className="pb-4">Action Event</th>
                  <th className="pb-4">Target Entity</th>
                  <th className="pb-4 pr-2 text-right">Entity ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-4 pl-2 text-xs text-slate-500 font-semibold whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs group-hover:text-blue-600 transition-colors duration-200">
                            {log.admin.email.toLowerCase().replace(/\+clerk_test/g, "").trim() === (process.env.ADMIN_EMAIL || "").toLowerCase().trim()
                              ? "Admin"
                              : (log.admin.name || "User")}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{log.admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getActionStyles(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-600">
                      {log.entity}
                    </td>
                    <td className="py-4 pr-2 text-right text-[10px] font-mono text-slate-450 select-all">
                      {log.entityId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
