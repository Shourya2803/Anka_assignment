import React from "react"
import prisma from "@/lib/prisma"
import FavoritesReportChart from "@/features/reports/components/FavoritesReportChart"
import AuditLogsTable from "@/features/reports/components/AuditLogsTable"

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
      <FavoritesReportChart
        totalCount={lastMonthFavoritesCount}
        chartData={chartData}
      />

      {/* Activity Table Card (Audit Logs) */}
      <AuditLogsTable logs={logs} adminEmail={process.env.ADMIN_EMAIL || ""} />
    </div>
  )
}
