"use client"

import React from "react"

export default function AnimatedBackground() {
  return (
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
  )
}
