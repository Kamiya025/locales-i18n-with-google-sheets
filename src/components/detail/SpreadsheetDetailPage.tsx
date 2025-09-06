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
import { SpreadsheetResponse } from "@/models"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

interface SpreadsheetDetailPageProps {
  spreadsheetId: string
}

// Component con bên trong provider để load data
function SpreadsheetDetailContent({
  spreadsheetId,
}: SpreadsheetDetailPageProps) {
  const router = useRouter()
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
      setResponse(loadedData as SpreadsheetResponse)
    }
  }, [loadedData, setResponse])

  // Tạo Google Sheets URL từ spreadsheetId để update history
  const originalUrl = useMemo(() => {
    // Tạo URL từ spreadsheetId
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  }, [spreadsheetId])

  // Cập nhật history với title khi load data thành công
  useUpdateHistory(data ? originalUrl : null, data?.title || null)

  // Helper function to extract error message from error object
  const getErrorMessage = (error: any): string => {
    // For 403 auth errors and other axios errors with response data
    if (error?.response?.data?.message) {
      return error.response.data.message
    }

    // For regular errors thrown by axios interceptor
    if (error?.message) {
      return error.message
    }

    // Fallback message
    return "Không thể tải spreadsheet. Vui lòng kiểm tra lại ID."
  }

  useEffect(() => {
    if (error) {
      const errorMessage = getErrorMessage(error)
      customToast.error(errorMessage)
      // Không chuyển hướng tự động - để user tự quyết định
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
    const errorMessage = error
      ? getErrorMessage(error)
      : "Không thể tải spreadsheet"

    // Get error type based on the message or status code
    const getErrorType = (error: any): string => {
      if (error?.response?.status === 403) return "permission"
      if (error?.response?.status === 404) return "not-found"
      if (error?.message?.includes("Invalid spreadsheet ID"))
        return "invalid-id"
      return "general"
    }

    const errorType = error ? getErrorType(error) : "general"

    // Get appropriate icon for error type
    const getErrorIcon = () => {
      switch (errorType) {
        case "permission":
          return (
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636A9 9 0 005.636 18.364m12.728-12.728A9 9 0 015.636 18.364"
              />
            </svg>
          )
        case "not-found":
          return (
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
              />
            </svg>
          )
        case "invalid-id":
          return (
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          )
        default:
          return (
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          )
      }
    }

    return (
      <div className="relative flex flex-col w-full min-h-screen ocean-gradient">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-200/50 mb-6">
              {getErrorIcon()}
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-3">
              {errorType === "permission"
                ? "Quyền truy cập bị từ chối"
                : errorType === "not-found"
                ? "Không tìm thấy spreadsheet"
                : errorType === "invalid-id"
                ? "ID không hợp lệ"
                : "Không thể tải spreadsheet"}
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {errorMessage}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Thử lại
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Về trang chủ
              </button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <p>
                Cần hỗ trợ? Liên hệ{" "}
                <span className="font-medium text-slate-700">
                  hawk01525@gmail.com
                </span>
              </p>
            </div>
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
