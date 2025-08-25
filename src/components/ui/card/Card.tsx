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
  const baseClasses = "border transition-all duration-300"

  const variantClasses = {
    default: "bg-white border-gray-200",
    glass: "glass-effect border-white/30 backdrop-blur-sm",
    outline: "bg-transparent border-slate-300",
  }

  const sizeClasses = {
    sm: "p-3 rounded-lg",
    md: "p-6 rounded-xl",
    lg: "p-8 rounded-2xl",
  }

  const shadowClasses = {
    none: "",
    sm: "soft-shadow",
    md: "soft-shadow-lg",
    lg: "shadow-2xl",
  }

  const hoverClasses = hover ? "hover:shadow-lg hover:scale-[1.02]" : ""

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
