"use client"

import GetLinkGoogleSheets from "@/components/form"
import SubtleAuthButton from "@/components/auth/SubtleAuthButton"
import { Tooltip } from "@/components/ui/tooltip"

interface HeaderProps {
  isHeader: boolean
}

export default function Header({ isHeader }: HeaderProps) {
  return (
    <div className="fixed top-0 z-[999] w-full">
      <div className="w-full bg-gradient-to-r from-white/95 via-slate-50/90 to-blue-50/95 backdrop-blur-xl border-b border-blue-200/40 relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-blue-100/20 pointer-events-none"></div>

        {/* Main header content */}
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Left section - Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-300/30 hover:scale-105 transition-transform duration-300">
                <span className="text-xl">🌊</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-slate-800 drop-shadow-sm">
                  Translation Manager
                </h1>
                <p className="text-xs text-slate-600">
                  Quản lý bản dịch Google Sheets
                </p>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-6 overflow-visible">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <GetLinkGoogleSheets isHeader={isHeader} />
              </div>
            </div>
          </div>

          {/* Right section - Essential Actions Only */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Auth Button - chức năng chính */}
            <SubtleAuthButton />
          </div>
        </div>

        {/* Bottom border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>

        {/* Floating effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent blur-sm"></div>
      </div>
    </div>
  )
}
