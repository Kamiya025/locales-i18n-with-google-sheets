"use client"

import { useRef, useEffect } from "react"

interface LanguageInputRowProps {
  language: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  variant?: "default" | "glass" | "simple"
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
  variant = "simple",
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
  
  // Design refined for simple variant
  const getDynamicClasses = () => {
    if (variant === "simple") {
      return {
        container: `group flex flex-col sm:flex-row rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
          isEmpty 
            ? "bg-slate-50/50 border-slate-200" 
            : "bg-white border-slate-200 shadow-sm"
        } focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50`,
        badge: `w-full sm:w-20 px-3 py-2 sm:py-4 flex justify-center items-center text-center bg-slate-900 text-white font-black uppercase text-[9px] sm:text-[10px] tracking-widest relative overflow-hidden`,
        input: `flex-1 w-full border-0 outline-none px-4 sm:px-5 py-3 sm:py-4 pr-14 sm:pr-20 text-slate-800 placeholder-slate-400 bg-transparent resize-none overflow-hidden transition-colors min-h-[48px] sm:min-h-[56px] text-xs sm:text-sm leading-relaxed`
      }
    }
    
    // Default/Glass fallback
    return {
      container: `group flex flex-col sm:flex-row rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${
        isEmpty 
          ? "bg-amber-50/20 border-amber-200/40" 
          : "bg-white/40 border-slate-200/40"
      } focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50`,
      badge: `w-full sm:w-20 px-3 py-2 sm:py-4 flex justify-center items-center text-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black uppercase text-[10px] sm:text-xs tracking-tighter shadow-inner relative overflow-hidden`,
      input: `flex-1 w-full border-0 outline-none px-4 py-3 sm:py-4 pr-14 sm:pr-20 text-slate-800 placeholder-slate-400 bg-transparent resize-none overflow-hidden transition-colors min-h-[48px] sm:min-h-[56px] text-xs sm:text-sm`
    }
  }

  const classes = getDynamicClasses()

  return (
    <div className={classes.container}>
      {/* Language Badge */}
      <div className={classes.badge}>
        <span className="relative z-10">{language}</span>
        {variant !== "simple" && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>}
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
          className={classes.input}
        />
        
        {/* Helper Action Toolbar */}
        <div className="absolute top-2 right-2 flex gap-1 sm:gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {suggestion && value !== suggestion && (
            <button
              type="button"
              onClick={() => onChange(suggestion)}
              className="p-1 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              title="Sử dụng gợi ý"
            >
              Gợi ý
            </button>
          )}
          {referenceValue && value !== referenceValue && (
            <button
              type="button"
              onClick={() => onChange(referenceValue)}
              className="p-1 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-bold bg-white text-blue-600 rounded-md border border-blue-100 shadow-sm hover:scale-105 active:scale-95 transition-all"
              title="Copy từ ngôn ngữ gốc"
            >
              Sync
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 text-slate-400 hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-md shadow-sm transition-colors"
              title="Xoá nhanh"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Character Count */}
        {value.length > 0 && (
          <div className="absolute bottom-1 right-2 text-[8px] sm:text-[9px] font-mono text-slate-400">
            {value.length} chars
          </div>
        )}
      </div>
    </div>
  )
}
