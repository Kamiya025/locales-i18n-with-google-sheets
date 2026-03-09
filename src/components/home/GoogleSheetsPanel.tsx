"use client"

import { useHistory } from "@/hooks/useHistory"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { customToast } from "@/components/ui/toast"
import HistoryPanel from "../ui/history/HistoryPanel"
import FavoriteQuickAccess from "../ui/history/FavoriteQuickAccess"

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match?.[1] || null
}

export default function GoogleSheetsPanel() {
  const router = useRouter()
  const storageKey = "sheet-url-history"
  const [url, setUrl] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    items,
    favorites,
    recent,
    save,
    toggleFavorite,
    remove,
    clear,
    debugHistory,
  } = useHistory(storageKey, 15)

  if (typeof window !== "undefined") {
    ;(window as any).debugHistory = debugHistory
  }

  const validateAndNavigate = async (submitUrl: string) => {
    const trimmed = submitUrl.trim()
    if (!trimmed) {
      customToast.error("Vui lòng nhập URL Google Sheets")
      return
    }
    if (!trimmed.includes("docs.google.com/spreadsheets")) {
      customToast.error("URL phải là link Google Sheets")
      return
    }
    const id = extractSpreadsheetId(trimmed)
    if (!id) {
      customToast.error("Không thể lấy ID từ URL này")
      return
    }
    setIsSubmitting(true)
    try {
      save(submitUrl)
      await new Promise((r) => setTimeout(r, 200))
      router.push(`/sheet/${id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHistorySelect = (selectedUrl: string) => {
    setUrl(selectedUrl)
    setIsHistoryOpen(false)
    const id = extractSpreadsheetId(selectedUrl)
    if (id) router.push(`/sheet/${id}`)
    else validateAndNavigate(selectedUrl)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* URL Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          validateAndNavigate(url)
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:ring-2 focus:ring-blue-400/40 outline-none transition-all"
          />
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              title="Xem lịch sử"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
            >
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          )}
          Mở
        </button>
      </form>

      {/* Favorites */}
      {!isHistoryOpen && favorites.length > 0 && (
        <FavoriteQuickAccess
          favorites={favorites}
          onSelect={handleHistorySelect}
          maxItems={3}
        />
      )}

      {/* History Panel */}
      <HistoryPanel
        items={items}
        favorites={favorites}
        recent={recent}
        onSelect={handleHistorySelect}
        onToggleFavorite={toggleFavorite}
        onRemove={remove}
        onClear={clear}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  )
}
