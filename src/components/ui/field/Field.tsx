"use client"

import { ReactNode } from "react"
import { Field, Description, Label } from "@headlessui/react"

interface FieldWrapperProps {
  label?: string | ReactNode
  description?: string
  error?: string | string[]
  children: ReactNode
  className?: string
  required?: boolean
}

export default function FieldWrapper({
  label,
  description,
  error,
  children,
  className = "",
  required = false,
}: FieldWrapperProps) {
  const errorMessages = Array.isArray(error) ? error : error ? [error] : []
  const hasError = errorMessages.length > 0

  return (
    <Field className={`space-y-2 ${className}`}>
      {label && (
        <Label
          className={`block text-sm font-medium transition-colors duration-200 ${
            hasError ? "text-red-600" : "text-slate-700 hover:text-slate-900"
          }`}
        >
          <div className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </div>
        </Label>
      )}

      {description && (
        <Description className="text-sm text-slate-500">
          {description}
        </Description>
      )}

      <div className="relative">{children}</div>

      {/* Error Messages */}
      {hasError && (
        <div className="space-y-1">
          {errorMessages.map((message, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-red-600 animate-fade-in"
            >
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message}</span>
            </div>
          ))}
        </div>
      )}
    </Field>
  )
}

// Export both named and default
export { FieldWrapper }
