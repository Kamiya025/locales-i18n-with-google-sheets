"use client"

import { useState, useMemo } from "react"
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"

interface SearchComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  isLoading?: boolean
  className?: string
}

export default function SearchCombobox({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  suggestions = [],
  isLoading = false,
  className = "",
}: SearchComboboxProps) {
  const [query, setQuery] = useState("")

  const filteredSuggestions = useMemo(() => {
    if (!query) return suggestions.slice(0, 10) // Chỉ hiển thị 10 suggestions đầu tiên

    return suggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10)
  }, [query, suggestions])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setQuery(newValue)
    onChange(newValue)
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Combobox value={value} onChange={onChange}>
        <div className="relative bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 border border-blue-200/40 rounded-xl backdrop-blur-lg shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/15 focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:border-blue-300/60 transition-all duration-500 ease-out">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <ComboboxInput
            className="w-full bg-transparent pl-12 pr-4 py-3.5 outline-none text-slate-700 placeholder-slate-400 transition-all duration-500 ease-out focus:ring-0 relative z-0"
            placeholder={placeholder}
            onChange={handleInputChange}
            displayValue={(value: string) => value}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95 translate-y-1"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-1"
          afterLeave={() => setQuery("")}
        >
          <ComboboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-500/20 focus:outline-none">
            {filteredSuggestions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-3 text-slate-500 text-center">
                <svg
                  className="w-8 h-8 text-slate-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.463-.64-6.32-1.76C3.86 12.36 3 10.8 3 9c0-5.523 4.477-10 10-10s10 4.477 10 10c0 1.8-.86 3.36-2.68 4.24A7.962 7.962 0 0112 15z"
                  />
                </svg>
                <p className="text-sm">Không tìm thấy kết quả nào</p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion, index) => (
                <ComboboxOption
                  key={`${suggestion}-${index}`}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-4 py-3 transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-700 shadow-sm"
                        : "text-slate-700 hover:bg-slate-50/50"
                    }`
                  }
                  value={suggestion}
                >
                  {({ selected, active }) => (
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 ${
                          active ? "text-blue-500" : "text-slate-400"
                        } transition-colors`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {suggestion}
                      </span>
                      {selected && (
                        <svg
                          className="w-4 h-4 text-blue-600 ml-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  )
}
