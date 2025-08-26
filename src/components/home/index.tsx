// app/page.tsx
"use client"

import { useSpreadsheet } from "@/providers/preadsheetProvider"
import SpreadsheetViewer from "../detail"
import GetLinkGoogleSheets from "../form"
import SubtleAuthButton from "../auth/SubtleAuthButton"
import Header from "../ui/header"

export default function HomePage() {
  const { data: response } = useSpreadsheet()
  const isHeader = Boolean(response)

  return (
    <div className="relative flex flex-col w-full min-h-screen ocean-gradient">
      {isHeader ? (
        // Header Mode Layout (when data is loaded)
        <>
          {/* Enhanced Header Component */}
          <Header isHeader={isHeader} />

          {/* Main Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <SpreadsheetViewer />
          </div>
        </>
      ) : (
        // Landing Page Layout (no data)
        <>
          {/* Subtle Auth Button - Fixed Top Right */}
          <div className="fixed top-4 right-4 z-50">
            <SubtleAuthButton />
          </div>

          {/* Centered Landing Section */}
          <div className="flex-1 min-h-screen flex items-center justify-center px-4">
            <div className="min-h-80 flex flex-col items-center justify-between md:justify-center glass-blue ocean-shadow-lg rounded-3xl p-12 w-full max-w-2xl backdrop-blur-md border border-blue-200/30">
              <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center drop-shadow-sm">
                🌊 Quản lý Bản dịch Google Sheets
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
