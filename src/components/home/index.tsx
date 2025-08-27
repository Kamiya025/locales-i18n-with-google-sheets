// app/page.tsx
"use client"

import GetLinkGoogleSheets from "../form"
import SubtleAuthButton from "../auth/SubtleAuthButton"

export default function HomePage() {
  return (
    <div className="relative flex flex-col w-full min-h-screen ocean-gradient">
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
            <GetLinkGoogleSheets isHeader={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
