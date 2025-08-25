import { SpreadsheetItem } from "@/models"
import { RowItemViewer } from "./row"
import { useState, useMemo } from "react"
import { RowNewItemViewer } from "../form/add-row"
import { useSpreadsheet } from "@/providers/preadsheetProvider"

// Helper function to calculate missing translations
const calculateMissingTranslations = (
  sheet: SpreadsheetItem,
  uniqueLangs: string[]
) => {
  return sheet.rows.filter((row) =>
    uniqueLangs.some((lang) => !(row.data[lang] ?? "").trim())
  ).length
}

// Helper function to get unique languages from sheet
const getUniqueLangs = (sheet: SpreadsheetItem) => {
  const langs = sheet.rows.flatMap((r) => Object.keys(r.data)) ?? []
  return Array.from(new Set(langs))
}

export function SpreadsheetItemViewer(
  props: Readonly<{ sheet: SpreadsheetItem }>
) {
  const { sheet } = props
  const { setResponse } = useSpreadsheet()
  const [open, setOpen] = useState(false)
  const [newTranslate, setNewTranslate] = useState(false)

  // Calculate progress stats
  const { missingCount, progress } = useMemo(() => {
    const langs = getUniqueLangs(sheet)
    const missing = calculateMissingTranslations(sheet, langs)
    const completed = sheet.rows.length - missing
    const progressPercent =
      sheet.rows.length > 0
        ? Math.round((completed / sheet.rows.length) * 100)
        : 0

    return {
      missingCount: missing,
      progress: progressPercent,
    }
  }, [sheet])

  // Simplified styling - neutral base with subtle accent
  const getCardStyle = () => {
    return "bg-gradient-to-br from-white to-slate-50 border-slate-200/50"
  }

  return (
    <div
      key={sheet.sheetId}
      className={`relative backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300 group ${getCardStyle()} ${
        open ? "rounded-lg soft-shadow-lg" : "rounded-lg soft-shadow"
      }`}
    >
      {/* Subtle corner element */}
      <div className="absolute top-3 right-3 w-4 h-4 opacity-10">
        <div className="w-full h-full rounded-full bg-slate-400"></div>
        <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-slate-300"></div>
      </div>

      {/* Minimal Progress Bar */}
      {sheet.rows.length > 0 && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-slate-200 overflow-hidden rounded-t-lg">
          <div
            className="h-full bg-gradient-to-r from-slate-600 to-slate-700 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(!open)
          }
        }}
        className={`w-full px-6 flex justify-between items-center relative z-10
                    font-bold text-lg cursor-pointer select-none 
                    transition-all duration-300
                    ${
                      open
                        ? "py-4 text-slate-800"
                        : "py-3 text-slate-700 hover:text-slate-900"
                    }`}
      >
        <div className="flex items-center gap-3">
          <span className="tracking-wide">{sheet.title}</span>
          {/* Clean Status Indicator */}
          <div className="flex items-center gap-2">
            {sheet.rows.length === 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Trống
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      missingCount === 0 ? "bg-slate-600" : "bg-slate-400"
                    }`}
                  ></div>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {missingCount === 0
                      ? "Hoàn thành"
                      : `${missingCount} cần dịch`}
                  </span>
                </div>
                {/* Progress text */}
                <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                  {progress}%
                </div>
              </div>
            )}
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-6 h-6 ${
            open ? "rotate-180" : ""
          } transition-transform duration-300`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <div className="w-full px-6 pb-6 text-sm text-slate-600">
          {/* Empty State - No translations yet */}
          {sheet.rows.length === 0 && !newTranslate && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center mb-6 soft-shadow transition-colors duration-300 group-hover:bg-slate-200">
                <div className="w-6 h-6 bg-slate-400 rounded-md opacity-50"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Chưa có từ khóa nào
              </h3>
              <p className="text-slate-500 text-center mb-6 max-w-xs">
                Trang này chưa có từ khóa nào. Hãy thêm từ khóa đầu tiên để bắt
                đầu theo dõi tiến độ dịch!
              </p>
              <button
                onClick={() => setNewTranslate(true)}
                className="px-6 py-3 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 transition-colors duration-300 soft-shadow"
              >
                Thêm từ khóa đầu tiên
              </button>
            </div>
          )}

          {/* Normal State - Has translations */}
          {sheet.rows.length > 0 && (
            <>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {sheet.rows.map((row, i) => (
                  <RowItemViewer
                    key={row.key}
                    row={row}
                    sheetId={sheet.sheetId}
                  />
                ))}
              </div>
              {!newTranslate && (
                <div className="flex justify-end my-4">
                  <button
                    onClick={() => setNewTranslate(true)}
                    className="px-6 py-3 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 transition-colors duration-300 soft-shadow"
                  >
                    Thêm từ khóa
                  </button>
                </div>
              )}
            </>
          )}

          {/* Add New Translation Form */}
          {newTranslate && (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <RowNewItemViewer
                sheetId={sheet.sheetId}
                lastIndexRow={sheet.rows.length}
                onSaveSuccess={(data) => {
                  setResponse(data)
                  setNewTranslate(false)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
