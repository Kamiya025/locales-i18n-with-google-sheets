"use client"

import { SpreadsheetResponse } from "@/models"
import { getLanguages } from "@/util"
import { useMemo, useState } from "react"
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

  // Load initially all languages into selectedLanguages when data changes
  useMemo(() => {
    if (data) {
      setSelectedLanguages(getLanguages(data))
    }
  }, [data])

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    )
  }

  // Tính toán thống kê cho từng ngôn ngữ
  const languageStats = useMemo((): LanguageStats[] => {
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

  // Tìm ngôn ngữ hoàn thành tốt nhất để đề xuất làm fallback
  const suggestedFallback = useMemo(() => {
    const bestLanguage = languageStats.find((stat) => stat.percentage === 100)
    return bestLanguage || languageStats[0]
  }, [languageStats])

  const handleConfirm = () => {
    onConfirm(selectedFallback || undefined, selectedLanguages)
    onClose()
  }

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "bg-emerald-500"
    if (percentage >= 80) return "bg-blue-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="📊 Xuất file JSON"
      subtitle="Chọn ngôn ngữ dự phòng và xem thống kê hoàn thành"
      size="md"
    >
      <div className="space-y-6">
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {languageStats.length}
            </div>
            <div className="text-sm text-blue-600/70">Ngôn ngữ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {languageStats[0]?.total || 0}
            </div>
            <div className="text-sm text-blue-600/70">Từ khóa</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                languageStats.reduce((sum, stat) => sum + stat.percentage, 0) /
                  languageStats.length,
              )}
              %
            </div>
            <div className="text-sm text-blue-600/70">Hoàn thành TB</div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <SortIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">
                Chọn ngôn ngữ dự phòng
              </h3>
              <p className="text-sm text-slate-600">
                Thay thế từ khóa thiếu bằng ngôn ngữ có sẵn
                {suggestedFallback && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    💡 Đề xuất: {suggestedFallback.language}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Grid layout cho options */}
          <div className="grid gap-3">
            {/* Option không sử dụng fallback */}
            <label
              className={`group flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedFallback === ""
                  ? "border-slate-400 bg-slate-50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="relative">
                <input
                  type="radio"
                  name="fallback"
                  value=""
                  checked={selectedFallback === ""}
                  onChange={(e) => setSelectedFallback(e.target.value)}
                  className="w-5 h-5 text-slate-600 focus:ring-slate-500 focus:ring-2"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <BanIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    Không sử dụng fallback
                  </div>
                  <div className="text-sm text-slate-600">
                    Giữ nguyên từ khóa thiếu
                  </div>
                </div>
              </div>
            </label>

            {/* Options cho từng ngôn ngữ */}
            {languageStats.map((stat) => (
              <label
                key={stat.language}
                className={`group flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedFallback === stat.language
                    ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200/50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
                }`}
              >
                {/* Checkbox for selection */}
                <div
                  className="relative mr-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    title="Chọn tải file ngôn ngữ này"
                    checked={selectedLanguages.includes(stat.language)}
                    onChange={() => toggleLanguage(stat.language)}
                    className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  />
                </div>

                <div className="relative">
                  <input
                    type="radio"
                    name="fallback"
                    title="Chọn làm ngôn ngữ thay thế cho các trường trống"
                    value={stat.language}
                    checked={selectedFallback === stat.language}
                    onChange={(e) => setSelectedFallback(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                          stat.percentage === 100
                            ? "bg-emerald-100 text-emerald-700"
                            : stat.percentage >= 80
                              ? "bg-blue-100 text-blue-700"
                              : stat.percentage >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stat.language.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {stat.language}
                        </div>
                        <div className="text-sm text-slate-600">
                          {stat.completed}/{stat.total} từ khóa
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                          stat.percentage === 100
                            ? "bg-emerald-500 text-white"
                            : stat.percentage >= 80
                              ? "bg-blue-500 text-white"
                              : stat.percentage >= 60
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                        }`}
                      >
                        {stat.percentage}%
                      </div>
                      {stat.percentage === 100 && (
                        <div className="text-emerald-500">
                          <CheckCircleIcon
                            className="w-5 h-5"
                            fill="currentColor"
                            stroke="none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar nổi bật */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${getProgressColor(
                        stat.percentage,
                      )}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>

                  {/* Status */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span
                      className={
                        stat.missing > 0
                          ? "text-slate-600"
                          : "text-emerald-600 font-medium"
                      }
                    >
                      {stat.missing > 0
                        ? `⚠️ Thiếu ${stat.missing} từ`
                        : "✅ Hoàn thành"}
                    </span>
                    {suggestedFallback?.language === stat.language && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Đề xuất
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">
                  Sẽ tạo {selectedLanguages.length} file JSON
                </div>
                <div className="text-sm text-slate-600">
                  Fallback:{" "}
                  <span className="font-medium text-slate-800">
                    {selectedFallback || "Không sử dụng"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {selectedLanguages.length}
              </div>
              <div className="text-xs text-indigo-600/70">files</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button onClick={onClose} variant="outline" className="flex-1 h-12">
            <CloseIcon className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            disabled={selectedLanguages.length === 0}
            className={`flex-1 h-12 text-lg font-semibold ${selectedLanguages.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            icon={<DownloadIcon className="w-5 h-5" />}
          >
            Xuất {selectedLanguages.length} file JSON
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
