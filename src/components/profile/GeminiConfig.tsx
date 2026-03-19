"use client"

import { useState, useCallback, useEffect } from "react"
import { useGeminiTranslate } from "@/hooks/useGeminiTranslate"
import Button from "../ui/button"
import Switch from "../ui/switch/Switch"
import { customToast } from "../ui/toast"
import { useTranslation } from "@/providers/I18nProvider"

export default function GeminiConfig() {
  const { t } = useTranslation()
  const {
    apiKey,
    setApiKey,
    saveApiKey,
    clearApiKey,
    hasApiKey,
    isEnabled,
    setIsEnabled,
  } = useGeminiTranslate()

  const [showApiKey, setShowApiKey] = useState(false)
  const [localApiKey, setLocalApiKey] = useState("")

  // Sync local state with hook state
  useEffect(() => {
    setLocalApiKey(apiKey)
  }, [apiKey])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {/* Enable/Disable Toggle */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden group transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <svg
                  className="w-6 h-6 text-white"
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
                <h3 className="font-bold text-slate-900 tracking-tight">
                  {t("detail.autoTranslate.enableTitle")}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t("detail.autoTranslate.enableDesc")}
                </p>
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onChange={setIsEnabled}
              color="blue"
            />
          </div>
        </div>

        {/* API Key Configuration */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden group transition-all hover:shadow-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
              <svg
                className="w-6 h-6 text-white"
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
              <h3 className="font-bold text-slate-900 tracking-tight">
                {t("detail.autoTranslate.apiKeyTitle")}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {t("detail.autoTranslate.apiKeyDesc")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder={t("detail.autoTranslate.apiKeyPlaceholder")}
                className="w-full px-5 py-4 pr-14 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title={showApiKey ? "Ẩn" : "Hiện"}
              >
                {showApiKey ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                   </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                size="md"
                variant="primary"
                onClick={handleSaveApiKey}
                disabled={!localApiKey.trim()}
                className="!px-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-900 hover:bg-black shadow-lg shadow-slate-200"
              >
                {t("detail.autoTranslate.saveKeyButton")}
              </Button>
              {hasApiKey && (
                <Button
                  size="md"
                  variant="outline"
                  onClick={handleClearApiKey}
                  className="!px-6 rounded-xl font-bold text-xs uppercase tracking-widest border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
                >
                  {t("detail.autoTranslate.clearKeyButton")}
                </Button>
              )}
            </div>

            {/* Link to get API Key */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 font-medium">
                {t("detail.autoTranslate.getApiKeyHint") || "Chưa có API Key? Lấy miễn phí tại "}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4 inline-flex items-center gap-1 ml-1"
                >
                  Google AI Studio
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </p>
            </div>

            {/* Security note */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                {t("detail.autoTranslate.securityNote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
