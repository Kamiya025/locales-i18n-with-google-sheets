"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { customToast } from "@/components/ui/toast"
import { parseExcelToSpreadsheetResponse } from "@/util/excel"

export default function ExcelPanel() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      customToast.error("Vui lòng chọn file .xlsx hoặc .xls")
      return
    }
    setIsProcessing(true)
    setFileName(file.name)
    try {
      const data = await parseExcelToSpreadsheetResponse(file)
      sessionStorage.setItem("temp_excel_data", JSON.stringify(data))
      await new Promise((r) => setTimeout(r, 200))
      router.push("/sheet/local-excel")
    } catch (err) {
      console.error(err)
      customToast.error("Lỗi khi đọc file Excel, vui lòng thử lại.")
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
              ? "border-emerald-400 bg-emerald-50/60 scale-[1.01]"
              : "border-slate-300/70 bg-white/50 hover:border-emerald-400/70 hover:bg-emerald-50/30"
          }`}
      >
        {isProcessing ? (
          <>
            <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              Đang xử lý{" "}
              <span className="text-emerald-600 font-semibold">{fileName}</span>
              ...
            </p>
          </>
        ) : (
          <>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDragging ? "bg-emerald-100 scale-110" : "bg-slate-100"}`}
            >
              <svg
                className={`w-7 h-7 transition-colors ${isDragging ? "text-emerald-500" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                Kéo thả file vào đây
              </p>
              <p className="text-xs text-slate-400 mt-1">
                hoặc{" "}
                <span className="text-emerald-600 font-medium underline underline-offset-2">
                  chọn từ máy tính
                </span>{" "}
                · .xlsx, .xls
              </p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-2">
        {[
          "Không cần đăng nhập",
          "Xử lý trên máy tính",
          "Dữ liệu không gửi đi",
        ].map((txt) => (
          <span
            key={txt}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium"
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
