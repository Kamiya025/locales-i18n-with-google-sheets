"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useGeminiTranslate } from "@/hooks/useGeminiTranslate"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
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

        {/* API Key Configuration */}
        <div className="glass-effect border border-slate-200/30 rounded-xl p-5 backdrop-blur-md space-y-4">
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
              <p className="text-xs text-slate-500">
                {t("detail.autoTranslate.apiKeyDesc")}
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder={t("detail.autoTranslate.apiKeyPlaceholder")}
              className="w-full px-4 py-3 pr-24 rounded-xl border border-slate-200/60 bg-white/80 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all font-mono"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title={showApiKey ? "Hide" : "Show"}
              >
                {showApiKey ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveApiKey}
              disabled={!localApiKey.trim()}
              className="!px-4 !py-2 rounded-xl text-xs"
            >
              {t("detail.autoTranslate.saveKeyButton")}
            </Button>
            {hasApiKey && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearApiKey}
                className="!px-4 !py-2 rounded-xl text-xs border-red-200 text-red-500 hover:bg-red-50"
              >
                {t("detail.autoTranslate.clearKeyButton")}
              </Button>
            )}
          </div>

          {/* Link to get API Key */}
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("detail.autoTranslate.getApiKeyHint") || "Chưa có API Key? Lấy miễn phí tại "}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Google AI Studio
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>

          {/* Security note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100/50">
            <svg
              className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-xs text-blue-700 leading-relaxed">
              {t("detail.autoTranslate.securityNote")}
            </p>
          </div>
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
