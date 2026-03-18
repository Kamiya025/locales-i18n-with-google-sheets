import { SpreadsheetResponse } from "@/models"

export function getLanguages(data: SpreadsheetResponse): string[] {
  const langs = new Set<string>()

  if (!data || !data.sheets || !Array.isArray(data.sheets)) {
    return []
  }

  data.sheets.forEach((sheet) => {
    if (!sheet || !sheet.rows || !Array.isArray(sheet.rows)) return
    
    sheet.rows.forEach((row) => {
      if (!row || !row.data) return
      
      Object.keys(row.data).forEach((lang) => langs.add(lang))
    })
  })

  return Array.from(langs)
}
