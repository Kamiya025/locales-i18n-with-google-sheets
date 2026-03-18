"use client"

import { useGlobalSpreadsheetFilter } from "@/hooks/useGlobalSpreadsheetFilter"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import Link from "next/link"

import { transformToI18n } from "@/util/transform"

import { useCallback, useMemo, useState } from "react"
import AddSheetModal from "../ui/add-sheet-modal"
import Button from "../ui/button"
import ExportConfirmationModal from "../ui/export-confirmation-modal"
import LanguageFilter from "../ui/language-filter"
import SearchCombobox from "../ui/search-combobox"
import { SpreadsheetItemViewer } from "./sheet"

export default function SpreadsheetViewer() {
  const { data, listLocales, selectedLocales } = useSpreadsheet()
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

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
    const options = [{ value: "all", label: "Tất cả danh mục" }]
    if (data?.sheets) {
      data.sheets.forEach((sheet) =>
        options.push({ value: sheet.sheetId.toString(), label: sheet.title }),
      )
    }
    return options
  }, [data])

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
      {/* 1. Immersive Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 flex flex-col md:flex-row gap-2 items-center justify-between z-30">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Link
              href="/profile"
              className="hover:text-blue-600 transition-colors"
            >
              Dự án
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-slate-600">Chi tiết bảng tính</span>
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <h1>{data.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddSheetModalOpen(true)}
            variant="outline"
            size="sm"
            className="!px-4 !py-2.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase shadow-sm"
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
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Thêm Danh Mục
          </Button>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant="primary"
            size="sm"
            className="!px-6 !py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase shadow-lg shadow-slate-200"
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
                  strokeWidth={2.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            }
          >
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col border-r border-white/20 bg-white/20 backdrop-blur-md p-6 space-y-8 overflow-y-auto">
          {/* Section: Status */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Tiến độ tổng quan
            </label>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-slate-900">
                  {stats.percent}%
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  LIVE
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                <span>{stats.completed} Hoàn thành</span>
                <span>{stats.total} Tổng số</span>
              </div>
            </div>
          </div>

          {/* Section: Quick Access */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Danh mục nhanh
            </label>
            <div className="flex flex-col gap-1">
              {namespaceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedNamespace(opt.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${selectedNamespace === opt.value ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-600 hover:bg-white/50"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${selectedNamespace === opt.value ? "bg-white" : "bg-slate-300"}`}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Actions */}
          <div className="pt-4 mt-auto">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                Mẹo hay
              </p>
              <p className="text-[10px] font-medium leading-relaxed opacity-80">
                Sử dụng phím ⌘/Ctrl + F để tìm kiếm nhanh từ khóa.
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Editor Panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Floating Filter Bar */}
          <div className="sticky top-0 z-20 px-6 py-3 bg-white/60 backdrop-blur-xl border-b border-slate-200/40 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full overflow-visible">
              <SearchCombobox
                value={search}
                onChange={setSearch}
                placeholder="Tìm kiếm từ khóa (Key) hoặc nội dung dịch..."
                suggestions={searchSuggestions}
                isLoading={isSearching}
                className="!rounded-2xl !bg-white/80 !border-slate-200/60 focus:!ring-blue-100 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-1 rounded-xl bg-slate-100/50 flex items-center gap-1 shadow-inner border border-slate-200/20">
                <button
                  onClick={() => setShowOnlyMissing(false)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!showOnlyMissing ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setShowOnlyMissing(true)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${showOnlyMissing ? "bg-white text-amber-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Chưa dịch
                </button>
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
              <LanguageFilter />
            </div>
          </div>

          {/* Keys Container */}
          <div
            className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar transition-opacity duration-300 ${isSearching ? "opacity-50" : "opacity-100"}`}
          >
            {/* Stats Bar (Mobile/Tablets) */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Dự án
                </div>
                <div className="text-xl font-black text-slate-800">
                  {stats.percent}%
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Hoàn thành
                </div>
                <div className="text-xl font-black text-blue-600">
                  {stats.completed}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Cần dịch
                </div>
                <div className="text-xl font-black text-amber-600">
                  {stats.missing}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Tổng cộng
                </div>
                <div className="text-xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>

            {/* Sheet Lists */}
            {filtered?.sheets?.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-32 text-center space-y-6"
                style={{
                  animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}
              >
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-slate-500 font-medium">
                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 pb-20">
                {filtered?.sheets?.map((sheet, index) =>
                  sheet ? (
                    <div
                      key={sheet.sheetId}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <SpreadsheetItemViewer sheet={sheet} />
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>
        </main>
      </div>

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
