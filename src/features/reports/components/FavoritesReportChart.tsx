"use client"

import React, { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface ChartPoint {
  name: string
  count: number
  showTick: boolean
}

interface FavoritesReportChartProps {
  totalCount: number
  chartData: ChartPoint[]
}

export default function FavoritesReportChart({ totalCount, chartData }: FavoritesReportChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-[400px] flex items-center justify-center text-slate-400 text-sm">
        Loading report visualizer...
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
      {/* Report Summary Card Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Books Marked as Favorite in Last Month
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Mockup's mini bar chart icon */}
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-end gap-1 w-11 h-11 justify-center shrink-0">
          <div className="w-1.5 h-3 bg-blue-600 rounded-full" />
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
        </div>
      </div>

      {/* Main Curve Chart */}
      <div className="h-[260px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.00} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight="600"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, idx) => {
                const item = chartData[idx]
                return item && item.showTick ? value : ""
              }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              fontWeight="600"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
              labelStyle={{ color: "#475569", fontWeight: "bold" }}
              itemStyle={{ color: "#2563eb", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#blueAreaGradient)"
              activeDot={{ r: 5, strokeWidth: 0, fill: "#2563eb" }}
              dot={{ r: 3.5, strokeWidth: 0, fill: "#2563eb" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
