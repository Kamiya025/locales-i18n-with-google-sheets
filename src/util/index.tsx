import { SpreadsheetResponse } from "@/models"

export function getLanguages(data: SpreadsheetResponse): string[] {
  const langs = new Set<string>()

  data.sheets.forEach((sheet) => {
    sheet.rows.forEach((row) => {
      Object.keys(row.data).forEach((lang) => langs.add(lang))
    })
  })

  return Array.from(langs)
}
