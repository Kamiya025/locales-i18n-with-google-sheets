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
export function transformToI18n(
  sheet: SpreadsheetResponse,
  fallbackLanguage?: string
) {
  const translations: Record<string, any> = {}

  // Collect all available languages first
  const allLanguages = new Set<string>()
  sheet.sheets.forEach((sheetItem) => {
    sheetItem.rows.forEach((row) => {
      Object.keys(row.data).forEach((lang) => allLanguages.add(lang))
    })
  })

  // Initialize all language objects
  allLanguages.forEach((lang) => {
    translations[lang] = {}
    sheet.sheets.forEach((sheetItem) => {
      translations[lang][sheetItem.title] = {}
    })
  })

  // First pass: populate with actual values
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

  // Second pass: apply fallback language for missing values
  if (fallbackLanguage && translations[fallbackLanguage]) {
    sheet.sheets.forEach((sheetItem) => {
      sheetItem.rows.forEach((row) => {
        allLanguages.forEach((lang) => {
          // Skip if this is the fallback language itself
          if (lang === fallbackLanguage) return

          const currentValue = row.data[lang]
          const fallbackValue = row.data[fallbackLanguage]

          // If current language is missing or empty, use fallback
          if (
            (!currentValue || !currentValue.trim()) &&
            fallbackValue &&
            fallbackValue.trim()
          ) {
            setNestedKey(
              translations[lang][sheetItem.title],
              row.key,
              fallbackValue
            )
          }
        })
      })
    })
  }

  return translations
}
