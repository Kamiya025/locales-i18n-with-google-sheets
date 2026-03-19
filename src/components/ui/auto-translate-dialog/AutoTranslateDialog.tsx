"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useGeminiTranslate } from "@/hooks/useGeminiTranslate"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import Link from "next/link"
import Button from "../button"
import { Dialog } from "../dialog"
import Switch from "../switch/Switch"
import { customToast } from "../toast"
import { useTranslation } from "@/providers/I18nProvider"

interface AutoTranslateDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly spreadsheetId: string
  readonly sheetId?: number
}

export default function AutoTranslateDialog({
  isOpen,
  onClose,
  spreadsheetId,
  sheetId,
}: AutoTranslateDialogProps) {
  const { t } = useTranslation()
  const { data, setResponse } = useSpreadsheet()
  const {
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
  } = useGeminiTranslate()

  const [showApiKey, setShowApiKey] = useState(false)
  const [localApiKey, setLocalApiKey] = useState("")
  const [translationResults, setTranslationResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  // Sync local state with hook state
  useEffect(() => {
    setLocalApiKey(apiKey)
  }, [apiKey])

  // Analyze missing translations
  const missingStats = useMemo(() => {
    if (!data) return { total: 0, bySheet: [], byLang: {} as Record<string, number> }

    const missingItems = analyzeMissingKeys(data, sheetId)
    const bySheet: { title: string; count: number }[] = []
    const byLang: Record<string, number> = {}

    const sheetCounts: Record<string, number> = {}
    for (const item of missingItems) {
      sheetCounts[item.sheetTitle] = (sheetCounts[item.sheetTitle] || 0) + 1
      for (const lang of item.missingLanguages) {
        byLang[lang] = (byLang[lang] || 0) + 1
      }
    }

    for (const [title, count] of Object.entries(sheetCounts)) {
      bySheet.push({ title, count })
    }

    return { total: missingItems.length, bySheet, byLang }
  }, [data, analyzeMissingKeys, sheetId])

  const handleSaveApiKey = useCallback(() => {
    setApiKey(localApiKey)
    saveApiKey()
    customToast.success(t("detail.autoTranslate.apiKeySaved"))
  }, [localApiKey, setApiKey, saveApiKey, t])

  const handleClearApiKey = useCallback(() => {
    clearApiKey()
    setLocalApiKey("")
    customToast.success(t("detail.autoTranslate.apiKeyCleared"))
  }, [clearApiKey, t])

  const handleTranslate = useCallback(async () => {
    if (!data) return

    setTranslationResults(null)

    try {
      const result = await translateMissing(data, sheetId)

      if (result.errors.length > 0 && Object.keys(result.translations).length === 0) {
        customToast.error(result.errors[0])
        setTranslationResults({
          success: 0,
          failed: result.missingItems.length,
          errors: result.errors,
        })
        return
      }

      // Apply translations to spreadsheet data
      let successCount = 0
      let failCount = 0

      if (data && result.translations) {
        // Create updated data
        const updatedSheets = data.sheets.map((sheet) => {
          const updatedRows = sheet.rows.map((row) => {
            const translated = result.translations[row.key]
            if (translated) {
              const newData = { ...row.data }
              for (const [lang, text] of Object.entries(translated)) {
                if (!newData[lang] || !newData[lang].trim()) {
                  newData[lang] = text
                  successCount++
                }
              }
              return { ...row, data: newData }
            }
            return row
          })
          return { ...sheet, rows: updatedRows }
        })

        // Update the provider state
        setResponse({ ...data, sheets: updatedSheets })
      }

      failCount = result.missingItems.length - successCount

      setTranslationResults({
        success: successCount,
        failed: Math.max(0, failCount),
        errors: result.errors,
      })

      if (successCount > 0) {
        customToast.success(
          t("detail.autoTranslate.translateSuccess").replace(
            "{count}",
            successCount.toString()
          )
        )
      }
    } catch (err: any) {
      customToast.error(err?.message || "Translation failed")
    }
  }, [data, translateMissing, setResponse, t])

  const footer = (
    <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
      <Button variant="outline" onClick={onClose}>
        {t("detail.autoTranslate.closeButton")}
      </Button>

      <Button
        variant="gradient"
        onClick={handleTranslate}
        disabled={isTranslating || !hasApiKey || missingStats.total === 0}
        loading={isTranslating}
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
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        }
      >
        {isTranslating
          ? translationProgress
          : t("detail.autoTranslate.translateButton").replace(
              "{count}",
              missingStats.total.toString()
            )}
      </Button>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t("detail.autoTranslate.title")}
      subtitle={t("detail.autoTranslate.subtitle")}
      icon="🤖"
      iconColor="blue"
      size="xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="glass-effect border border-blue-200/30 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">
                  {t("detail.autoTranslate.enableTitle")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("detail.autoTranslate.enableDesc")}
                </p>
              </div>
            </div>
            <Switch
              defaultChecked={isEnabled}
              onChange={setIsEnabled}
              color="blue"
            />
          </div>
        </div>

        {/* API Key Configuration Link */}
        <div className="glass-effect border border-slate-200/30 rounded-xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">
                  {t("detail.autoTranslate.apiKeyTitle")}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {hasApiKey ? "✅ API Key đã được thiết lập" : "❌ Chưa thiết lập API Key"}
                </p>
              </div>
            </div>
            
            <Link 
              href="/profile" 
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              Cấu hình
            </Link>
          </div>

          {!hasApiKey && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50/50 border border-red-100/50">
              <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-[10px] text-red-700 leading-relaxed font-medium">
                Bạn cần thiết lập API Key trong trang cá nhân trước khi sử dụng tính năng này.
              </p>
            </div>
          )}
        </div>

        {/* Missing Translations Summary */}
        {missingStats.total > 0 ? (
          <div className="glass-effect border border-amber-200/30 rounded-xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-sm mb-1">
                  {t("detail.autoTranslate.missingTitle").replace(
                    "{count}",
                    missingStats.total.toString()
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("detail.autoTranslate.missingDesc")}
                </p>
              </div>
            </div>

            {/* By sheet breakdown */}
            <div className="space-y-2">
              {missingStats.bySheet.map(({ title, count }) => (
                <div
                  key={title}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/60 border border-slate-100/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-medium text-slate-700">
                      {title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    {count} {t("detail.autoTranslate.keys")}
                  </span>
                </div>
              ))}
            </div>

            {/* By language breakdown */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(missingStats.byLang).map(([lang, count]) => (
                <div
                  key={lang}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/50"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {lang}
                  </span>
                  <span className="text-[10px] font-black text-amber-600">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-effect border border-emerald-200/30 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800 text-sm">
                  {t("detail.autoTranslate.allCompleteTitle")}
                </h3>
                <p className="text-xs text-emerald-600">
                  {t("detail.autoTranslate.allCompleteDesc")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Translation Results */}
        {translationResults && (
          <div
            className={`glass-effect border rounded-xl p-5 backdrop-blur-md space-y-3 ${
              translationResults.errors.length > 0
                ? "border-red-200/30"
                : "border-emerald-200/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  translationResults.errors.length > 0
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {translationResults.errors.length > 0 ? "⚠" : "✓"}
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">
                {t("detail.autoTranslate.resultTitle")}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 rounded-lg bg-emerald-50/50 border border-emerald-100/50 text-center">
                <div className="text-xl font-black text-emerald-600">
                  {translationResults.success}
                </div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">
                  {t("detail.autoTranslate.successLabel")}
                </div>
              </div>
              <div className="px-4 py-3 rounded-lg bg-red-50/50 border border-red-100/50 text-center">
                <div className="text-xl font-black text-red-600">
                  {translationResults.failed}
                </div>
                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1">
                  {t("detail.autoTranslate.failedLabel")}
                </div>
              </div>
            </div>

            {translationResults.errors.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {translationResults.errors.map((error, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                    <span className="mt-0.5">•</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {translationResults.success > 0 && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                {t("detail.autoTranslate.resultNote")}
              </p>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="glass-effect border border-slate-200/30 rounded-xl p-5 backdrop-blur-md">
          <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-3">
            {t("detail.autoTranslate.howItWorksTitle")}
          </h4>
          <div className="space-y-2.5">
            {[
              t("detail.autoTranslate.howStep1"),
              t("detail.autoTranslate.howStep2"),
              t("detail.autoTranslate.howStep3"),
              t("detail.autoTranslate.howStep4"),
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold text-white">{i + 1}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
