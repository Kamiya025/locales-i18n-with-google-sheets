"use client"

import { useGlobalSpreadsheetFilter } from "@/hooks/useGlobalSpreadsheetFilter"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import Switch from "../ui/switch/Switch"
import LanguageFilter from "../ui/language-filter"
import Card from "../ui/card"
import Button from "../ui/button"
import StatsCard from "../ui/stats-card"
import { SpreadsheetItemViewer } from "./sheet"
import { downloadJSON } from "./hook"
import { transformToI18n } from "@/util/transform"
import { useCallback, useMemo } from "react"
export default function SpreadsheetViewer() {
  const { data, listLocales, selectedLocales } = useSpreadsheet()
  const {
    filtered,
    search,
    setSearch,
    setShowOnlyMissing,
    showOnlyMissing,
    selectedNamespace,
    setSelectedNamespace,
    isSearching,
  } = useGlobalSpreadsheetFilter(data)
  // Tính toán stats dựa trên namespace được chọn
  const statsData = useMemo(() => {
    if (!data || !data.sheets) return null

    if (selectedNamespace === "all") return data

    return {
      ...data,
      sheets:
        data?.sheets?.filter(
          (sheet) => sheet && sheet.sheetId.toString() === selectedNamespace
        ) || [],
    }
  }, [data, selectedNamespace])

  const totalKeys =
    statsData?.sheets?.reduce(
      (sum, sheet) => sum + (sheet?.rows?.length || 0),
      0
    ) ?? 0

  const totalMissing =
    statsData?.sheets?.reduce((sum, sheet) => {
      if (!sheet?.rows) return sum

      return (
        sum +
        sheet.rows.filter(
          (row) =>
            // Chỉ kiểm tra ngôn ngữ được chọn, không phải tất cả ngôn ngữ
            row &&
            selectedLocales.some((lang) => !(row.data?.[lang] ?? "").trim())
        ).length
      )
    }, 0) ?? 0

  // Tính phần trăm tiến độ
  const progressPercent =
    totalKeys > 0
      ? Math.round(((totalKeys - totalMissing) / totalKeys) * 100)
      : 0

  // Tính số keys hoàn thành dựa trên ngôn ngữ được chọn
  const completedKeys = totalKeys - totalMissing
  const handleDownload = useCallback(() => {
    if (!data) return
    const translations = transformToI18n(data)

    // tạo từng file vi.json, en.json...
    Object.entries(translations).forEach(([lang, data]) => {
      const langName = lang.toLowerCase().trim()
      downloadJSON(`${langName}.json`, data)
    })
  }, [data])

  if (!data) return null
  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center p-6 pb-8 space-y-6 overflow-y-auto custom-scrollbar relative">
      <div className="container flex flex-col gap-6">
        <Card
          variant="glass"
          size="lg"
          shadow="md"
          className="border-white/20 z-10"
        >
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              {data.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatsCard
                title={
                  selectedNamespace === "all" ? "Danh mục" : "Danh mục hiện tại"
                }
                value={
                  selectedNamespace === "all" ? data?.sheets?.length ?? 0 : 1
                }
                color="emerald"
              />
              <StatsCard
                title="Hoàn thành"
                value={`${completedKeys}/${totalKeys}`}
                color="blue"
                loading={isSearching}
              />
              <StatsCard
                title="Cần hoàn thiện"
                value={totalMissing}
                color="amber"
              />
              <StatsCard
                title="Ngôn ngữ"
                value={`${selectedLocales.length}/${listLocales.length}`}
                color="purple"
                subtitle={selectedLocales.join(", ") || "Chưa chọn"}
              />
              <StatsCard
                title="Tiến độ"
                value={`${progressPercent}%`}
                color="indigo"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Search Input Group */}
            <Card
              variant="glass"
              className="!p-0 hover:border-slate-300/40 focus-within:ring-2 focus-within:ring-slate-400/50 focus-within:border-slate-400/50"
            >
              {/* Unified Layout - Always Visible */}
              <div className="flex flex-rows md:gap-1">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={
                      selectedNamespace === "all"
                        ? "Tìm kiếm toàn bộ..."
                        : "Tìm kiếm trong danh mục..."
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 outline-none text-slate-700 placeholder-slate-400 transition-all duration-300"
                  />

                  {/* Search Loading Indicator */}
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-xs text-slate-400">...</span>
                    </div>
                  )}
                </div>
                {/* Divider - Hidden on mobile */}
                <div className="hidden md:block w-px h-8 bg-slate-200/50 mx-2"></div>
                {/* Namespace Selector */}
                <div className="relative md:min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <select
                    value={selectedNamespace}
                    onChange={(e) => setSelectedNamespace(e.target.value)}
                    className="w-full bg-transparent pl-12 pr-10 py-3 outline-none text-slate-700 cursor-pointer appearance-none hover:text-indigo-600 transition-all duration-300"
                  >
                    <option value="all">Tất cả</option>
                    {data?.sheets?.map((sheet) => (
                      <option
                        key={sheet.sheetId}
                        value={sheet.sheetId.toString()}
                      >
                        {sheet.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Switch
                  color="blue"
                  defaultChecked={showOnlyMissing}
                  onChange={() => setShowOnlyMissing(!showOnlyMissing)}
                  label="Chỉ hiển thị thiếu bản dịch"
                />
                <LanguageFilter />
              </div>
              {totalKeys > 0 && (
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                >
                  Tải JSON
                </Button>
              )}
            </div>
          </div>
        </Card>
        <div
          className={`space-y-6 transition-opacity duration-200 ${
            isSearching ? "opacity-70" : "opacity-100"
          }`}
        >
          {filtered?.sheets?.map((sheet, index) =>
            sheet ? (
              <div
                key={sheet.sheetId}
                className="animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <SpreadsheetItemViewer sheet={sheet} />
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
