"use client"

import { SpreadsheetResponse } from "@/models"
import { getLanguages } from "@/util"
import { useMemo, useState, useEffect } from "react"
import Button from "../button"
import { Dialog } from "../dialog"
import {
  SortIcon,
  CheckCircleIcon,
  BanIcon,
  DocumentIcon,
  CloseIcon,
  DownloadIcon,
} from "../icons"

interface LanguageStats {
  language: string
  total: number
  completed: number
  missing: number
  percentage: number
}

interface ExportConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (
    fallbackLanguage: string | undefined,
    selectedLanguages: string[],
  ) => void
  data: SpreadsheetResponse
}

import { useTranslation } from "@/providers/I18nProvider"

export default function ExportConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  data,
}: ExportConfirmationModalProps) {
  const { t, locale } = useTranslation()
  const [exportFormat, setExportFormat] = useState<"JSON" | "EXCEL">("JSON")
  const [selectedFallback, setSelectedFallback] = useState<string>("")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  // Reset/Initialize selections when data or modal state changes
  useEffect(() => {
    if (isOpen && data) {
      const langs = getLanguages(data)
      setSelectedLanguages(langs)

      // Default fallback to the first language if not already set
      if (!selectedFallback && langs.length > 0) {
        setSelectedFallback(langs[0])
      }
    }
  }, [isOpen, data, selectedFallback])

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    )
  }

  const toggleAll = () => {
    const allLangs = getLanguages(data)
    if (selectedLanguages.length === allLangs.length) {
      setSelectedLanguages([])
    } else {
      setSelectedLanguages(allLangs)
    }
  }

  // Calculate statistics for each language
  const languageStats = useMemo((): LanguageStats[] => {
    if (!data) return []
    const languages = getLanguages(data)
    const stats: LanguageStats[] = []

    languages.forEach((lang) => {
      let total = 0
      let completed = 0

      data.sheets.forEach((sheet) => {
        sheet.rows?.forEach((row) => {
          if (row && row.data) {
            total++
            const value = row.data[lang]
            if (value && value.trim().length > 0) {
              completed++
            }
          }
        })
      })

      const missing = total - completed
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      stats.push({
        language: lang,
        total,
        completed,
        missing,
        percentage,
      })
    })

    return stats.sort((a, b) => b.percentage - a.percentage)
  }, [data])

  // Find best candidates for fallback
  const suggestedFallback = useMemo(() => {
    return (
      languageStats.find((stat) => stat.percentage === 100) || languageStats[0]
    )
  }, [languageStats])

  const handleConfirm = () => {
    if (exportFormat === "JSON") {
      onConfirm(selectedFallback || undefined, selectedLanguages)
    } else {
      // Special format for Excel
      onConfirm("EXCEL_FORMAT" as any, []) 
    }
    onClose()
  }

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "from-emerald-400 to-emerald-600"
    if (percentage >= 80) return "from-blue-400 to-blue-600"
    if (percentage >= 50) return "from-amber-400 to-amber-600"
    return "from-rose-400 to-rose-600"
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t("detail.exportModal.title")}
      subtitle={t("detail.exportModal.subtitle")}
      size="lg"
      footer={
        <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-black dark:to-indigo-950 text-white shadow-2xl relative overflow-hidden border-t border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <DownloadIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black leading-none mb-1">
                  {exportFormat === "JSON" 
                    ? t("detail.exportModal.exportCount").replace("{count}", selectedLanguages.length.toString())
                    : t("detail.exportModal.exportExcelAction")}
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  {exportFormat === "JSON" 
                    ? t("detail.exportModal.fallbackBy").replace("{lang}", selectedFallback || t("detail.exportModal.none"))
                    : `${data.sheets.length} categories · ${languageStats[0]?.total || 0} keywords`}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
              >
                {t("detail.exportModal.cancel")}
              </button>
              <button
                onClick={handleConfirm}
                disabled={exportFormat === "JSON" && selectedLanguages.length === 0}
                className="sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95"
              >
                {t("detail.exportModal.startDownload")}
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8 pb-4">
        {/* Format Selector */}
        <div className="space-y-3 px-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            {t("detail.exportModal.formatLabel")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "JSON", title: t("detail.exportModal.jsonTitle"), desc: t("detail.exportModal.jsonDesc"), icon: "📄" },
              { id: "EXCEL", title: t("detail.exportModal.excelTitle"), desc: t("detail.exportModal.excelDesc"), icon: "📊" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setExportFormat(f.id as any)}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  exportFormat === f.id
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/10"
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 bg-white/40 dark:bg-slate-900/40"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${exportFormat === f.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${exportFormat === f.id ? "text-blue-600" : "text-slate-800 dark:text-white"}`}>
                    {f.title}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    {f.desc}
                  </div>
                </div>
                {exportFormat === f.id && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {exportFormat === "JSON" ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t("detail.exportModal.stats.languages"), value: languageStats.length, icon: "🌍", color: "from-blue-500/10 to-indigo-500/10" },
                { label: t("detail.exportModal.stats.totalKeywords"), value: languageStats[0]?.total || 0, icon: "🔖", color: "from-purple-500/10 to-violet-500/10" },
                { label: t("detail.exportModal.stats.averageCompleted"), value: `${Math.round(languageStats.reduce((sum, s) => sum + s.percentage, 0) / (languageStats.length || 1))}%`, icon: "✅", color: "from-emerald-500/10 to-teal-500/10" },
              ].map((card, i) => (
                <div key={i} className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${card.color} border border-white/40 dark:border-white/5`}>
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{card.label}</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 text-4xl opacity-10 grayscale">{card.icon}</div>
                </div>
              ))}
            </div>

            {/* Config Header */}
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-4 h-1 bg-blue-600 rounded-full"></span>
                {t("detail.exportModal.configTitle")}
              </h3>
              <button
                onClick={toggleAll}
                className="text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                {selectedLanguages.length === languageStats.length
                  ? t("detail.exportModal.deselectAll")
                  : t("detail.exportModal.selectAll")}
              </button>
            </div>

            {/* Language Selection List */}
            <div className="space-y-3">
              <button
                onClick={() => setSelectedFallback("")}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  selectedFallback === "" ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10" : "border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedFallback === "" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
                  <BanIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 dark:text-white">{t("detail.exportModal.noFallback")}</div>
                  <div className="text-xs text-slate-500">{t("detail.exportModal.noFallbackDesc")}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedFallback === "" ? "border-blue-600 bg-blue-600" : "border-slate-200"}`}>
                  {selectedFallback === "" && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                </div>
              </button>

              {languageStats.map((stat) => (
                <div
                  key={stat.language}
                  className={`relative flex flex-col p-4 rounded-2xl border-2 transition-all ${
                    selectedFallback === stat.language ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10" : "border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(stat.language)}
                      onChange={() => toggleLanguage(stat.language)}
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-blue-600 cursor-pointer"
                    />
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-black border-2 border-slate-200/50 dark:border-slate-700/50 text-slate-600">
                        {stat.language.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 dark:text-white text-lg">{stat.language}</h4>
                          {suggestedFallback?.language === stat.language && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-white">i18m</span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          {t("detail.exportModal.wordsCompleted").replace("{count}", stat.completed.toString())} • {t("detail.exportModal.wordsMissing").replace("{count}", stat.missing.toString())}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFallback(stat.language)}
                      className={`px-3 py-2 rounded-xl transition-all ${
                        selectedFallback === stat.language ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      <span className="text-[10px] font-semibold">{t("detail.exportModal.setAsFallback")}</span>
                    </button>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(stat.percentage)}`} style={{ width: `${stat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Excel Overview */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
            <div className="w-24 h-24 rounded-[32px] bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-900/20 shadow-xl shadow-emerald-500/10">
              <span className="text-5xl">📊</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {t("detail.exportModal.excelTitle")}
              </h3>
              <p className="text-sm text-slate-500 font-medium max-w-xs">
                {t("detail.exportModal.excelDesc")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Categories</div>
                <div className="text-xl font-black text-emerald-600">{data.sheets.length}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Keys</div>
                <div className="text-xl font-black text-emerald-600">{languageStats[0]?.total || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
