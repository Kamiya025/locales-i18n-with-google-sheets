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
    "inline-flex items-center justify-center font-bold text-center rounded-lg transition-all duration-200"

  const variantClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-slate-200 text-slate-700",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-white",
    error: "bg-red-500 text-white",
    language: "gradient-primary text-white font-bold uppercase",
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
