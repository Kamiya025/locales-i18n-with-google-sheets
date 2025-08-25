import { SpreadsheetResponse } from "@/models"
import { useMemo, useState } from "react"
import { useDebounce } from "./useDebounce"

// Helper functions to reduce nesting
const getUniqueLangs = (sheets: any[]) => {
  if (!sheets || !Array.isArray(sheets)) return []

  const langs =
    sheets.flatMap(
      (s: any) => s?.rows?.flatMap((r: any) => Object.keys(r?.data || {})) || []
    ) ?? []
  return Array.from(new Set(langs))
}

const matchesSearch = (row: any, keyword: string) => {
  if (!row || !keyword) return true

  return (
    row.key?.toLowerCase().includes(keyword) ||
    Object.values(row.data || {}).some((v: any) =>
      (v ?? "").toLowerCase().includes(keyword)
    )
  )
}

const hasMissingTranslations = (row: any, selectedLangs: string[]) => {
  if (!row || !row.data || !selectedLangs.length) return false

  return selectedLangs.some((lang) => !(row.data[lang] ?? "").trim())
}

export function useGlobalSpreadsheetFilter(
  response: SpreadsheetResponse | null,
  selectedLocales: string[] = []
) {
  const [search, setSearch] = useState("")
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)
  const [selectedNamespace, setSelectedNamespace] = useState("all")

  // Debounce search input with 300ms delay
  const debouncedSearch = useDebounce(search, 300)

  // Check if we're currently waiting for debounce
  const isSearching = search !== debouncedSearch

  const filtered = useMemo(() => {
    if (!response || !response.sheets) return response

    const keyword = (debouncedSearch || "").trim().toLowerCase()

    // nếu không filter gì thì return luôn (chỉ khi selectedNamespace là "all")
    if (!keyword && !showOnlyMissing && selectedNamespace === "all")
      return response

    // Filter theo namespace trước
    let filteredSheets = response.sheets
    if (selectedNamespace !== "all") {
      filteredSheets = response.sheets.filter(
        (sheet) => sheet.sheetId.toString() === selectedNamespace
      )
    }

    return {
      ...response,
      sheets: filteredSheets
        .map((sheet) => {
          if (!sheet || !sheet.rows) return { ...sheet, rows: [] }

          const rows = sheet.rows.filter((row) => {
            // filter theo search
            if (!matchesSearch(row, keyword)) return false

            // filter theo missing translations - chỉ check ngôn ngữ đã chọn
            if (showOnlyMissing) {
              return hasMissingTranslations(row, selectedLocales)
            }

            return true
          })

          return { ...sheet, rows }
        })
        .filter((sheet) => sheet.rows && sheet.rows.length > 0),
    }
  }, [
    response,
    debouncedSearch,
    showOnlyMissing,
    selectedNamespace,
    selectedLocales,
  ])

  return {
    filtered,
    search,
    setSearch,
    showOnlyMissing,
    setShowOnlyMissing,
    selectedNamespace,
    setSelectedNamespace,
    isSearching, // New: indicates if search is being debounced
  }
}
