"use client"

import React from "react"
import JsonToExcelPanel from "./JsonToExcelPanel"

export default function JsonToExcelCard() {
  return (
    <div className="relative flex flex-col gap-5 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_24px_48px_rgba(139,92,246,0.08),0_0_0_1px_rgba(255,255,255,0.5)] p-7 overflow-hidden">
      {/* Top shine */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      {/* Violet accent blob */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">
                Chuyển JSON → Excel
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold border border-violet-200/60">
                Công cụ
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Gộp nhiều file i18n JSON thành 1 file XLSX duy nhất
            </p>
          </div>
        </div>

        {/* Feature tags - show on larger screens inline */}
        <div className="sm:ml-auto flex flex-wrap gap-2 text-xs">
          {["vi.json", "en.json", "→", "translations.xlsx"].map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 rounded-lg font-mono font-semibold ${
                tag === "→"
                  ? "text-slate-400 px-0"
                  : tag.endsWith(".xlsx")
                    ? "bg-violet-100 text-violet-700 border border-violet-200/60"
                    : "bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />

      {/* Panel content */}
      <JsonToExcelPanel />
    </div>
  )
}
