"use client"
import React, { useState } from "react"
import { Switch as HeadlessSwitch } from "@headlessui/react"

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

  const handleChange = (checked: boolean) => {
    setIsChecked(checked)
    if (onChange) {
      onChange(checked)
    }
  }

  const getSwitchStyles = (enabled: boolean) => {
    if (disabled) {
      return "bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
    }

    if (color === "blue") {
      return enabled
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200"
        : "bg-slate-200 dark:bg-slate-700"
    } else {
      return enabled
        ? "bg-gradient-to-r from-slate-600 to-slate-800 shadow-lg shadow-slate-200"
        : "bg-slate-200 dark:bg-slate-700"
    }
  }

  const getKnobStyles = (enabled: boolean) => {
    return enabled
      ? "translate-x-full bg-white shadow-lg"
      : "translate-x-0 bg-white shadow-md"
  }

  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
      <HeadlessSwitch
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={`relative inline-flex h-7 w-[53px] px-0.5 items-center rounded-full border border-white/20 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 ${
          !disabled ? "hover:shadow-lg" : ""
        } ${getSwitchStyles(isChecked)}`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-out ${getKnobStyles(
            isChecked
          )}`}
        />
      </HeadlessSwitch>
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
