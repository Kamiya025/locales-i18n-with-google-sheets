"use client"

import { useMemo, useRef, useEffect } from "react"

interface LanguageInputRowProps {
  language: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  variant?: "default" | "glass"
  referenceValue?: string // Value from the "source" language
  suggestion?: string // Value from Translation Memory
}

export default function LanguageInputRow({
  language,
  value,
  onChange,
  placeholder = "Nhập bản dịch...",
  disabled = false,
  error = false,
  variant = "glass",
  referenceValue,
  suggestion,
}: Readonly<LanguageInputRowProps>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea logic
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  const isEmpty = !value || !value.trim()
  
  const containerClasses = `group flex flex-col sm:flex-row rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${
    isEmpty 
      ? "bg-amber-50/20 border-amber-200/40 dark:bg-amber-900/10 dark:border-amber-900/20" 
      : "bg-white/40 border-slate-200/40 dark:bg-slate-900/40 dark:border-slate-800"
  } focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50 focus-within:bg-white/80 dark:focus-within:bg-slate-900/80`

  const inputClasses = `flex-1 w-full border-0 outline-none px-4 py-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 bg-transparent resize-none overflow-hidden transition-colors min-h-[56px]`

  const badgeClasses = `w-full sm:w-20 px-3 py-3 sm:py-4 flex justify-center items-center text-center bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600 dark:from-indigo-600 dark:via-purple-700 dark:to-violet-700 text-white font-black uppercase text-xs tracking-tighter shadow-inner relative overflow-hidden`

  return (
    <div className={containerClasses}>
      {/* Language Badge */}
      <div className={badgeClasses}>
        <span className="relative z-10">{language}</span>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
      </div>

      {/* Input Area */}
      <div className="flex-1 flex flex-col relative">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={`${placeholder} (${language})`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputClasses}
        />
        
        {/* Helper Action Toolbar (Visible on hover or value match) */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {suggestion && value !== suggestion && (
            <button
              type="button"
              onClick={() => onChange(suggestion)}
              className="p-1 px-2 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              title="Sử dụng gợi ý từ bộ nhớ dịch thuật"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.464 16.364a1 1 0 11-1.414-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707z" />
              </svg>
              Gợi ý
            </button>
          )}
          {referenceValue && value !== referenceValue && (
            <button
              type="button"
              onClick={() => onChange(referenceValue)}
              className="p-1 px-2 text-[10px] font-bold bg-white/90 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-900 shadow-sm hover:scale-105 active:scale-95 transition-all"
              title="Copy từ ngôn ngữ gốc"
            >
              Sync Gốc
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 text-slate-400 hover:text-red-500 bg-white/90 dark:bg-slate-800/90 rounded-md shadow-sm transition-colors"
              title="Xoá nhanh"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Character Count */}
        {value.length > 0 && (
          <div className="absolute bottom-1 right-3 text-[9px] font-mono text-slate-400">
            {value.length} chars
          </div>
        )}
      </div>
    </div>
  )
}
