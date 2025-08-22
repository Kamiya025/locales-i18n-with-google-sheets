import { SpreadsheetResponse } from "@/models"
import { useMemo, useState } from "react"

export function useGlobalSpreadsheetFilter(
  response: SpreadsheetResponse | null
) {
  const [search, setSearch] = useState("")
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)

  const filtered = useMemo(() => {
    if (!response) return response

    const keyword = search.trim().toLowerCase()

    // lấy danh sách ngôn ngữ duy nhất
    const langs =
      response.sheets.flatMap((s) =>
        s.rows.flatMap((r) => Object.keys(r.data))
      ) || []
    const uniqueLangs = Array.from(new Set(langs))

    // nếu không filter gì thì return luôn
    if (!keyword && !showOnlyMissing) return response

    return {
      ...response,
      sheets: response.sheets
        .map((sheet) => {
          const rows = sheet.rows.filter((row) => {
            // filter theo search
            const matchSearch =
              !keyword ||
              row.key.toLowerCase().includes(keyword) ||
              Object.values(row.data).some((v) =>
                (v ?? "").toLowerCase().includes(keyword)
              )

            if (!matchSearch) return false

            // filter theo missing translations
            if (showOnlyMissing) {
              return uniqueLangs.some((lang) => !(row.data[lang] ?? "").trim())
            }

            return true
          })

          return { ...sheet, rows }
        })
        .filter((sheet) => sheet.rows.length > 0),
    }
  }, [response, search, showOnlyMissing])

  return { filtered, search, setSearch, showOnlyMissing, setShowOnlyMissing }
}
