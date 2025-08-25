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
import { useCallback, useMemo, useState } from "react"
import SearchCombobox from "../ui/search-combobox"
import NamespaceSelector from "../ui/namespace-selector"
import AddSheetModal from "../ui/add-sheet-modal"
export default function SpreadsheetViewer() {
  const { data, listLocales, selectedLocales } = useSpreadsheet()
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false)
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
            // Chỉ kiểm tra ngôn ngữ được chọn
            row &&
            selectedLocales.length > 0 &&
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

  // Tạo suggestions cho search autocomplete
  const searchSuggestions = useMemo(() => {
    if (!data || !data.sheets) return []

    const allKeys = new Set<string>()

    data.sheets.forEach((sheet) => {
      if (
        selectedNamespace === "all" ||
        sheet.sheetId.toString() === selectedNamespace
      ) {
        sheet.rows?.forEach((row) => {
          if (row && row.key) {
            allKeys.add(row.key)
          }
        })
      }
    })

    return Array.from(allKeys).sort()
  }, [data, selectedNamespace])

  // Tạo options cho namespace selector
  const namespaceOptions = useMemo(() => {
    const options = [{ value: "all", label: "Tất cả" }]

    if (data?.sheets) {
      data.sheets.forEach((sheet) => {
        options.push({
          value: sheet.sheetId.toString(),
          label: sheet.title,
        })
      })
    }

    return options
  }, [data])

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
    <div className="w-full h-full min-h-screen flex flex-col items-center p-6 pb-8 space-y-6 overflow-y-auto overflow-x-visible custom-scrollbar relative">
      <div className="container flex flex-col gap-6">
        <Card
          variant="glass"
          size="lg"
          shadow="md"
          className="border-white/20 z-10 overflow-visible glass-blue"
        >
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">{data.title}</h1>

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
            <div className="flex flex-row gap-1 relative overflow-visible">
              {/* Search Input */}

              <SearchCombobox
                value={search}
                onChange={setSearch}
                placeholder={
                  selectedNamespace === "all"
                    ? "Tìm kiếm toàn bộ..."
                    : "Tìm kiếm trong danh mục..."
                }
                suggestions={searchSuggestions}
                isLoading={isSearching}
                className="flex-1 !rounded-r-none"
              />

              <div className="relative min-w-[200px] overflow-visible">
                <NamespaceSelector
                  value={selectedNamespace}
                  onChange={setSelectedNamespace}
                  options={namespaceOptions}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Switch
                  color="blue"
                  defaultChecked={showOnlyMissing}
                  onChange={() => setShowOnlyMissing(!showOnlyMissing)}
                  label="Chỉ chưa hoàn thiện"
                />
                <LanguageFilter />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setIsAddSheetModalOpen(true)}
                  variant="outline"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                >
                  Thêm Danh Mục
                </Button>
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

      {/* Add Sheet Modal */}
      <AddSheetModal
        isOpen={isAddSheetModalOpen}
        onClose={() => setIsAddSheetModalOpen(false)}
      />
    </div>
  )
}
