"use client"

import React from "react"
import GoogleSheetsPanel from "./GoogleSheetsPanel"

export default function GoogleSheetsCard() {
  return (
    <div className="relative flex flex-col gap-5 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_24px_48px_rgba(59,130,246,0.12),0_0_0_1px_rgba(255,255,255,0.5)] p-7 overflow-hidden">
      {/* Top shine */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      {/* Blue accent blob inside */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 10h18M3 14h18M10 3v18M14 3v18M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3z"
            />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Google Sheets</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200/60">
              Online
            </span>
          </div>
          <p className="text-sm text-slate-500">Đồng bộ real-time với cloud</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

      {/* Features */}
      <ul className="flex flex-col gap-2">
        {[
          "Kết nối trực tiếp qua URL",
          "Lưu & đồng bộ tự động",
          "Hỗ trợ chia sẻ nhiều người",
          "Đăng nhập Google để chỉnh sửa",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-2.5 h-2.5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {t}
          </li>
        ))}
      </ul>

      {/* Form */}
      <GoogleSheetsPanel />
    </div>
  )
}
