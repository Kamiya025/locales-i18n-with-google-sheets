"use client"

import { useState, useRef, useCallback } from "react"
import { parseJsonFile } from "@/util/json-to-excel"
import {
  convertJsonFilesToStyledXlsx,
  ParsedJsonFile,
} from "@/util/excel-styled"
import { customToast } from "@/components/ui/toast"

import { useTranslation } from "@/providers/I18nProvider"

export default function JsonToExcelPanel() {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [parsedFiles, setParsedFiles] = useState<ParsedJsonFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files)
    const jsonFiles = arr.filter((f) => f.name.endsWith(".json"))
    if (jsonFiles.length === 0) {
      customToast.error(t("home.jsonToExcelPanel.invalidFile"))
      return
    }
    setIsConverting(true)
    try {
      const results = await Promise.all(jsonFiles.map(parseJsonFile))
      // Merge — avoid duplicate languages
      setParsedFiles((prev) => {
        const existing = new Map(prev.map((p) => [p.language, p]))
        results.forEach((r) => existing.set(r.language, r))
        return Array.from(existing.values())
      })
      customToast.success(t("home.jsonToExcelPanel.readSuccess").replace("{count}", results.length.toString()))
    } catch (err: any) {
      customToast.error(err.message ?? t("home.jsonToExcelPanel.readError"))
    } finally {
      setIsConverting(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }, [t])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const removeFile = (lang: string) => {
    setParsedFiles((prev) => prev.filter((f) => f.language !== lang))
  }

  const handleConvert = async () => {
    if (parsedFiles.length === 0) {
      customToast.error(t("home.jsonToExcelPanel.noFilesToConvert"))
      return
    }
    try {
      await convertJsonFilesToStyledXlsx(parsedFiles, "translations")
      customToast.success(t("home.jsonToExcelPanel.exportSuccess"))
    } catch (e: any) {
      customToast.error(e.message ?? t("home.jsonToExcelPanel.exportError"))
    }
  }

  const totalKeys =
    parsedFiles.length > 0
      ? Math.max(...parsedFiles.map((f) => Object.keys(f.data).length))
      : 0

  return (
    <div className="flex flex-col gap-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isConverting && inputRef.current?.click()}
        className={`relative cursor-pointer flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed p-7 transition-all duration-200
          ${
            isDragging
              ? "border-violet-400 bg-violet-50/60 scale-[1.01]"
              : "border-slate-300/70 bg-white/50 hover:border-violet-400/70 hover:bg-violet-50/30"
          }`}
      >
        {isConverting ? (
          <>
            <div className="w-9 h-9 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              {t("home.jsonToExcelPanel.processing")}
            </p>
          </>
        ) : (
          <>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDragging ? "bg-violet-100 scale-110" : "bg-slate-100"}`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${isDragging ? "text-violet-500" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {t("home.jsonToExcelPanel.dropTitle")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {t("home.jsonToExcelPanel.dropSubtitle").split("{choose}").map((part, index) => {
                  if (index === 0) return part
                  return (
                    <span key={index} className="contents">
                      <span className="text-violet-600 font-medium underline underline-offset-2">
                        {t("home.jsonToExcelPanel.chooseFile")}
                      </span>
                      {part}
                    </span>
                  )
                })}
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {parsedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {/* Stats bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {t("home.jsonToExcelPanel.stats")
                .replace("{languages}", parsedFiles.length.toString())
                .replace("{keywords}", totalKeys.toLocaleString())}
            </span>
            <button
              onClick={() => setParsedFiles([])}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              {t("home.jsonToExcelPanel.deleteAll")}
            </button>
          </div>

          {/* Language chips */}
          <div className="flex flex-wrap gap-2">
            {parsedFiles.map((f) => (
              <div
                key={f.language}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200/70 group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold uppercase leading-none">
                    {f.language.slice(0, 2)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-violet-700">
                  {f.language}.json
                </span>
                <span className="text-xs text-violet-400">
                  ({Object.keys(f.data).length})
                </span>
                <button
                  onClick={() => removeFile(f.language)}
                  className="text-violet-300 hover:text-red-400 transition-colors ml-0.5"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            className="mt-1 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.01] transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {t("home.jsonToExcelPanel.exportButton")}
          </button>
        </div>
      )}

      {/* Info badges */}
      <div className="flex flex-wrap gap-2">
        {(t("home.jsonToExcelPanel.features") as any as string[]).map((txt) => (
          <span
            key={txt}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60 font-medium"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {txt}
          </span>
        ))}
      </div>
    </div>
  )
}
