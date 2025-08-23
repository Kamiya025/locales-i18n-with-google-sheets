// utils/transform.ts

import { SpreadsheetResponse } from "../models"

function setNestedKey(obj: Record<string, any>, path: string, value: any) {
  const parts = path.split(".")
  let current = obj

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value
    } else {
      if (!current[part] || typeof current[part] !== "object") {
        current[part] = {}
      }
      current = current[part]
    }
  })
}

/**
 * Convert SpreadsheetResponse -> { lang: { sheetName: { ...keys } } }
 */
export function transformToI18n(sheet: SpreadsheetResponse) {
  const translations: Record<string, any> = {}

  sheet.sheets.forEach((sheetItem) => {
    sheetItem.rows.forEach((row) => {
      Object.entries(row.data).forEach(([lang, value]) => {
        if (!translations[lang]) translations[lang] = {}
        if (!translations[lang][sheetItem.title]) {
          translations[lang][sheetItem.title] = {}
        }

        setNestedKey(translations[lang][sheetItem.title], row.key, value)
      })
    })
  })

  return translations
}
