"use client"

import { useFetchSheet } from "@/hooks/useFetchSheet"
import { useHistory } from "@/hooks/useHistory"
import { useBatchAutoFix } from "@/hooks/useBatchAutoFix"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import HistoryPanel from "../ui/history/HistoryPanel"
import FavoriteQuickAccess from "../ui/history/FavoriteQuickAccess"
import AutoFixDialog from "../ui/auto-fix-dialog"
import FormatWarningModal from "../ui/format-warning-modal"

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

export default function GetLinkGoogleSheets({
  isHeader = false,
}: Readonly<GetLinkGoogleSheetsProps>) {
  const storageKey = "sheet-url-history"
  const [url, setUrl] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [formatWarningModal, setFormatWarningModal] = useState<{
    isOpen: boolean
    spreadsheetId: string
    validationIssues: Array<{
      sheetTitle: string
      errors: string[]
      fixes: Array<{
        type:
          | "missing_key"
          | "duplicate_keys"
          | "empty_keys"
          | "no_languages"
          | "no_headers"
        title: string
        description: string
        action: string
      }>
    }>
  }>({
    isOpen: false,
    spreadsheetId: "",
    validationIssues: [],
  })
  const [autoFixDialog, setAutoFixDialog] = useState<{
    isOpen: boolean
    spreadsheetId: string
    validationIssues: Array<{
      sheetTitle: string
      errors: string[]
      fixes: Array<{
        type:
          | "missing_key"
          | "duplicate_keys"
          | "empty_keys"
          | "no_languages"
          | "no_headers"
        title: string
        description: string
        action: string
      }>
    }>
  }>({
    isOpen: false,
    spreadsheetId: "",
    validationIssues: [],
  })
  const { setResponse } = useSpreadsheet()
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

  // Auto-fix hook for applying batch fixes with better performance
  const batchAutoFixMutation = useBatchAutoFix((updatedData) => {
    setResponse(updatedData)
    // Close both modals after successful fix
    setFormatWarningModal((prev) => ({ ...prev, isOpen: false }))
    setAutoFixDialog((prev) => ({ ...prev, isOpen: false }))
  })

  // Debug helper - call debugHistory() in console to troubleshoot
  if (typeof window !== "undefined") {
    ;(window as any).debugHistory = debugHistory
  }

  const fetchSheet = useFetchSheet(
    (data, url) => {
      setResponse(data)
      // Save with title if available, otherwise will use URL extraction
      save(url, data?.title || undefined)
    },
    (validationResult, sheetUrl) => {
      // Extract spreadsheet ID from URL
      const match = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
      const spreadsheetId = match?.[1] || ""

      // Show format warning modal first (for user confirmation)
      setFormatWarningModal({
        isOpen: true,
        spreadsheetId,
        validationIssues: validationResult.validationIssues,
      })
    }
  )

  // Format Warning Modal handlers
  const handleViewAndFix = () => {
    // Transfer data from warning modal to auto-fix dialog
    setAutoFixDialog({
      isOpen: true,
      spreadsheetId: formatWarningModal.spreadsheetId,
      validationIssues: formatWarningModal.validationIssues,
    })

    // Close warning modal
    setFormatWarningModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleAutoFixAll = async () => {
    try {
      // Collect all fixes for batch processing
      const allFixes: Array<{ sheetTitle: string; fixType: string }> = []

      for (const issue of formatWarningModal.validationIssues) {
        for (const fix of issue.fixes) {
          allFixes.push({
            sheetTitle: issue.sheetTitle,
            fixType: fix.type,
          })
        }
      }

      // Apply all fixes in parallel via batch API
      await batchAutoFixMutation.mutateAsync({
        spreadsheetId: formatWarningModal.spreadsheetId,
        fixes: allFixes,
      })

      // Success is handled by the mutation's onSuccess callback
      // which will close the modals and update the data
    } catch (error) {
      // Error handling is done by the mutation (toast notifications)
      console.error("Auto-fix all failed:", error)
    }
  }

  const handleWarningClose = () => {
    setFormatWarningModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleHistorySelect = (selectedUrl: string, title?: string) => {
    setUrl(selectedUrl)
    setIsHistoryOpen(false)
    // Auto fetch
    fetchSheet.mutate(selectedUrl)
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
          fetchSheet.mutate(url)
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
              className={getInputClassNames(isHeader)}
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

            {/* Improved datalist with titles */}
            <datalist id={`${storageKey}-list`}>
              {items.map((item) => (
                <option key={item.id} value={item.url}>
                  {item.title}
                </option>
              ))}
            </datalist>
          </div>

          <button
            type="submit"
            disabled={fetchSheet.isPending}
            className={getButtonClassNames(isHeader)}
          >
            {fetchSheet.isPending ? (
              <span className="flex items-center gap-2">
                <div
                  className={`${spinnerSize} border-2 border-white/30 border-t-white rounded-full animate-spin`}
                ></div>
                <span className={`${isHeader ? "hidden" : "md:block hidden"}`}>
                  Đang tải...
                </span>
              </span>
            ) : (
              <>
                <span className={`${isHeader ? "block" : "md:block hidden"}`}>
                  {buttonText}
                </span>
                <span className={`${isHeader ? "hidden" : "md:hidden block"}`}>
                  Get
                </span>
              </>
            )}
          </button>
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

      {fetchSheet.isError && (
        <div className="glass-effect border border-red-200/30 rounded-lg px-4 py-3 text-red-600 text-sm backdrop-blur-sm">
          <span className="font-medium">Lỗi:</span>{" "}
          {(fetchSheet.error as Error).message}
        </div>
      )}

      {/* Format Warning Modal */}
      <FormatWarningModal
        isOpen={formatWarningModal.isOpen}
        onClose={handleWarningClose}
        spreadsheetId={formatWarningModal.spreadsheetId}
        validationIssues={formatWarningModal.validationIssues}
        onViewAndFix={handleViewAndFix}
        onAutoFixAll={handleAutoFixAll}
        isAutoFixing={batchAutoFixMutation.isPending}
      />

      {/* Auto Fix Dialog */}
      <AutoFixDialog
        isOpen={autoFixDialog.isOpen}
        onClose={() => setAutoFixDialog((prev) => ({ ...prev, isOpen: false }))}
        spreadsheetId={autoFixDialog.spreadsheetId}
        validationIssues={autoFixDialog.validationIssues}
      />
    </div>
  )
}
