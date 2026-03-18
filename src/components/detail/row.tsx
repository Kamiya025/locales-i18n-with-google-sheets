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
  const isTyping = useRef(false)
  const debounceTimerInfo = useRef<NodeJS.Timeout>(null)

  const mutationSaveRow = useSyncSheetSaveRow(() => {
    updateTranslation(sheetId, state)
  })

  // Mechanism debounce auto-save effect
  useEffect(() => {
    if (JSON.stringify(row.data) === JSON.stringify(state.data)) return

    // Clear previous timer
    if (debounceTimerInfo.current) {
      clearTimeout(debounceTimerInfo.current)
    }

    // Set new timer
    debounceTimerInfo.current = setTimeout(() => {
      if (data) {
        mutationSaveRow.mutate({
          spreadsheetId: data.id,
          row: state,
          sheetId,
        })
        customToast.success(`Đã lưu tự động: ${row.key}`)
      }
    }, 1500) // 1.5 seconds delay after typing

    return () => {
      if (debounceTimerInfo.current) {
        clearTimeout(debounceTimerInfo.current)
      }
    }
  }, [state.data, data, row.data, row.key, sheetId, mutationSaveRow])
  useEffect(() => {
    setState(row)
  }, [row])

  return (
    <Card variant="glass" size="lg" hover className="relative shadow-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (debounceTimerInfo.current) clearTimeout(debounceTimerInfo.current) // prevent double save
          if (JSON.stringify(row.data) !== JSON.stringify(state.data) && data) {
            mutationSaveRow.mutate({
              spreadsheetId: data.id,
              row: state,
              sheetId,
            })
          }
        }}
      >
        <div
          className="absolute -top-3 left-4 glass-effect px-4 py-2 rounded-xl font-bold text-lg text-slate-700 border border-white/40 backdrop-blur-sm cursor-copy group flex items-center gap-2 hover:bg-white/80 transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(row.key)
            customToast.success("Đã copy mã từ khoá!")
          }}
          title="Click để copy mã này vào bộ nhớ tạm"
        >
          {row.key}
          <svg
            className="w-4 h-4 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-4 pt-6">
          {selectedLocales.map((lang, index) => {
            const isFirst = index === 0
            const referenceValue = !isFirst ? state.data[selectedLocales[0]] : undefined

            return (
              <LanguageInputRow
                key={lang}
                language={lang}
                value={state.data[lang] || ""}
                referenceValue={referenceValue}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      [lang]: value,
                    },
                  }))
                }
                variant="glass"
              />
            )
          })}
        </div>
        <div className="flex justify-end pt-6">
          {JSON.stringify(row.data) !== JSON.stringify(state.data) && (
            <Button
              type="submit"
              variant="gradient"
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
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
            >
              Cập nhật
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
