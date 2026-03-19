"use client"

import { useDeleteSheet } from "@/hooks/useDeleteSheet"
import { getProgressStatus } from "@/lib/variants"
import { SpreadsheetItem } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useGeminiTranslate } from "@/hooks/useGeminiTranslate"
import sheetApi from "@/apis/sheet"
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
import AutoTranslateDialog from "../ui/auto-translate-dialog/AutoTranslateDialog"

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

const INITIAL_ROWS = 50
const BATCH_SIZE = 100

export function SpreadsheetItemViewer(
  props: Readonly<{ sheet: SpreadsheetItem }>,
) {
  const { sheet } = props
  const { data, setResponse, selectedLocales } = useSpreadsheet()
  const { t } = useTranslation()
  const { apiKey, isEnabled } = useGeminiTranslate()
  const [newTranslate, setNewTranslate] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAutoTranslateOpen, setIsAutoTranslateOpen] = useState(false)
  const [visibleRowsCount, setVisibleRowsCount] = useState(INITIAL_ROWS)
  const [isLoadingLazy, setIsLoadingLazy] = useState(false)

  const isLazy = (sheet as any)._isLazyLoaded && (!sheet.rows || sheet.rows.length === 0)

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

  // Calculate progress stats
  const { missingCount, progress } = useMemo(() => {
    if (selectedLocales.length === 0)
      return { missingCount: 0, progress: 100 }
    const missing = calculateMissingTranslations(sheet, selectedLocales)
    const rows = sheet.rows || []
    const completed = rows.length - missing
    const progressPercent = rows.length > 0
      ? Math.round((completed / rows.length) * 100)
      : 100
    return { missingCount: missing, progress: progressPercent }
  }, [sheet.rows, selectedLocales])

  const handleLoadMore = () => {
    setVisibleRowsCount((prev) => prev + BATCH_SIZE)
  }

  // Lazy load sheet data when opened
  const handleToggle = async (open: boolean) => {
    if (open && isLazy && data && !isLoadingLazy) {
      setIsLoadingLazy(true)
      try {
        const updatedSpreadsheet = await sheetApi.getSpecificSheet(data.id, sheet.title)
        setResponse(updatedSpreadsheet)
      } catch (err: any) {
        customToast.error("Could not load sheet data")
      } finally {
        setIsLoadingLazy(false)
      }
    }
  }

  // Show AI button if API key is present AND (there are missing translations OR sheet is not yet loaded)
  const showAiButton = !!apiKey && (isLazy || missingCount > 0)

  return (
    <>
      <Disclosure as="div" key={sheet.sheetId}>
        {({ open }) => {
          if (open && isLazy && !isLoadingLazy) {
            handleToggle(true)
          }

          return (
            <div
              className={`overflow-hidden transition-all duration-300 border border-slate-200/60 bg-white/80 backdrop-blur-sm rounded-3xl ${open ? "shadow-xl shadow-slate-200/60 ring-1 ring-blue-500/10" : "hover:shadow-lg hover:shadow-slate-200/40"}`}
            >
              <DisclosureButton className="w-full text-left">
                <div className="px-4 py-4 sm:px-8 sm:py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: icon + title + stats */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${open ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight uppercase line-clamp-1">
                          {sheet.title}
                        </h3>
                        <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {(sheet.rows || []).length} {t("detail.sheet.keywords")}
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

                    {/* Right: progress + chevron */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-0">
                      {/* Progress bar */}
                      <div className="flex flex-col items-end gap-1 min-w-[80px] sm:min-w-[100px] flex-shrink-0">
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

                      {/* Chevron */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${open ? "bg-slate-900 text-white rotate-180" : "bg-slate-50 text-slate-400"}`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
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
                  {isLoadingLazy ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">
                        Loading...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Toolbar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-3 sm:my-4 gap-3 px-1">
                        <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {t("detail.sheet.showing")} {Math.min(visibleRowsCount, (sheet.rows || []).length)} /{" "}
                          {(sheet.rows || []).length} {t("detail.sheet.keywords")}
                        </div>
                        <div className="flex gap-2">
                          {/* Add keyword */}
                          {!newTranslate && (
                            <Button
                              onClick={() => setNewTranslate(true)}
                              variant="outline"
                              className="!px-4 !py-2 rounded-xl text-[10px]"
                              icon={
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              }
                            >
                              {t("detail.sheet.addKeyword")}
                            </Button>
                          )}

                          {/* AI Translate — right next to Add keyword, only when there are missing keys */}
                          {showAiButton && (
                            <Button
                              onClick={() => setIsAutoTranslateOpen(true)}
                              variant="outline"
                              className="!px-4 !py-2 rounded-xl text-[10px] border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-sm"
                              icon={
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                              }
                            >
                              {t("detail.autoTranslate.headerButton")}
                              <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-black leading-none">
                                {isLazy && missingCount === 0 ? "?" : missingCount}
                              </span>
                            </Button>
                          )}

                          {/* Delete sheet — separated to the right */}
                          <Button
                            onClick={() => setIsDeleteModalOpen(true)}
                            variant="outline"
                            className="border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 !px-4 !py-2 rounded-xl text-[10px] ml-auto"
                            icon={
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            }
                          >
                            {t("detail.sheet.deleteCategory")}
                          </Button>
                        </div>
                      </div>

                      {/* Rows grid */}
                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {newTranslate && (
                          <RowNewItemViewer
                            sheetId={sheet.sheetId}
                            lastIndexRow={(sheet.rows || []).length}
                            onSaveSuccess={(data) => {
                              setResponse(data)
                              setNewTranslate(false)
                            }}
                          />
                        )}

                        {(sheet.rows || []).length === 0 && !newTranslate && (
                          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4" />
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

                        {(sheet.rows || []).slice(0, visibleRowsCount).map((row) => (
                          <div key={row.key} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <RowItemViewer row={row} sheetId={sheet.sheetId} />
                          </div>
                        ))}

                        {visibleRowsCount < (sheet.rows || []).length && (
                          <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
                            <div className="w-px h-12 bg-gradient-to-b from-slate-200 to-transparent" />
                            <button
                              onClick={handleLoadMore}
                              className="px-8 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                            >
                              {t("detail.sheet.loadMore")}{" "}
                              {Math.min(BATCH_SIZE, (sheet.rows || []).length - visibleRowsCount)}{" "}
                              {t("detail.sheet.keywords")}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </DisclosurePanel>
              </Transition>
            </div>
          )
        }}
      </Disclosure>

      <DeleteSheetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={mutationDeleteSheet.isPending}
        sheetTitle={sheet.title}
      />

      {data && (
        <AutoTranslateDialog
          isOpen={isAutoTranslateOpen}
          onClose={() => setIsAutoTranslateOpen(false)}
          spreadsheetId={data.id}
          sheetId={sheet.sheetId}
        />
      )}
    </>
  )
}
