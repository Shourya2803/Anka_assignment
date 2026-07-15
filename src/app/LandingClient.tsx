"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, FolderTree, ShieldCheck, ArrowRight } from "lucide-react"

interface LandingClientProps {
  user: any
  userIsAdmin: boolean
}

export default function LandingClient({ user, userIsAdmin }: LandingClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 12,
      },
    },
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-900 overflow-hidden font-sans">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[80%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* Header / Navbar */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center border-b border-slate-100"
      >
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
          BookStore
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/books"
            className="text-sm font-semibold text-slate-650 hover:text-blue-600 transition-colors"
          >
            All Books
          </Link>
          {user ? (
            <Link
              href={userIsAdmin ? "/admin/dashboard" : "/books"}
              className="px-5 py-2 rounded-full bg-slate-900 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/10 text-white text-xs font-semibold transition-all duration-300"
            >
              Enter App
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-xs font-semibold text-slate-650 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/10 text-white text-xs font-semibold transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center py-10 sm:py-16"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          Production-Ready Architecture
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6 text-slate-950"
        >
          The ultimate platform to{" "}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            curate & catalog
          </span>{" "}
          your digital library
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg text-slate-650 max-w-2xl mb-8 leading-relaxed"
        >
          An elegant Book Management solution powered by Next.js 15, Clerk, and Prisma. Access a clean database architecture with hierarchical categories, favorites, and detailed audit logging.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 sm:mb-20"
        >
          {user ? (
            <Link
              href={userIsAdmin ? "/admin/dashboard" : "/books"}
              className="group px-7 py-3.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Go to {userIsAdmin ? "Admin Dashboard" : "Book Catalog"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link
                href="/books"
                className="group px-7 py-3.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sign-in"
                className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-2xs"
              >
                Sign In / Register
              </Link>
            </>
          )}
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)", borderColor: "rgba(124, 58, 237, 0.2)" }}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left transition-all duration-300 group/card cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-4 border border-violet-100/80 transition-colors group-hover/card:bg-violet-600 group-hover/card:text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 transition-colors group-hover/card:text-violet-700">Book Cataloging</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Curate books with cover images, details, and authors. Enforces categorization strictly at the category leaf-node levels.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)", borderColor: "rgba(79, 70, 229, 0.2)" }}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left transition-all duration-300 group/card cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100/80 transition-colors group-hover/card:bg-indigo-600 group-hover/card:text-white">
              <FolderTree className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 transition-colors group-hover/card:text-indigo-700">Hierarchical Categories</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organize books using a multi-level self-referential category tree structure. Maximum category depth is restricted to 3.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)", borderColor: "rgba(16, 185, 129, 0.2)" }}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left transition-all duration-300 group/card cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100/80 transition-colors group-hover/card:bg-emerald-600 group-hover/card:text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 transition-colors group-hover/card:text-emerald-700">Favorites & Security</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Save books to your favorites collection, fully protected by middleware, with comprehensive activity auditing for admins.
            </p>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 py-6 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} BookStore. Developed with Next.js 15, Prisma, and Clerk.</p>
      </footer>
    </div>
  )
}
