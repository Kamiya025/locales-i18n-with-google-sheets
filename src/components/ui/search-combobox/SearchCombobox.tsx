"use client"

import { useState, useMemo } from "react"
import { Combobox, Transition } from "@headlessui/react"
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
        <div className="relative">
          <Combobox.Input
            className="w-full bg-transparent px-4 py-3 outline-none text-slate-700 placeholder-slate-400 transition-all duration-300 focus:ring-0"
            placeholder={placeholder}
            onChange={handleInputChange}
            displayValue={(value: string) => value}
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
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

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-600"></div>
            </div>
          )}

          {/* Suggestions Dropdown */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg glass-effect border border-white/30 backdrop-blur-md shadow-lg focus:outline-none">
              {filteredSuggestions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-slate-500">
                  Không tìm thấy kết quả nào.
                </div>
              ) : (
                filteredSuggestions.map((suggestion, index) => (
                  <Combobox.Option
                    key={`${suggestion}-${index}`}
                    className={({ active }) =>
                      `relative cursor-pointer select-none px-4 py-2 transition-colors ${
                        active
                          ? "bg-indigo-50/80 text-indigo-700"
                          : "text-slate-700"
                      }`
                    }
                    value={suggestion}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {suggestion}
                        </span>
                        {selected && (
                          <svg
                            className="w-4 h-4 text-indigo-600 ml-auto"
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
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
