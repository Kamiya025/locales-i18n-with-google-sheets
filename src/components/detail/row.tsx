import { useSyncSheetSaveRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useEffect, useState } from "react"
import Card from "../ui/card"
import Button from "../ui/button"
import LanguageInputRow from "../ui/language-input-row"

export function RowItemViewer(
  props: Readonly<{ row: SheetRowData; sheetId: number }>
) {
  const { row, sheetId } = props
  const { data, selectedLocales } = useSpreadsheet()
  const { updateTranslation } = useSpreadsheet()
  const [state, setState] = useState(row)
  const mutationSaveRow = useSyncSheetSaveRow(() => {
    updateTranslation(sheetId, state)
  })
  useEffect(() => {
    setState(row)
  }, [row])

  return (
    <Card variant="glass" size="lg" hover className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (JSON.stringify(row.data) !== JSON.stringify(state.data) && data) {
            mutationSaveRow.mutate({
              spreadsheetId: data.id,
              row: state,
              sheetId,
            })
          }
        }}
      >
        <div className="absolute -top-3 left-4 glass-effect px-4 py-2 rounded-xl font-bold text-lg text-slate-700 border border-white/40 backdrop-blur-sm">
          {row.key}
        </div>
        <div className="flex flex-col gap-4 pt-6">
          {selectedLocales.map((lang) => (
            <LanguageInputRow
              key={lang}
              language={lang}
              value={state.data[lang] || ""}
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
          ))}
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
