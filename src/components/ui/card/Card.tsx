"use client"

import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "glass" | "outline"
  size?: "sm" | "md" | "lg"
  shadow?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

export default function Card({
  children,
  className = "",
  variant = "default",
  size = "md",
  shadow = "sm",
  hover = false,
}: Readonly<CardProps>) {
  const baseClasses =
    "border transition-all duration-500 ease-out relative overflow-hidden"

  const variantClasses = {
    default:
      "bg-gradient-to-br from-white/90 via-slate-50/95 to-blue-50/90 border-blue-200/30 backdrop-blur-xl text-slate-800 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-inherit before:pointer-events-none",
    glass:
      "bg-white/80 backdrop-blur-xl border-white/50 text-slate-800 shadow-xl shadow-slate-200/30 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:rounded-inherit before:pointer-events-none",
    outline:
      "bg-white/60 backdrop-blur-xl border-2 border-slate-300 text-slate-700 shadow-lg shadow-slate-200/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-inherit before:pointer-events-none",
  }

  const sizeClasses = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-xl",
    lg: "p-8 rounded-2xl",
  }

  const shadowClasses = {
    none: "",
    sm: "shadow-lg shadow-blue-500/10",
    md: "shadow-xl shadow-blue-500/15",
    lg: "shadow-2xl shadow-blue-500/20",
  }

  const hoverClasses = hover
    ? "hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-[1.02] hover:border-blue-300/60 hover:-translate-y-0.5"
    : ""

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${shadowClasses[shadow]}
        ${hoverClasses}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}
