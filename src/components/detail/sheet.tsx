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

  // Calculate progress stats
  const { missingCount, progress, status } = useMemo(() => {
    if (selectedLocales.length === 0) return { missingCount: 0, progress: 100, status: "completed" as const }
    const missing = calculateMissingTranslations(sheet, selectedLocales)
    const completed = sheet.rows.length - missing
    const progressPercent = sheet.rows.length > 0 ? Math.round((completed / sheet.rows.length) * 100) : 100
    const status = getProgressStatus(missing, sheet.rows.length)
    return { missingCount: missing, progress: progressPercent, status }
  }, [sheet, selectedLocales])

  return (
    <Disclosure as="div" key={sheet.sheetId}>
      {({ open }) => (
        <div className={`overflow-hidden transition-all duration-300 border border-slate-200/60 bg-white/80 backdrop-blur-sm rounded-[32px] ${open ? 'shadow-xl shadow-slate-200/60 ring-1 ring-blue-500/10' : 'hover:shadow-lg hover:shadow-slate-200/40'}`}>
          <DisclosureButton className="w-full text-left">
            <div className="px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${open ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">{sheet.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sheet.rows.length} từ khóa</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${missingCount === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {missingCount === 0 ? 'Hoàn thành' : `${missingCount} cần dịch`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[120px]">
                    <div className="flex items-center justify-between w-full">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ</span>
                       <span className="text-xs font-black text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${open ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>
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
