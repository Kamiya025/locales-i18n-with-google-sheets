import { useDeleteSheet } from "@/hooks/useDeleteSheet"
import { getProgressStatus } from "@/lib/variants"
import { SpreadsheetItem } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react"
import { useMemo, useState } from "react"
import { RowNewItemViewer } from "../form/add-row"
import Button from "../ui/button"
import DeleteSheetModal from "../ui/delete-sheet-modal/DeleteSheetModal"
import { customToast } from "../ui/toast"
import { RowItemViewer } from "./row"
import { useTranslation } from "@/providers/I18nProvider"

// Helper function to calculate missing translations
const calculateMissingTranslations = (
  sheet: SpreadsheetItem,
  uniqueLangs: string[],
) => {
  if (!sheet.rows || sheet.rows.length === 0) return 0
  return sheet.rows.filter((row) =>
    uniqueLangs.some((lang) => !(row.data[lang] ?? "").trim()),
  ).length
}

// Helper function to get unique languages from sheet
const getUniqueLangs = (sheet: SpreadsheetItem) => {
  const langs = sheet.rows.flatMap((r) => Object.keys(r.data)) ?? []
  return Array.from(new Set(langs))
}

const INITIAL_ROWS = 50
const BATCH_SIZE = 100

export function SpreadsheetItemViewer(
  props: Readonly<{ sheet: SpreadsheetItem }>,
) {
  const { sheet } = props
  const { data, setResponse, selectedLocales } = useSpreadsheet()
  const { t } = useTranslation()
  const [newTranslate, setNewTranslate] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [visibleRowsCount, setVisibleRowsCount] = useState(INITIAL_ROWS)

  const mutationDeleteSheet = useDeleteSheet(
    (updatedData) => {
      setResponse(updatedData)
      setIsDeleteModalOpen(false)
      customToast.success(t("detail.sheet.deleteSuccess").replace("{title}", sheet.title))
    },
    (error) => {
      customToast.error(error)
    },
  )

  const handleDeleteConfirm = () => {
    if (!data) return
    mutationDeleteSheet.mutate({
      spreadsheetId: data.id,
      sheetId: sheet.sheetId,
    })
  }

  // Calculate progress stats - Memoized to prevent re-calc on every render
  const { missingCount, progress, status } = useMemo(() => {
    if (selectedLocales.length === 0)
      return { missingCount: 0, progress: 100, status: "completed" as const }
    const missing = calculateMissingTranslations(sheet, selectedLocales)
    const completed = sheet.rows.length - missing
    const progressPercent =
      sheet.rows.length > 0
        ? Math.round((completed / sheet.rows.length) * 100)
        : 100
    const status = getProgressStatus(missing, sheet.rows.length)
    return { missingCount: missing, progress: progressPercent, status }
  }, [sheet.rows, selectedLocales]) // Only re-calc if rows change, not on sheet object change

  // Reset visible rows when sheet changes or closes
  const handleLoadMore = () => {
    setVisibleRowsCount((prev) => prev + BATCH_SIZE)
  }

  return (
    <>
      <Disclosure as="div" key={sheet.sheetId}>
        {({ open }) => (
          <div
            className={`overflow-hidden transition-all duration-300 border border-slate-200/60 bg-white/80 backdrop-blur-sm rounded-3xl ${open ? "shadow-xl shadow-slate-200/60 ring-1 ring-blue-500/10" : "hover:shadow-lg hover:shadow-slate-200/40"}`}
          >
            <DisclosureButton className="w-full text-left">
              <div className="px-4 py-4 sm:px-8 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${open ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight uppercase line-clamp-1">
                        {sheet.title}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {sheet.rows.length} {t("detail.sheet.keywords")}
                        </span>
                        <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-slate-200" />
                        <span
                          className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${missingCount === 0 ? "text-emerald-500" : "text-amber-500"}`}
                        >
                          {missingCount === 0
                            ? t("detail.sheet.completed")
                            : `${missingCount} ${t("detail.sheet.needTranslate")}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
                    <div className="flex flex-col items-start sm:items-end gap-1 sm:gap-1.5 min-w-[80px] sm:min-w-[120px] flex-1 sm:flex-none">
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {t("detail.sheet.progress")}
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-blue-600">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${open ? "bg-slate-900 text-white rotate-180" : "bg-slate-50 text-slate-400"}`}
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
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
              afterLeave={() => setVisibleRowsCount(INITIAL_ROWS)}
            >
              <DisclosurePanel className="w-full px-4 pb-4 sm:px-6 sm:pb-6 text-sm text-slate-600">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-3 sm:my-4 gap-3 px-1">
                  <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t("detail.sheet.showing")} {Math.min(visibleRowsCount, sheet.rows.length)} /{" "}
                    {sheet.rows.length} {t("detail.sheet.keywords")}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsDeleteModalOpen(true)}
                      variant="outline"
                      className="border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 !px-4 !py-2 rounded-xl text-[10px]"
                      icon={
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      }
                    >
                      {t("detail.sheet.deleteCategory")}
                    </Button>
                    {!newTranslate && (
                      <Button
                        onClick={() => setNewTranslate(true)}
                        variant="outline"
                        className="!px-4 !py-2 rounded-xl text-[10px]"
                        icon={
                          <svg
                            className="w-3 h-3"
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
                        {t("detail.sheet.addKeyword")}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

                  {/* Empty State */}
                  {sheet.rows.length === 0 && !newTranslate && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                        <svg
                          className="w-8 h-8 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">
                        {t("detail.sheet.emptyTitle")}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                        {t("detail.sheet.emptyDesc")}
                      </p>
                    </div>
                  )}

                  {/* Render Rows with Limit */}
                  {sheet.rows.slice(0, visibleRowsCount).map((row) => (
                    <div
                      key={row.key}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <RowItemViewer row={row} sheetId={sheet.sheetId} />
                    </div>
                  ))}

                  {/* Load More Button */}
                  {visibleRowsCount < sheet.rows.length && (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
                      <div className="w-px h-12 bg-gradient-to-b from-slate-200 to-transparent" />
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                      >
                        {t("detail.sheet.loadMore")}{" "}
                        {Math.min(
                          BATCH_SIZE,
                          sheet.rows.length - visibleRowsCount,
                        )}{" "}
                        {t("detail.sheet.keywords")}
                      </button>
                    </div>
                  )}
                </div>
              </DisclosurePanel>
            </Transition>
          </div>
        )}
      </Disclosure>

      <DeleteSheetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={mutationDeleteSheet.isPending}
        sheetTitle={sheet.title}
      />
    </>
  )
}
