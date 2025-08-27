"use client"

import SpreadsheetViewer from "@/components/detail"
import Header from "@/components/ui/header"
import { customToast } from "@/components/ui/toast"
import { useUpdateHistory } from "@/hooks/useUpdateHistory"
import { useSpreadsheetData } from "@/hooks/useSpreadsheetData"
import {
  SpreadsheetProvider,
  useSpreadsheet,
} from "@/providers/preadsheetProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo } from "react"

interface SpreadsheetDetailPageProps {
  spreadsheetId: string
}

// Component con bên trong provider để load data
function SpreadsheetDetailContent({
  spreadsheetId,
}: SpreadsheetDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, setResponse } = useSpreadsheet()

  // Load data bằng hook
  const {
    data: loadedData,
    isLoading,
    error,
  } = useSpreadsheetData(spreadsheetId)

  // Set data vào provider khi load xong
  useEffect(() => {
    if (loadedData) {
      setResponse(loadedData)
    }
  }, [loadedData, setResponse])

  // Tạo Google Sheets URL từ spreadsheetId để update history
  const originalUrl = useMemo(() => {
    // Ưu tiên lấy từ query params nếu có
    const urlFromParams = searchParams.get("url")
    if (urlFromParams) return decodeURIComponent(urlFromParams)

    // Fallback: tạo URL mặc định từ spreadsheetId
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  }, [spreadsheetId, searchParams])

  // Cập nhật history với title khi load data thành công
  useUpdateHistory(data ? originalUrl : null, data?.title || null)

  useEffect(() => {
    if (error) {
      customToast.error("Không thể tải spreadsheet. Vui lòng kiểm tra lại ID.")
      // Redirect về home sau 3 giây
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }
  }, [error, router])

  if (isLoading) {
    return (
      <div className="relative flex flex-col w-full min-h-screen ocean-gradient">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg text-slate-700">Đang tải spreadsheet...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="relative flex flex-col w-full min-h-screen ocean-gradient">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Không thể tải spreadsheet
            </h1>
            <p className="text-slate-600 mb-4">
              Vui lòng kiểm tra lại ID hoặc quyền truy cập
            </p>
            <p className="text-sm text-slate-500">
              Đang chuyển hướng về trang chủ...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen ocean-gradient">
      {/* Enhanced Header Component */}
      <Header isHeader={true} />

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto mt-16">
        <SpreadsheetViewer />
      </div>
    </div>
  )
}

// Component wrapper với provider
function SpreadsheetDetailWrapper({
  spreadsheetId,
}: SpreadsheetDetailPageProps) {
  return (
    <SpreadsheetProvider>
      <SpreadsheetDetailContent spreadsheetId={spreadsheetId} />
    </SpreadsheetProvider>
  )
}

export default SpreadsheetDetailWrapper
