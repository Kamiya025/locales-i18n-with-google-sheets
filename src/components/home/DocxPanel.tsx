"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { customToast } from "@/components/ui/toast"
import { parseDocxToSegments } from "@/util/docx"

import { useTranslation } from "@/providers/I18nProvider"

export default function DocxPanel() {
  const router = useRouter()
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(docx)$/i)) {
      customToast.error(t("home.docxPanel.invalidFile"))
      return
    }
    setIsProcessing(true)
    setFileName(file.name)
    try {
      const data = await parseDocxToSegments(file)
      sessionStorage.setItem("temp_docx_data", JSON.stringify(data))
      await new Promise((r) => setTimeout(r, 200))
      router.push("/translate-docx")
    } catch (err) {
      console.error(err)
      customToast.error(t("home.docxPanel.errorReading"))
      setFileName(null)
    } finally {
      setIsProcessing(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={`relative cursor-pointer flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-200
          ${
            isDragging
              ? "border-amber-400 bg-amber-50/60 scale-[1.01]"
              : "border-slate-300/70 bg-white/50 hover:border-amber-400/70 hover:bg-amber-50/30"
          }`}
      >
        {isProcessing ? (
          <>
            <div className="w-10 h-10 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              {t("home.docxPanel.processing").replace("{name}", fileName || "")}
            </p>
          </>
        ) : (
          <>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDragging ? "bg-amber-100 scale-110" : "bg-slate-100"}`}
            >
              <svg
                className={`w-7 h-7 transition-colors ${isDragging ? "text-amber-500" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {t("home.docxPanel.dropTitle")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {t("home.docxPanel.dropSubtitle").split("{choose}").map((part, index) => {
                  if (index === 0) return part
                  return (
                    <span key={index} className="contents">
                      <span className="text-amber-600 font-medium underline underline-offset-2">
                        {t("home.docxPanel.chooseFromComputer")}
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
          accept=".docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-2">
        {(t("home.docxPanel.features") as any as string[]).map((txt) => (
          <span
            key={txt}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-medium"
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
