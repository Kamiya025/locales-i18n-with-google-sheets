// app/page.tsx
"use client"

import SubtleAuthButton from "../auth/SubtleAuthButton"
import GoogleSheetsPanel from "./GoogleSheetsPanel"
import ExcelPanel from "./ExcelPanel"
import JsonToExcelPanel from "./JsonToExcelPanel"

export default function HomePage() {
  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-hidden">
      {/* =========== ANIMATED BACKGROUND =========== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-100/70" />
        <div
          className="absolute top-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-300/25 to-cyan-400/15 blur-[120px]"
          style={{ animation: "drift 14s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300/25 to-violet-400/15 blur-[100px]"
          style={{ animation: "drift 18s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-[50%] left-[55%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-300/15 blur-[80px]"
          style={{ animation: "drift 11s ease-in-out infinite 2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(90deg,#3b82f6 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =========== FIXED AUTH =========== */}
      <div className="fixed top-4 right-4 z-50">
        <SubtleAuthButton />
      </div>

      {/* =========== HERO =========== */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Headline */}
        <div
          className="text-center mb-3 space-y-4"
          style={{ animation: "fadeUp .5s .08s ease both" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
            <div className="w-5 h-5 rounded-md bg-white p-0.5 shadow-sm">
               <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            Translator Tool
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Quản lý{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Bản Dịch
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 opacity-60" />
            </span>
          </h1>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mt-1">
            chưa bao giờ dễ hơn
          </h2>
        </div>

        <p
          className="max-w-md text-center text-slate-500 text-base font-medium mb-12 leading-relaxed"
          style={{ animation: "fadeUp .5s .16s ease both" }}
        >
          Chọn nguồn dữ liệu phù hợp với quy trình làm việc của bạn
        </p>

        {/* =========== 2-PANEL SPLIT =========== */}
        <div
          className="w-full max-w-4xl grid grid-cols-1 gap-5"
          style={{ animation: "fadeUp .5s .24s ease both" }}
        >
          {/* ---- Panel 1: Google Sheets ---- */}
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
                  <h3 className="text-lg font-bold text-slate-800">
                    Google Sheets
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200/60">
                    Online
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Đồng bộ real-time với cloud
                </p>
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
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
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
        </div>

        <div
          className="w-full max-w-4xl mt-2 grid grid-cols-1 md:grid-cols-2 gap-2"
          style={{ animation: "fadeUp .5s .36s ease both" }}
        >
          {/* ---- Panel 2: Excel Offline ---- */}
          <div className="relative flex flex-col gap-5 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_24px_48px_rgba(16,185,129,0.08),0_0_0_1px_rgba(255,255,255,0.5)] p-7 overflow-hidden">
            {/* Top shine */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            {/* Green accent blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    File Excel
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200/60">
                    Offline
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Xử lý trực tiếp trên máy tính
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

            {/* Features */}
            <ul className="flex flex-col gap-2">
              {[
                "Kéo thả file .xlsx / .xls",
                "Không cần đăng nhập",
                "Dữ liệu không gửi lên server",
                "Xuất JSON & Excel sau khi dịch",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-emerald-600"
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

            {/* Drop Zone */}
            <ExcelPanel />
          </div>
          {/* =========== 3RD PANEL: JSON → EXCEL =========== */}
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
        </div>
      </div>
    </div>
  )
}
