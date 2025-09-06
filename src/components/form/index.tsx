"use client"

import { useHistory } from "@/hooks/useHistory"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { customToast } from "@/components/ui/toast"
import HistoryPanel from "../ui/history/HistoryPanel"
import FavoriteQuickAccess from "../ui/history/FavoriteQuickAccess"

interface GetLinkGoogleSheetsProps {
  isHeader?: boolean
}

// Helper functions to reduce complexity
const getInputClassNames = (isHeader: boolean) =>
  `w-full bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 border-blue-200/40 backdrop-blur-lg shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/15 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 text-slate-700 placeholder-slate-400 ${
    isHeader ? "rounded-xl px-4 py-2.5 text-sm" : "rounded-xl px-6 py-3.5"
  } ${
    isHeader ? "pr-10" : "pr-12"
  } outline-none transition-all duration-500 ease-out`

const getButtonClassNames = (isHeader: boolean) =>
  `bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-600/40 border border-blue-300/20 hover:border-blue-200/30 backdrop-blur-lg before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-xl hover:scale-[1.03] hover:-translate-y-0.5 font-semibold tracking-wide relative overflow-hidden ${
    isHeader
      ? "px-4 py-2.5 rounded-xl text-sm min-h-[36px] min-w-[100px]"
      : "px-6 py-3.5 rounded-xl text-base min-h-[44px] min-w-[120px]"
  } disabled:opacity-50 transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2`

// Helper function to extract spreadsheet ID from Google Sheets URL
function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match?.[1] || null
}

export default function GetLinkGoogleSheets({
  isHeader = false,
}: Readonly<GetLinkGoogleSheetsProps>) {
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

  // Debug helper - call debugHistory() in console to troubleshoot
  if (typeof window !== "undefined") {
    ;(window as any).debugHistory = debugHistory
  }

  // Simple URL validation function
  const validateGoogleSheetsUrl = (
    url: string
  ): { isValid: boolean; spreadsheetId: string | null; error?: string } => {
    if (!url.trim()) {
      return {
        isValid: false,
        spreadsheetId: null,
        error: "Vui lòng nhập URL Google Sheets",
      }
    }

    // Check if it's a Google Sheets URL
    if (!url.includes("docs.google.com/spreadsheets")) {
      return {
        isValid: false,
        spreadsheetId: null,
        error: "URL phải là link Google Sheets",
      }
    }

    // Extract spreadsheet ID
    const spreadsheetId = extractSpreadsheetId(url)
    if (!spreadsheetId) {
      return {
        isValid: false,
        spreadsheetId: null,
        error: "Không thể lấy ID từ URL này",
      }
    }

    return { isValid: true, spreadsheetId }
  }

  const handleSubmit = async (submitUrl: string) => {
    const validation = validateGoogleSheetsUrl(submitUrl)

    if (!validation.isValid) {
      customToast.error(validation.error!)
      return
    }

    setIsSubmitting(true)

    try {
      // Save URL to history (without title for now)
      save(submitUrl)

      // Small delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Redirect to detail page without URL params
      router.push(`/sheet/${validation.spreadsheetId}`)
    } catch (error) {
      customToast.error("Có lỗi xảy ra khi chuyển trang")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHistorySelect = (selectedUrl: string, title?: string) => {
    setUrl(selectedUrl)
    setIsHistoryOpen(false)

    // For history items, redirect directly since they're already validated
    const spreadsheetId = extractSpreadsheetId(selectedUrl)
    if (spreadsheetId) {
      router.push(`/sheet/${spreadsheetId}`)
    } else {
      // Fallback to validation if can't extract ID
      handleSubmit(selectedUrl)
    }
  }

  // Computed values to reduce complexity
  const historyButtonSize = isHeader ? "w-4 h-4" : "w-5 h-5"
  const historyButtonClasses = `absolute ${
    isHeader ? "right-2 p-1.5" : "right-3 p-2"
  } top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white/50`
  const spinnerSize = isHeader ? "w-3 h-3" : "w-4 h-4"
  const placeholder = isHeader
    ? "Dán link Google Sheets..."
    : "Dán link Google Sheets vào đây..."

  const mobilePlaceholder = isHeader
    ? "Dán link Google Sheets... (Enter để submit)"
    : "Dán link Google Sheets vào đây... (Enter để submit)"
  const buttonText = isHeader ? "Get" : "Lấy dữ liệu"

  return (
    <div
      className={`w-full ${
        isHeader ? "space-y-0" : "space-y-3"
      } relative z-[70]`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(url)
        }}
        className="w-full"
      >
        <div className={`flex ${isHeader ? "gap-2" : "gap-3"}`}>
          <div className="flex-1 relative">
            <input
              list={`${storageKey}-list`}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className={`${getInputClassNames(isHeader)} md:pr-4`}
              title="Nhấn Enter để submit"
            />

            {/* History Toggle Button */}
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className={historyButtonClasses}
                title="Xem lịch sử"
              >
                <svg
                  className={historyButtonSize}
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

            {/* Mobile enter hint - chỉ hiển thị khi không có history */}
            {items.length === 0 && (
              <div className="md:hidden absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
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
              </div>
            )}

            {/* Improved datalist with titles */}
            <datalist id={`${storageKey}-list`}>
              {items.map((item) => (
                <option key={item.id} value={item.url}>
                  {item.title}
                </option>
              ))}
            </datalist>
          </div>

          {/* Desktop button - ẩn trên mobile */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${getButtonClassNames(
              isHeader
            )} hidden md:flex items-center justify-center`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div
                  className={`${spinnerSize} border-2 border-white/30 border-t-white rounded-full animate-spin`}
                ></div>
                <span className={`${isHeader ? "hidden" : "block"}`}>
                  Đang xử lý...
                </span>
              </span>
            ) : (
              <span>{buttonText}</span>
            )}
          </button>

          {/* Mobile submit indicator - khi loading */}
          {isSubmitting && (
            <div className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-blue-200/40 z-10">
              <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Favorite Quick Access - Hidden in header mode */}
      {!isHeader && !isHistoryOpen && favorites.length > 0 && (
        <FavoriteQuickAccess
          favorites={favorites}
          onSelect={handleHistorySelect}
          maxItems={4}
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
