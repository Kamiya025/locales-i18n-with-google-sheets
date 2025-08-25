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
      "w-full border outline-none transition-all duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed relative"

    const variantClasses = {
      default:
        "bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 border-blue-200/40 backdrop-blur-lg shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/15 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 text-slate-700 placeholder-slate-400",
      glass:
        "bg-white/80 backdrop-blur-xl border-white/50 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-300/40 focus:ring-2 focus:ring-slate-400/50 focus:border-white/70 text-slate-700 placeholder-slate-400",
      outline:
        "bg-white/60 backdrop-blur-xl border-2 border-slate-300 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-300/30 focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 text-slate-700 placeholder-slate-400",
    }

    const sizeClasses = {
      sm: "px-4 py-2.5 text-sm rounded-xl",
      md: "px-6 py-3.5 text-base rounded-xl",
      lg: "px-8 py-4.5 text-lg rounded-xl",
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
