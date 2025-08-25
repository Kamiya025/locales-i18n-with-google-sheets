"use client"
import React, { useState } from "react"

interface SwitchProps {
  label?: string
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  color?: "blue" | "gray" // Added prop to toggle color theme
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue", // Default to blue color
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleToggle = () => {
    if (disabled) return
    const newCheckedState = !isChecked
    setIsChecked(newCheckedState)
    if (onChange) {
      onChange(newCheckedState)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      handleToggle()
    }
  }

  const switchColors =
    color === "blue"
      ? {
          background: isChecked
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200"
            : "bg-slate-200 dark:bg-slate-700", // Blue version
          knob: isChecked
            ? "translate-x-full bg-white shadow-lg"
            : "translate-x-0 bg-white shadow-md",
        }
      : {
          background: isChecked
            ? "bg-gradient-to-r from-slate-600 to-slate-800 shadow-lg shadow-slate-200"
            : "bg-slate-200 dark:bg-slate-700", // Gray version
          knob: isChecked
            ? "translate-x-full bg-white shadow-lg"
            : "translate-x-0 bg-white shadow-md",
        }

  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        className={`relative inline-flex h-7 w-[53px] px-0.5 items-center rounded-full border border-white/20 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 ${
          disabled
            ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
            : `${switchColors.background} cursor-pointer hover:shadow-lg`
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="switch"
        aria-checked={isChecked}
        aria-label={label ?? "Toggle switch"}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-out ${switchColors.knob}`}
        />
      </button>
      {label && (
        <span
          className={`select-none text-sm font-medium transition-all duration-200 ${
            disabled ? "text-slate-400" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export default Switch
