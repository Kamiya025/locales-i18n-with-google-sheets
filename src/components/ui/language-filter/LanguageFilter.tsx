"use client"

import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import AddLanguageModal from "../add-language-modal"

export default function LanguageFilter() {
  const { listLocales, selectedLocales, setSelectedLocales } = useSpreadsheet()
  const [isOpen, setIsOpen] = useState(false)
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false)

  const handleToggleLanguage = (lang: string) => {
    if (selectedLocales.includes(lang)) {
      setSelectedLocales(selectedLocales.filter((l) => l !== lang))
    } else {
      setSelectedLocales([...selectedLocales, lang])
    }
  }

  const handleSelectAll = () => {
    setSelectedLocales(listLocales)
  }

  const handleDeselectAll = () => {
    setSelectedLocales([])
  }

  if (listLocales.length === 0) return null

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect border border-white/30 rounded-lg backdrop-blur-sm hover:border-slate-300/40 transition-all duration-300 focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400/50 px-4 py-3 flex items-center gap-2 text-slate-700"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
          />
        </svg>
        <span>
          Ngôn ngữ ({selectedLocales.length}/{listLocales.length})
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 glass-effect border border-white/30 rounded-lg backdrop-blur-md shadow-lg z-[9999]">
          <div className="p-4">
            {/* Header với Select/Deselect All */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200/30">
              <span className="text-sm font-medium text-slate-700">
                Chọn ngôn ngữ hiển thị
              </span>
              <div className="flex gap-1">
                <button
                  onClick={handleSelectAll}
                  className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  Tất cả
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Bỏ hết
                </button>
              </div>
            </div>

            {/* Language Checkboxes */}
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {listLocales.map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50/50 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocales.includes(lang)}
                    onChange={() => handleToggleLanguage(lang)}
                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="flex-1 text-sm text-slate-700 group-hover:text-slate-900 font-medium uppercase">
                    {lang}
                  </span>
                  <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {selectedLocales.includes(lang) ? "✓" : ""}
                  </span>
                </label>
              ))}

              {/* Add Language Button */}
              <button
                onClick={() => {
                  setIsAddLanguageModalOpen(true)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-colors group text-slate-600 hover:text-blue-600"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="flex-1 text-sm group-hover:font-medium text-left">
                  Thêm ngôn ngữ mới
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay để đóng dropdown khi click ngoài */}
      {isOpen && (
        <button
          className="fixed inset-0 z-[9998] bg-transparent border-0 p-0"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false)
            }
          }}
          aria-label="Đóng menu lọc ngôn ngữ"
        />
      )}

      {/* Add Language Modal */}
      <AddLanguageModal
        isOpen={isAddLanguageModalOpen}
        onClose={() => setIsAddLanguageModalOpen(false)}
      />
    </div>
  )
}
