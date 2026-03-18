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

export default function ExportConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  data,
}: ExportConfirmationModalProps) {
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
    onConfirm(selectedFallback || undefined, selectedLanguages)
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
      title="📦 Thiết lập Xuất JSON"
      subtitle="Quản lý ngôn ngữ dự phòng và kiểm tra tỉ lệ dịch thuật"
      size="lg"
      footer={
        <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-black dark:to-indigo-950 text-white shadow-2xl relative overflow-hidden border-t border-white/10">
          {/* Abstract decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <DownloadIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black leading-none mb-1">
                  Xuất {selectedLanguages.length} File
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Dự phòng bằng{" "}
                  <span className="text-blue-400 font-bold">
                    {selectedFallback || "Không có"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedLanguages.length === 0}
                className="flex-[2] sm:px-10 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95"
              >
                Bắt đầu tải về
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8 pb-4">
        {/* Statistics Header Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Ngôn ngữ",
              value: languageStats.length,
              icon: "🌍",
              color: "from-blue-500/10 to-indigo-500/10",
            },
            {
              label: "Tổng từ khóa",
              value: languageStats[0]?.total || 0,
              icon: "🔖",
              color: "from-purple-500/10 to-violet-500/10",
            },
            {
              label: "Hoàn thành TB",
              value: `${Math.round(languageStats.reduce((sum, s) => sum + s.percentage, 0) / (languageStats.length || 1))}%`,
              icon: "✅",
              color: "from-emerald-500/10 to-teal-500/10",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${card.color} border border-white/40 dark:border-white/5 shadow-sm`}
            >
              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                  {card.label}
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {card.value}
                </div>
              </div>
              <div className="absolute -right-2 -bottom-2 text-4xl opacity-10 grayscale">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-4 h-1 bg-blue-600 rounded-full"></span>
            Cấu hình Ngôn ngữ
          </h3>
          <button
            onClick={toggleAll}
            className="text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-200 dark:border-slate-700"
          >
            {selectedLanguages.length === languageStats.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </button>
        </div>

        {/* Language List - Now flexible inside the Dialog's scrollable area */}
        <div className="space-y-3">
          {/* No Fallback Option */}
          <button
            onClick={() => setSelectedFallback("")}
            className={`w-full text-left group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
              selectedFallback === ""
                ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/5"
                : "border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-white/40 dark:bg-slate-900/40"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedFallback === "" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500"}`}
            >
              <BanIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white text-base">
                Không sử dụng fallback
              </div>
              <div className="text-xs text-slate-500">
                Giữ nguyên các giá trị trống trong file JSON
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedFallback === "" ? "border-blue-600 bg-blue-600" : "border-slate-200 dark:border-slate-700"}`}
            >
              {selectedFallback === "" && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              )}
            </div>
          </button>

          {/* Individual Language Options */}
          {languageStats.map((stat) => (
            <div
              key={stat.language}
              className={`group relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedFallback === stat.language
                  ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/5"
                  : "border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900 bg-white/40 dark:bg-slate-900/40"
              }`}
            >
              {/* Top Section: Logic & Identity */}
              <div className="flex items-center gap-4 mb-4">
                {/* Export Selection (Checkbox) */}
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(stat.language)}
                  onChange={() => toggleLanguage(stat.language)}
                  className="w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/30 transition-all cursor-pointer"
                  title="Xuất file cho ngôn ngữ này"
                />

                {/* Info */}
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner border-2 ${
                      stat.percentage === 100
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                    }`}
                  >
                    {stat.language.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 dark:text-white text-lg leading-none">
                        {stat.language}
                      </h4>
                      {suggestedFallback?.language === stat.language && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-white tracking-tighter">
                          Gợi ý
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {stat.completed} từ hoàn thành • {stat.missing} từ còn
                      thiếu
                    </p>
                  </div>
                </div>

                {/* Fallback Selection (Radio) */}
                <button
                  onClick={() => setSelectedFallback(stat.language)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    selectedFallback === stat.language
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-tighter">
                    Làm Fallback
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedFallback === stat.language ? "border-white" : "border-slate-300 dark:border-slate-600"}`}
                  >
                    {selectedFallback === stat.language && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </button>
              </div>

              {/* Progress Visualizer */}
              <div className="relative group/progress">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tỉ lệ dịch thuật
                  </span>
                  <span
                    className={`text-[11px] font-black ${stat.percentage === 100 ? "text-emerald-500" : "text-blue-500"}`}
                  >
                    {stat.percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[2px] border border-slate-200/50 dark:border-slate-700/50">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(stat.percentage)} transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Success Badge */}
              {stat.percentage === 100 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
