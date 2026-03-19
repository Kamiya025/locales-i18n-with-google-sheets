"use client"

import Link from "next/link"
import { CloudProject } from "@/hooks/useCloudHistory"
import { useTranslation } from "@/providers/I18nProvider"

interface ProjectCardProps {
  proj: CloudProject
  index: number
  viewMode?: "grid" | "list"
}

export default function ProjectCard({ proj, index, viewMode = "grid" }: ProjectCardProps) {
  const { t, locale } = useTranslation()

  if (viewMode === "list") {
    return (
      <Link
        href={`/sheet/${proj.spreadsheetId}`}
        className="group relative flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
        style={{ animation: `fadeUp 0.5s ${0.1 + index * 0.03}s ease both` }}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors uppercase">
              {proj.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono truncate">
                ID: {proj.spreadsheetId.slice(0, 10)}...
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              {t("detail.profile.lastAccessed") || "Last Accessed"}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {new Date(proj.lastAccessedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/sheet/${proj.spreadsheetId}`}
      className="group relative flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
      style={{ animation: `fadeUp 0.5s ${0.2 + index * 0.05}s ease both` }}
    >
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <h4 className="text-base font-bold text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors uppercase">
            {proj.title}
          </h4>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">
              Spreadsheet
            </span>
            <span className="text-slate-400 text-[10px] font-mono opacity-60">
              ID: {proj.spreadsheetId.slice(0, 15)}...
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-0 pt-3 md:pt-0 border-slate-100">
        <div className="flex flex-col md:items-end">
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">
            {t("detail.profile.lastAccessed") || "Last Accessed"}
          </span>
          <span className="text-xs font-bold text-slate-600">
            {new Date(proj.lastAccessedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}
