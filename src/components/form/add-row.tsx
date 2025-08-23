import { useSyncSheetAddNewRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData, SpreadsheetResponse } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"

export function RowNewItemViewer(props: {
  sheetId: number
  lastIndexRow: number
  onSaveSuccess?: (data: SpreadsheetResponse) => void
}) {
  const { sheetId, lastIndexRow, onSaveSuccess } = props
  const { data, listLocales, updateTranslation } = useSpreadsheet()
  const initialData = toKeyObject(listLocales)

  const [state, setState] = useState<SheetRowData>({
    rowNumber: lastIndexRow + 1,
    key: "",
    data: initialData,
  })

  const mutationSaveRow = useSyncSheetAddNewRow((data) => {
    if (state) updateTranslation(sheetId, state)
    onSaveSuccess?.(data)
    // reset lại sau khi lưu
    setState({ rowNumber: lastIndexRow + 1, key: "", data: initialData })
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (state && data && state.key.trim()) {
          mutationSaveRow.mutate({
            spreadsheetId: data.id,
            row: state,
            sheetId,
          })
        }
      }}
      className="relative px-3 py-5 rounded-xl border bg-white transition"
    >
      {/* ô nhập key */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nhập từ khóa (vd: home.title)"
          value={state?.key}
          onChange={(e) =>
            setState((prev) => {
              return {
                ...prev,
                key: e.target.value,
              }
            })
          }
          className="w-full rounded-lg border px-4 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* các bản dịch theo ngôn ngữ */}
      <div className="flex flex-col gap-3 pt-2">
        {listLocales.map((lang) => (
          <div
            key={lang}
            className="flex rounded-lg bg-white text-sm text-gray-700 border group group-focus:border-blue-500 focus:border-blue-500"
          >
            <div className="w-24 px-4 py-3 flex justify-center items-center text-center rounded-l-lg bg-blue-800 font-semibold uppercase text-white">
              {lang}
            </div>
            <div className="flex-1">
              <input
                placeholder={`Nhập bản dịch (${lang})...`}
                value={state.data[lang] || ""}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      [lang]: e.target.value,
                    },
                  }))
                }
                className="flex-1 w-full h-full border-0 rounded-r-lg outline-none px-4 py-3 bg-white text-gray-800"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        {state.key && (
          <button
            type="submit"
            disabled={mutationSaveRow.isPending}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {mutationSaveRow.isPending ? "Đang lưu..." : "Lưu"}
          </button>
        )}
      </div>
    </form>
  )
}
function toKeyObject(keys: string[]): { [key: string]: string } {
  return keys.reduce((acc, key) => {
    acc[key] = ""
    return acc
  }, {} as { [key: string]: string })
}
