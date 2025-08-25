import { SpreadsheetItem } from "@/models"
import { RowItemViewer } from "./row"
import { useState, useMemo } from "react"
import { RowNewItemViewer } from "../form/add-row"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"
import Button from "../ui/button"
import {
  progressBarVariants,
  statusDotVariants,
  statusBadgeVariants,
  getProgressStatus,
  type ProgressStatus,
} from "@/lib/variants"

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
  const { setResponse, selectedLocales } = useSpreadsheet()
  const [newTranslate, setNewTranslate] = useState(false)

  // Calculate progress stats based on selected languages only
  const { missingCount, progress, status } = useMemo((): {
    missingCount: number
    progress: number
    status: ProgressStatus
  } => {
    // Chỉ tính progress cho những ngôn ngữ đã chọn
    if (selectedLocales.length === 0) {
      return { missingCount: 0, progress: 100, status: "completed" }
    }

    const missing = calculateMissingTranslations(sheet, selectedLocales)
    const completed = sheet.rows.length - missing
    const progressPercent =
      sheet.rows.length > 0
        ? Math.round((completed / sheet.rows.length) * 100)
        : 0

    const status = getProgressStatus(missing, sheet.rows.length)

    return {
      missingCount: missing,
      progress: progressPercent,
      status,
    }
  }, [sheet, selectedLocales])

  // Luxury design - premium gradients with glassmorphism
  const getCardStyle = () => {
    return "bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 border-blue-200/40 backdrop-blur-lg shadow-lg shadow-blue-500/10"
  }

  return (
    <Disclosure as="div" key={sheet.sheetId}>
      {({ open }) => (
        <div
          className={`relative transition-all duration-500 ease-out hover:shadow-xl hover:shadow-blue-500/15 hover:border-blue-300/60 hover:scale-[1.01] hover:-translate-y-0.5 group ${getCardStyle()} ${
            open ? "rounded-xl shadow-xl shadow-blue-500/15" : "rounded-xl"
          }`}
        >
          {/* Subtle corner element */}
          <div className="absolute top-3 right-3 w-4 h-4 opacity-10">
            <div className="w-full h-full rounded-full bg-slate-400"></div>
            <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-slate-300"></div>
          </div>

          <DisclosureButton className="w-full flex flex-col overflow-hidden">
            <div
              className={`flex-1 flex px-6 justify-between items-center relative z-10
                        font-bold text-lg cursor-pointer select-none
                        transition-all duration-300 focus:ring-2 focus:ring-slate-400/50 ${
                          open
                            ? "py-4 text-slate-900"
                            : "py-3 text-slate-800 hover:text-slate-900"
                        }`}
            >
              <div className="flex items-center gap-3">
                <span className="tracking-wide">{sheet.title}</span>
                {/* Clean Status Indicator */}
                <div className="flex items-center gap-2">
                  {sheet.rows.length === 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div
                        className={statusDotVariants({ status: "empty" })}
                      ></div>
                      <span
                        className={statusBadgeVariants({ status: "empty" })}
                      >
                        Trống
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className={statusDotVariants({ status })}></div>
                        <span className={statusBadgeVariants({ status })}>
                          {missingCount === 0
                            ? "Hoàn thành"
                            : `${missingCount} cần dịch`}
                        </span>
                      </div>
                      {/* Progress text */}
                      <div className="text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
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
            </div>
            {/* Minimal Progress Bar */}
            {sheet.rows.length > 0 && (
              <div className="w-full h-0.5 bg-slate-200 overflow-hidden rounded-t-lg">
                <div
                  className={progressBarVariants({ status })}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </DisclosureButton>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <DisclosurePanel className="w-full px-6 pb-6 text-sm text-slate-600">
              {/* Empty State - No translations yet */}
              {sheet.rows.length === 0 && !newTranslate ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center mb-6 soft-shadow transition-colors duration-300 group-hover:bg-slate-200">
                    <div className="w-6 h-6 bg-slate-400 rounded-md opacity-50"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Chưa có từ khóa nào
                  </h3>
                  <p className="text-slate-600 text-center mb-6 max-w-xs">
                    Trang này chưa có từ khóa nào. Hãy thêm từ khóa đầu tiên để
                    bắt đầu theo dõi tiến độ dịch!
                  </p>
                  <Button
                    onClick={() => setNewTranslate(true)}
                    variant="primary"
                    icon={
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    }
                  >
                    Thêm từ khóa đầu tiên
                  </Button>
                </div>
              ) : (
                <>
                  {!newTranslate && (
                    <div className="flex justify-end my-4">
                      <Button
                        onClick={() => setNewTranslate(true)}
                        variant="outline"
                        icon={
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        }
                      >
                        Thêm từ khóa
                      </Button>
                    </div>
                  )}
                </>
              )}
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* Normal State - Has translations */}
                {/* Add New Translation Form */}
                {newTranslate && (
                  <RowNewItemViewer
                    sheetId={sheet.sheetId}
                    lastIndexRow={sheet.rows.length}
                    onSaveSuccess={(data) => {
                      setResponse(data)
                      setNewTranslate(false)
                    }}
                  />
                )}
                {sheet.rows.length > 0 && (
                  <>
                    {sheet.rows.map((row, i) => (
                      <RowItemViewer
                        key={row.key}
                        row={row}
                        sheetId={sheet.sheetId}
                      />
                    ))}
                  </>
                )}
              </div>
            </DisclosurePanel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
