"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, ListFilter, Sparkles } from "lucide-react"

interface Category {
  id: string
  name: string
  parentId: string | null
  level: number
}

interface CategoryNode {
  id: string
  name: string
  parentId: string | null
  level: number
  children: CategoryNode[]
}

interface CategorySidebarProps {
  categories: Category[]
  selectedCategoryId: string
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
}: CategorySidebarProps) {
  const [tree, setTree] = useState<CategoryNode[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const [isOpenMobile, setIsOpenMobile] = useState(false)

  // Build tree on mount and when categories change
  useEffect(() => {
    const map = new Map<string, CategoryNode>()
    categories.forEach((c) => map.set(c.id, { ...c, children: [] }))
    
    const roots: CategoryNode[] = []
    map.forEach((node) => {
      if (node.parentId) {
        const parent = map.get(node.parentId)
        if (parent) {
          parent.children.push(node)
        } else {
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    })
    
    const sortNodes = (nodes: CategoryNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name))
      nodes.forEach((n) => sortNodes(n.children))
    }
    sortNodes(roots)
    setTree(roots)
  }, [categories])

  // Auto-expand parents of selected category
  useEffect(() => {
    if (selectedCategoryId) {
      setExpanded((prev) => {
        const newExpanded = { ...prev }
        let currentId = selectedCategoryId
        while (currentId) {
          const cat = categories.find((c) => c.id === currentId)
          if (cat && cat.parentId) {
            newExpanded[cat.parentId] = true
            currentId = cat.parentId
          } else {
            break
          }
        }
        return newExpanded
      })
    }
  }, [selectedCategoryId, categories])

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const renderNode = (node: CategoryNode) => {
    const hasChildren = node.children.length > 0
    const isExpanded = !!expanded[node.id]
    const isActive = selectedCategoryId === node.id

    return (
      <div key={node.id} className="flex flex-col">
        {/* Row container */}
        <div className="group flex items-center justify-between w-full">
          <Link
            href={`/books?categoryId=${node.id}`}
            className={`flex-1 flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs transition-all duration-200 truncate ${
              isActive
                ? "bg-[#0f60c4] text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-0.5 font-medium"
            }`}
          >
            {/* Indent level indicator for visual hierarchy */}
            {node.level === 1 && !isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 group-hover:bg-blue-500 transition-colors shrink-0" />
            )}
            <span>{node.name}</span>
          </Link>

          {/* Toggle expand button (only if has subcategories) */}
          {hasChildren && (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className={`p-1 hover:bg-slate-100 rounded-md text-slate-450 hover:text-slate-700 transition-all shrink-0 ml-1 ${
                isActive ? "hover:bg-blue-700 text-white/80 hover:text-white" : ""
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Children branch */}
        {hasChildren && isExpanded && (
          <div className="ml-3.5 pl-3 border-l border-slate-200/60 flex flex-col gap-1.5 mt-1 mb-1">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div 
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="flex items-center justify-between pb-2 border-b border-slate-100 cursor-pointer lg:cursor-default"
      >
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 select-none">
          <ListFilter className="w-3.5 h-3.5 text-slate-500" />
          <span>Categories</span>
          <span className="text-[10px] font-medium text-slate-400 normal-case lg:hidden">
            ({isOpenMobile ? "tap to hide" : "tap to show"})
          </span>
        </h2>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {selectedCategoryId && (
            <Link
              href="/books"
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
            >
              Clear
            </Link>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 lg:hidden ${isOpenMobile ? "rotate-180" : ""}`} />
        </div>
      </div>

      <div className={`flex-col gap-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 lg:flex ${isOpenMobile ? "flex" : "hidden"}`}>
        {/* All Genres Link */}
        <Link
          href="/books"
          className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            !selectedCategoryId
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${!selectedCategoryId ? "text-amber-400" : "text-slate-400"}`} />
          <span>All Genres</span>
        </Link>

        {/* Categories Tree */}
        <div className="flex flex-col gap-1.5 mt-1">
          {tree.map((node) => renderNode(node))}
        </div>
      </div>
    </div>
  )
}
