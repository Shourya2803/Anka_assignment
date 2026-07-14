"use client"

import React, { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts"

interface ChartDataPoint {
  name: string
  value: number
}

interface TimelinePoint {
  month: string
  count: number
}

interface DashboardChartsProps {
  booksPerCategory: ChartDataPoint[]
  favoritesTimeline: TimelinePoint[]
}

export default function DashboardCharts({
  booksPerCategory,
  favoritesTimeline,
}: DashboardChartsProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[300px] bg-slate-900/10 border border-slate-900 rounded-2xl flex items-center justify-center text-slate-500 text-xs font-semibold">
          Loading charts...
        </div>
        <div className="h-[300px] bg-slate-900/10 border border-slate-900 rounded-2xl flex items-center justify-center text-slate-500 text-xs font-semibold">
          Loading charts...
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">
          Books Per Category
        </h3>
        <div className="h-[280px] w-full">
          {booksPerCategory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No category data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={booksPerCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                  itemStyle={{ color: "#6366f1" }}
                />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Favorites Timeline Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">
          Favorites Growth Timeline
        </h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={favoritesTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                itemStyle={{ color: "#10b981" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
