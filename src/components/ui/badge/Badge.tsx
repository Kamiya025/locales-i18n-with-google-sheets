"use client"

import { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "language"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: Readonly<BadgeProps>) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold text-center rounded-xl transition-all duration-300 ease-out backdrop-blur-lg border shadow-md relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:pointer-events-none before:z-[1]"

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500/90 via-indigo-600/90 to-purple-600/90 text-white shadow-blue-500/25 border-blue-300/20 hover:shadow-lg hover:shadow-blue-600/30 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
    secondary:
      "bg-gradient-to-r from-slate-100/95 via-slate-200/90 to-slate-300/85 text-slate-700 shadow-slate-500/15 border-slate-300/30 hover:shadow-lg hover:shadow-slate-600/20 before:bg-gradient-to-r before:from-white/30 before:to-transparent",
    success:
      "bg-gradient-to-r from-emerald-500/90 via-green-600/90 to-teal-600/90 text-white shadow-emerald-500/25 border-emerald-300/20 hover:shadow-lg hover:shadow-emerald-600/30 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
    warning:
      "bg-gradient-to-r from-amber-500/90 via-orange-600/90 to-yellow-600/90 text-white shadow-amber-500/25 border-amber-300/20 hover:shadow-lg hover:shadow-amber-600/30 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
    error:
      "bg-gradient-to-r from-red-500/90 via-rose-600/90 to-pink-600/90 text-white shadow-red-500/25 border-red-300/20 hover:shadow-lg hover:shadow-red-600/30 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
    language:
      "bg-gradient-to-r from-violet-500/90 via-purple-600/90 to-indigo-600/90 text-white font-bold uppercase shadow-violet-500/25 border-violet-300/20 hover:shadow-lg hover:shadow-violet-600/30 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  }

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  )
}
