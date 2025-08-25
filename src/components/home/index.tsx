// app/page.tsx
"use client"

import { useSpreadsheet } from "@/providers/preadsheetProvider"
import SpreadsheetViewer from "../detail"
import GetLinkGoogleSheets from "../form"

export default function HomePage() {
  const { data: response } = useSpreadsheet()
  const isHeader = Boolean(response)

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isHeader ? (
        // Header Mode Layout (when data is loaded)
        <>
          {/* Sticky Header */}
          <div className="sticky top-0 z-[80]">
            <div className="w-full h-20 glass-effect soft-shadow flex items-center justify-between px-6 backdrop-blur-md border-b border-slate-200/20 relative overflow-visible">
              <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Translation Manager
              </h1>
              <div className="flex-1 max-w-md overflow-visible">
                <GetLinkGoogleSheets isHeader={isHeader} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <SpreadsheetViewer />
          </div>
        </>
      ) : (
        // Landing Page Layout (no data)
        <>
          {/* Centered Landing Section */}
          <div className="flex-1 min-h-screen flex items-center justify-center px-4">
            <div className="min-h-80 flex flex-col items-center justify-between md:justify-center glass-effect soft-shadow-lg rounded-3xl p-12 w-full max-w-2xl backdrop-blur-md border border-white/20">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
                Quản lý Bản dịch Google Sheets
              </h1>
              <div className="grow flex justify-center items-center w-full">
                <GetLinkGoogleSheets isHeader={isHeader} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
