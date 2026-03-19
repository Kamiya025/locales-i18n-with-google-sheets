"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import {
  translateWithGemini,
  getStoredApiKey,
  setStoredApiKey,
  removeStoredApiKey,
  isAutoTranslateEnabled,
  setAutoTranslateEnabled as setStoredAutoTranslateEnabled,
  TranslationResult,
} from "@/lib/gemini-translate"
import { SpreadsheetResponse, SpreadsheetItem } from "@/models"

interface MissingTranslation {
  sheetTitle: string
  sheetId: number
  key: string
  sourceText: string
  sourceLanguage: string
  missingLanguages: string[]
}

interface UseGeminiTranslateReturn {
  // API key management
  apiKey: string
  setApiKey: (key: string) => void
  saveApiKey: () => void
  clearApiKey: () => void
  hasApiKey: boolean

  // Auto-translate toggle
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void

  // Translation actions
  translateMissing: (data: SpreadsheetResponse, sheetId?: number) => Promise<TranslationResult & { missingItems: MissingTranslation[] }>
  isTranslating: boolean
  translationProgress: string

  // Missing keys analysis
  analyzeMissingKeys: (data: SpreadsheetResponse, sheetId?: number) => MissingTranslation[]
}

export function useGeminiTranslate(): UseGeminiTranslateReturn {
  const [apiKey, setApiKeyState] = useState("")
  const [isEnabled, setIsEnabledState] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationProgress, setTranslationProgress] = useState("")

  // Load from localStorage on mount
  useEffect(() => {
    setApiKeyState(getStoredApiKey())
    setIsEnabledState(isAutoTranslateEnabled())
  }, [])

  const hasApiKey = useMemo(() => apiKey.trim().length > 0, [apiKey])

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
  }, [])

  const saveApiKey = useCallback(() => {
    setStoredApiKey(apiKey)
  }, [apiKey])

  const clearApiKey = useCallback(() => {
    setApiKeyState("")
    removeStoredApiKey()
  }, [])

  const setIsEnabled = useCallback((enabled: boolean) => {
    setIsEnabledState(enabled)
    setStoredAutoTranslateEnabled(enabled)
  }, [])

  /**
   * Analyze spreadsheet data to find missing translations
   */
  const analyzeMissingKeys = useCallback(
    (data: SpreadsheetResponse, sheetId?: number): MissingTranslation[] => {
      const missing: MissingTranslation[] = []
      const sheetsToAnalyze = sheetId !== undefined 
        ? data.sheets.filter(s => s.sheetId === sheetId)
        : data.sheets

      for (const sheet of sheetsToAnalyze) {
        // Get all languages from this sheet
        const allLangs = new Set<string>()
        for (const row of sheet.rows) {
          Object.keys(row.data).forEach((lang) => allLangs.add(lang))
        }
        const languages = Array.from(allLangs)

        for (const row of sheet.rows) {
          const missingLangs = languages.filter(
            (lang) => !row.data[lang] || !row.data[lang].trim()
          )

          if (missingLangs.length > 0 && missingLangs.length < languages.length) {
            // Find the first available translation as source
            const sourceLang = languages.find(
              (lang) => row.data[lang] && row.data[lang].trim()
            )
            if (sourceLang) {
              missing.push({
                sheetTitle: sheet.title,
                sheetId: sheet.sheetId,
                key: row.key,
                sourceText: row.data[sourceLang],
                sourceLanguage: sourceLang,
                missingLanguages: missingLangs,
              })
            }
          }
        }
      }

      return missing
    },
    []
  )

  /**
   * Translate all missing keys using Gemini
   */
  const translateMissing = useCallback(
    async (data: SpreadsheetResponse, sheetId?: number) => {
      setIsTranslating(true)
      setTranslationProgress("Analyzing missing translations...")

      try {
        const missingItems = analyzeMissingKeys(data, sheetId)

        if (missingItems.length === 0) {
          setTranslationProgress("No missing translations found!")
          return { translations: {}, errors: [], missingItems: [] }
        }

        // Group by target languages for more efficient API calls
        const keysToTranslate: Record<string, string> = {}
        const allTargetLangs = new Set<string>()

        for (const item of missingItems) {
          keysToTranslate[item.key] = item.sourceText
          item.missingLanguages.forEach((lang) => allTargetLangs.add(lang))
        }

        setTranslationProgress(
          `Translating ${missingItems.length} keys to ${allTargetLangs.size} languages...`
        )

        // Batch translation - split into chunks of 30 keys to avoid token limits
        const BATCH_SIZE = 30
        const keys = Object.entries(keysToTranslate)
        const allTranslations: Record<string, Record<string, string>> = {}
        const allErrors: string[] = []

        for (let i = 0; i < keys.length; i += BATCH_SIZE) {
          const batch = keys.slice(i, i + BATCH_SIZE)
          const batchKeys = Object.fromEntries(batch)

          setTranslationProgress(
            `Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(keys.length / BATCH_SIZE)}...`
          )

          const result = await translateWithGemini(apiKey, {
            keys: batchKeys,
            targetLanguages: Array.from(allTargetLangs),
            sourceLanguage: missingItems[0]?.sourceLanguage,
          })

          Object.assign(allTranslations, result.translations)
          allErrors.push(...result.errors)
        }

        setTranslationProgress(
          allErrors.length > 0
            ? `Done with ${allErrors.length} errors`
            : `Successfully translated ${Object.keys(allTranslations).length} keys!`
        )

        return {
          translations: allTranslations,
          errors: allErrors,
          missingItems,
        }
      } finally {
        setIsTranslating(false)
      }
    },
    [apiKey, analyzeMissingKeys]
  )

  return {
    apiKey,
    setApiKey,
    saveApiKey,
    clearApiKey,
    hasApiKey,
    isEnabled,
    setIsEnabled,
    translateMissing,
    isTranslating,
    translationProgress,
    analyzeMissingKeys,
  }
}
