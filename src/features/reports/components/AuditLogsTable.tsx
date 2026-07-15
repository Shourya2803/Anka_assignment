"use client"

import React, { useState } from "react"
import { ClipboardList, ShieldAlert, Calendar, User } from "lucide-react"

interface AuditLog {
  id: string
  createdAt: Date | string
  action: string
  entity: string
  entityId: string
  admin: {
    name: string | null
    email: string
  }
}

interface AuditLogsTableProps {
  logs: AuditLog[]
  adminEmail: string
}

export default function AuditLogsTable({ logs, adminEmail }: AuditLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const totalPages = Math.ceil(logs.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage)

  const getActionStyles = (action: string) => {
    if (action.startsWith("CREATE_")) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (action.startsWith("UPDATE_")) return "bg-indigo-50 text-indigo-700 border-indigo-200"
    if (action.startsWith("DELETE_")) return "bg-red-50 text-red-700 border-red-200"
    return "bg-slate-50 text-slate-600 border border-slate-200"
  }

  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-slate-500" />
          Audit Trail Logs (Recent 100 Actions)
        </h2>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No audit logs found.</p>
          <p className="text-slate-400 text-xs mt-1">Actions performed by admins will appear here automatically.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
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
                {paginatedLogs.map((log) => (
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
                            {log.admin.email.toLowerCase().replace(/\+clerk_test/g, "").trim() === adminEmail.toLowerCase().trim()
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

          {/* Centered Pagination Panel */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                «
              </button>
              
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    currentPage === p
                      ? "bg-[#0f60c4] text-white border-[#0f60c4]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                »
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
