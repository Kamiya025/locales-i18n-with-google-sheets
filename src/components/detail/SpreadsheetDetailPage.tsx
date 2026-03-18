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
    if (spreadsheetId === "local-excel") return null
    // Tạo URL từ spreadsheetId
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  }, [spreadsheetId])

  // Cập nhật history với title khi load data thành công, chỉ khi url hợp lệ
  useUpdateHistory(
    data && originalUrl ? originalUrl : null,
    data?.title || null,
  )

  // Helper function to extract error message from error object
  const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    if (error?.message) {
      return error.message
    }
    return "Không thể tải spreadsheet. Vui lòng kiểm tra lại ID."
  }

  useEffect(() => {
    if (error) {
      const errorMessage = getErrorMessage(error)
      customToast.error(errorMessage)
    }
  }, [error])

  if (isLoading) {
    return (
      <div className="relative flex flex-col w-full min-h-screen selection:bg-blue-500/20 bg-slate-50">
        <ImmersiveBackground />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
           <div className="relative">
             <div className="w-16 h-16 rounded-2xl border-4 border-slate-100 border-t-blue-600 animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
             </div>
           </div>
           <p className="mt-8 text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Đang tải bảng tính...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    const errorType = (error as any)?.response?.status === 403 ? "permission" : (error as any)?.response?.status === 404 ? "not-found" : "general"

    
    return (
      <div className="relative flex flex-col w-full min-h-screen selection:bg-blue-500/20 bg-slate-50">
        <ImmersiveBackground />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-10 rounded-[32px] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 text-center space-y-8" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-50 text-red-600 border border-red-100 shadow-inner">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Oops! Có lỗi xảy ra</h1>
              <p className="text-slate-500 font-medium leading-relaxed">{getErrorMessage(error)}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 active:scale-95 transition-all"
              >
                Thử lại ngay
              </button>
              <button 
                onClick={() => router.push("/")}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen selection:bg-blue-500/20 bg-slate-50 overflow-hidden">
      <ImmersiveBackground />
      <Header isHeader={true} />
      <div className="flex-1 min-h-0 pt-16 relative z-10 h-screen overflow-hidden">
        <SpreadsheetViewer />
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ImmersiveBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-[100%] bg-blue-50/60 blur-[100px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-[100%] bg-indigo-50/50 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
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
