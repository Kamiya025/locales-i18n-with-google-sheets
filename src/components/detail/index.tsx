"use client"

import { useGlobalSpreadsheetFilter } from "@/hooks/useGlobalSpreadsheetFilter"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import Link from "next/link"

import { transformToI18n } from "@/util/transform"

import { exportSpreadsheetToExcel } from "@/util/excel"
import { useCallback, useMemo, useState } from "react"
import AddSheetModal from "../ui/add-sheet-modal"
import AutoTranslateDialog from "../ui/auto-translate-dialog/AutoTranslateDialog"
import Button from "../ui/button"
import ExportConfirmationModal from "../ui/export-confirmation-modal"
import { DetailHeader } from "./Header"
import { DetailSidebar } from "./Sidebar"
import { DetailEditorPanel } from "./EditorPanel"
import { useTranslation } from "@/providers/I18nProvider"

export default function SpreadsheetViewer() {
  const { t } = useTranslation()
  const {
    data,
    listLocales,
    selectedLocales,
    hasChanges,
    syncSheet,
    isSyncing,
  } = useSpreadsheet()
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isAiConfigOpen, setIsAiConfigOpen] = useState(false)

  const {
    filtered,
    search,
    setSearch,
    setShowOnlyMissing,
    showOnlyMissing,
    selectedNamespace,
    setSelectedNamespace,
    isSearching,
  } = useGlobalSpreadsheetFilter(data, selectedLocales)

  // Memoize search suggestions for performance
  const searchSuggestions = useMemo(() => {
    if (!data?.sheets) return []
    const allKeys = new Set<string>()
    data.sheets.forEach((sheet) => {
      if (
        selectedNamespace === "all" ||
        sheet.sheetId.toString() === selectedNamespace
      ) {
        sheet.rows?.forEach((row) => row?.key && allKeys.add(row.key))
      }
    })
    return Array.from(allKeys).sort()
  }, [data, selectedNamespace])

  // Memoize namespace options for selector
  const namespaceOptions = useMemo(() => {
    const options = [{ value: "all", label: t("detail.sidebar.allCategories") }]
    if (data?.sheets) {
      data.sheets.forEach((sheet) =>
        options.push({ value: sheet.sheetId.toString(), label: sheet.title }),
      )
    }
    return options
  }, [data, t])

  // Statistics Calculation
  const stats = useMemo(() => {
    if (!data?.sheets) return { total: 0, completed: 0, missing: 0, percent: 0 }

    let total = 0
    let missing = 0

    data.sheets.forEach((sheet) => {
      sheet.rows?.forEach((row) => {
        listLocales.forEach((lang) => {
          total++
          if (!row.data[lang]) missing++
        })
      })
    })

    const completed = total - missing
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, missing, percent }
  }, [data, listLocales])

  const handleConfirmExport = useCallback(
    (fallbackLanguage: string | undefined, selectedLanguages: string[]) => {
      if (!data) return

      // Handle Excel export special case
      if ((fallbackLanguage as any) === "EXCEL_FORMAT") {
        exportSpreadsheetToExcel(data)
        setIsExportModalOpen(false)
        return
      }

      // Transform data with fallback for requested languages
      const allTranslations = transformToI18n(data, fallbackLanguage)

      // Export each selected language as a JSON file
      selectedLanguages.forEach((lang) => {
        const langData = allTranslations[lang]
        if (!langData) return

        const blob = new Blob([JSON.stringify(langData, null, 2)], {
          type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${lang}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      })

      setIsExportModalOpen(false)
    },
    [data],
  )

  if (!data) return null

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-700">
      <DetailHeader
        data={data}
        onOpenAiConfig={() => setIsAiConfigOpen(true)}
        onOpenAddSheet={() => setIsAddSheetModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <DetailSidebar
          stats={stats}
          namespaceOptions={namespaceOptions}
          selectedNamespace={selectedNamespace}
          setSelectedNamespace={setSelectedNamespace}
        />

        <DetailEditorPanel
          search={search}
          setSearch={setSearch}
          searchSuggestions={searchSuggestions}
          isSearching={isSearching}
          showOnlyMissing={showOnlyMissing}
          setShowOnlyMissing={setShowOnlyMissing}
          filtered={filtered}
        />
      </div>

      {/* 3. Floating Action Button (FAB) for Saving */}
      {hasChanges && (
        <div className="fixed bottom-10 right-10 z-50 group flex flex-col items-end gap-3 pointer-events-none">
          {/* Label tooltip that appears on group hover */}
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto border border-white/10">
            {t("detail.header.saveToGoogle")}
          </div>

          <button
            onClick={syncSheet}
            disabled={isSyncing}
            className={`pointer-events-auto relative w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isSyncing
                ? "bg-blue-500 cursor-not-allowed scale-95"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-110 active:scale-95 shadow-blue-500/40"
            } border-4 border-white animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700`}
          >
            {/* Pulsing indicator dot */}
            {!isSyncing && (
              <div className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse shadow-md" />
            )}

            {isSyncing ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <svg
                className="w-7 h-7 text-white drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}

            {/* Shine effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      <AddSheetModal
        isOpen={isAddSheetModalOpen}
        onClose={() => setIsAddSheetModalOpen(false)}
      />

      {data && (
        <ExportConfirmationModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onConfirm={handleConfirmExport}
          data={data}
        />
      )}

      {data && (
        <AutoTranslateDialog
          isOpen={isAiConfigOpen}
          onClose={() => setIsAiConfigOpen(false)}
          spreadsheetId={data.id}
        />
      )}

      {/* Legacy Animations */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
