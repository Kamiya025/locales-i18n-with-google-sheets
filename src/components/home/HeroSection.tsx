"use client"

import React from "react"

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 pt-24 text-center">
      <div
        className="mb-3 space-y-4"
        style={{ animation: "fadeUp .5s .08s ease both" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
          <div className="w-5 h-5 rounded-md bg-white p-0.5 shadow-sm">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          Translator Tool
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
          Quản lý{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Bản Dịch
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 opacity-60" />
          </span>
        </h1>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mt-1">
          chưa bao giờ dễ hơn
        </h2>
      </div>
      <p
        className="max-w-md mx-auto text-slate-500 text-sm md:text-base font-medium mb-10 leading-relaxed"
        style={{ animation: "fadeUp .5s .16s ease both" }}
      >
        Chọn nguồn dữ liệu phù hợp với quy trình làm việc của bạn
      </p>
    </div>
  )
}
