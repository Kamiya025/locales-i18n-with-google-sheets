"use client"

import { forwardRef, InputHTMLAttributes } from "react"

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "glass" | "outline"
  size?: "sm" | "md" | "lg"
  error?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      size = "md",
      error = false,
      icon,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full border outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
      default:
        "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      glass:
        "glass-effect border-white/30 backdrop-blur-sm hover:border-slate-300/40 focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400/50 text-slate-700 placeholder-slate-400",
      outline:
        "bg-transparent border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-slate-400",
    }

    const sizeClasses = {
      sm: "px-3 py-2 text-sm rounded-lg",
      md: "px-4 py-3 text-base rounded-lg",
      lg: "px-6 py-4 text-lg rounded-xl",
    }

    const errorClasses = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : ""

    const iconClasses = icon
      ? iconPosition === "left"
        ? "pl-10"
        : "pr-10"
      : ""

    if (icon) {
      return (
        <div className="relative">
          {iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${errorClasses}
            ${iconClasses}
            ${className}
          `.trim()}
            {...props}
          />
          {iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${errorClasses}
        ${className}
      `.trim()}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export default Input
