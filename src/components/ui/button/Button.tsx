"use client"

import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "glass" | "gradient" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
}

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "left",
}: Readonly<ButtonProps>) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "gradient-secondary text-white hover:shadow-lg soft-shadow",
    glass:
      "glass-effect border border-white/30 text-slate-700 backdrop-blur-sm hover:border-slate-300/40 focus:ring-slate-400/50",
    gradient:
      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-105 soft-shadow",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  // Loading spinner component moved outside for better performance

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  )
}
