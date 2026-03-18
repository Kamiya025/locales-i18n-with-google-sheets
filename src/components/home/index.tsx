"use client"

import Header from "../ui/header"

import AnimatedBackground from "./AnimatedBackground"
import HeroSection from "./HeroSection"
import GoogleSheetsCard from "./GoogleSheetsCard"
import ExcelCard from "./ExcelCard"
import JsonToExcelCard from "./JsonToExcelCard"
import DocxCard from "./DocxCard"

export default function HomePage() {
  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-hidden">
      {/* =========== ANIMATED BACKGROUND =========== */}
      <AnimatedBackground />

      {/* =========== HEADER =========== */}
      <Header />

      {/* =========== MAIN CONTENT =========== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-24">
        {/* HERO SECTION */}
        <HeroSection />

        {/* SERVICE CARDS GRID */}
        <div className="w-full max-w-4xl space-y-5">
          {/* Row 1: Google Sheets (Full Width) */}
          <div style={{ animation: "fadeUp .5s .24s ease both" }}>
            <GoogleSheetsCard />
          </div>

          {/* Row 2: Excel & JSON to Excel (2 Columns) */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            style={{ animation: "fadeUp .5s .36s ease both" }}
          >
            <ExcelCard />
            <JsonToExcelCard />
          </div>

          {/* Row 3: DOCX Translation (Full Width) */}
          <div style={{ animation: "fadeUp .5s .48s ease both" }}>
            <DocxCard />
          </div>
        </div>
      </main>
    </div>
  )
}
