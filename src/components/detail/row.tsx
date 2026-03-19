import { SheetRowData } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useEffect, useState, memo } from "react"
import LanguageInputRow from "../ui/language-input-row"
import { useTranslation } from "@/providers/I18nProvider"
import { customToast } from "@/components/ui/toast"

export const RowItemViewer = memo(function RowItemViewer(
  props: Readonly<{ row: SheetRowData; sheetId: number }>,
) {
  const { row, sheetId } = props
  const { selectedLocales, updateTranslation } = useSpreadsheet()
  const { t } = useTranslation()
  const [state, setState] = useState(row)

  useEffect(() => {
    setState(row)
  }, [row])

  const handleChange = (lang: string, value: string) => {
    const newState = {
      ...state,
      data: { ...state.data, [lang]: value },
    }
    setState(newState)
    updateTranslation(sheetId, newState)
  }

  return (
    <div
      className="group relative pt-4 sm:pt-4"
      style={{ animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}
    >
      {/* Key Token Badge */}
      <div
        className="absolute max-w-full top-0 left-4 sm:left-6 z-10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-900 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 cursor-copy flex items-center gap-2 group-hover:-translate-y-1 transition-transform"
        onClick={() => {
          navigator.clipboard.writeText(row.key)
          customToast.success(t("detail.row.copySuccess"))
        }}
        title={t("detail.row.copyTip")}
      >
        <span className="opacity-60">KEY:</span>{" "}
        <span className="max-w-[120px] sm:max-w-none truncate">{row.key}</span>
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div className="p-4 pt-8 sm:p-8 sm:pt-10 rounded-2xl sm:rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 rounded-bl-[60px] sm:rounded-bl-[100px] -z-10 group-hover:bg-blue-50/50 transition-colors" />

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:gap-5">
            {selectedLocales.map((lang, index) => {
              const referenceValue =
                index !== 0 ? state.data[selectedLocales[0]] : undefined
              return (
                <LanguageInputRow
                  key={lang}
                  language={lang}
                  value={state.data[lang] || ""}
                  referenceValue={referenceValue}
                  onChange={(value) => handleChange(lang, value)}
                  variant="simple"
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
})
