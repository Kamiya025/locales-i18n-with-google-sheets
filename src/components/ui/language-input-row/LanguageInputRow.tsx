"use client"

import Badge from "../badge"

interface LanguageInputRowProps {
  language: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  variant?: "default" | "glass"
}

export default function LanguageInputRow({
  language,
  value,
  onChange,
  placeholder = "Nhập bản dịch...",
  disabled = false,
  error = false,
  variant = "glass",
}: Readonly<LanguageInputRowProps>) {
  const containerClasses =
    "flex rounded-2xl glass-effect border border-white/40 text-sm overflow-hidden backdrop-blur-sm"

  const inputClasses = `flex-1 w-full h-full border-0 outline-none px-4 py-4 text-slate-700 placeholder-slate-400 transition-all duration-200 ${
    !value ? "bg-amber-50/50 text-slate-500" : "bg-white/50"
  } focus:bg-white/80 focus:ring-2 focus:ring-indigo-400/30`

  const badgeClasses =
    "w-20 px-3 py-4 flex justify-center items-center text-center gradient-primary text-white font-bold"

  return (
    <div className={containerClasses}>
      {variant === "glass" ? (
        <div className={badgeClasses}>{language}</div>
      ) : (
        <div className={badgeClasses}>{language}</div>
      )}
      <div className="flex-1">
        <input
          placeholder={`${placeholder} (${language})`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputClasses}
        />
      </div>
    </div>
  )
}
