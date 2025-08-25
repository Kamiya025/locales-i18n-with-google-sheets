"use client"

import { ReactNode } from "react"
import { buttonVariants } from "@/lib/variants"
import { cn } from "@/lib/utils"

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
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
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
