import { useSyncSheetSaveRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useEffect, useState, useRef } from "react"
import { customToast } from "@/components/ui/toast"
import Card from "../ui/card"
import Button from "../ui/button"
import LanguageInputRow from "../ui/language-input-row"

export function RowItemViewer(
  props: Readonly<{ row: SheetRowData; sheetId: number }>,
) {
  const { row, sheetId } = props
  const { data, selectedLocales } = useSpreadsheet()
  const { updateTranslation } = useSpreadsheet()
  const [state, setState] = useState(row)

  const mutationSaveRow = useSyncSheetSaveRow(() => {
    updateTranslation(sheetId, state)
    customToast.success(`Đã cập nhật: ${row.key}`)
  })

  useEffect(() => {
    setState(row)
  }, [row])

  return (
    <div className="group relative pt-4" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
      {/* Key Token Badge */}
      <div 
        className="absolute top-0 left-6 z-10 px-4 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 cursor-copy flex items-center gap-2 group-hover:-translate-y-1 transition-transform"
        onClick={() => {
          navigator.clipboard.writeText(row.key)
          customToast.success("Đã copy mã từ khoá!")
        }}
        title="Click để copy mã này"
      >
        <span className="opacity-60">KEY:</span> {row.key}
        <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      </div>

      <div className="p-8 pt-10 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:bg-blue-50/50 transition-colors" />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (JSON.stringify(row.data) !== JSON.stringify(state.data) && data) {
              mutationSaveRow.mutate({ spreadsheetId: data.id, row: state, sheetId })
            }
          }}

          className="space-y-6"
        >
          <div className="flex flex-col gap-5">
            {selectedLocales.map((lang, index) => {
              const referenceValue = index !== 0 ? state.data[selectedLocales[0]] : undefined
              return (
                <LanguageInputRow
                  key={lang}
                  language={lang}
                  value={state.data[lang] || ""}
                  referenceValue={referenceValue}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      data: { ...prev.data, [lang]: value },
                    }))
                  }
                  variant="simple"
                />
              )
            })}
          </div>

          <div className="flex justify-end pt-2">
            {JSON.stringify(row.data) !== JSON.stringify(state.data) && (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Cập nhật
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

