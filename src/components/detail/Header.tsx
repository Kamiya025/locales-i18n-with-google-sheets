import Button from "../ui/button"
import Link from "next/link"
import { SpreadsheetResponse } from "@/models"
import { useTranslation } from "@/providers/I18nProvider"

interface DetailHeaderProps {
  data: SpreadsheetResponse
  onOpenAiConfig: () => void
  onOpenAddSheet: () => void
  onOpenExport: () => void
}

export function DetailHeader({
  data,
  onOpenAiConfig,
  onOpenAddSheet,
  onOpenExport,
}: DetailHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 md:px-8 flex flex-col md:flex-row gap-2 items-center justify-between z-30">
      <div className="w-full p-2 md:p-0 space-y-4 py-4 md:py-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Link
            href="/profile"
            className="hover:text-blue-600 transition-colors"
          >
            {t("detail.header.myProjects")}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-slate-600">
            {t("detail.header.sheetDetail")}
          </span>
        </div>
        <div className="flex-1 text-2xl font-black text-slate-800 flex items-center gap-3">
          <Link
            href={
              data.id
                ? `https://docs.google.com/spreadsheets/d/${data.id}`
                : "#"
            }
            target="_blank"
            className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Link>
          <p className="!truncate">{data.title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <Button
          onClick={onOpenAiConfig}
          variant="outline"
          size="sm"
          className="!p-2.5 rounded-xl border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600 shadow-sm"
        >
          <svg
            className="w-5 h-5 font-bold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </Button>

        <Button
          onClick={onOpenAddSheet}
          variant="outline"
          size="sm"
          className="!px-4 !py-2.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase shadow-sm"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          {t("detail.header.addCategory")}
        </Button>
        <Button
          onClick={onOpenExport}
          variant="primary"
          size="sm"
          className="!px-6 !py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase shadow-lg shadow-slate-200"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          }
        >
          <span className="hidden xl:block">
            {t("detail.header.exportJson").split(" ")[0]}
          </span>
        </Button>
      </div>
    </div>
  )
}
