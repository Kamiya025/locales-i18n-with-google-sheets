import { useSyncSheetSaveRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useEffect, useState } from "react"
import { text } from "stream/consumers"

export function RowItemViewer(props: { row: SheetRowData; sheetId: number }) {
  const { row, sheetId } = props
  const { data, listLocales } = useSpreadsheet()
  const { updateTranslation } = useSpreadsheet()
  const [state, setState] = useState(row)
  const mutationSaveRow = useSyncSheetSaveRow(() => {
    updateTranslation(sheetId, state)
  })
  useEffect(() => {
    setState(row)
  }, [row])

  return (
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
      className="relative px-3 py-5 rounded-xl border bg-white transition"
    >
      <p className="absolute -top-4 left-2 bg-white px-2 py-1 font-medium text-xl text-gray-800 mb-2">
        {row.key}
      </p>
      <div className="flex flex-col gap-3 pt-5">
        {listLocales.map((lang) => {
          const text = state.data[lang] || ""
          return (
            <div
              key={lang}
              className="flex rounded-lg bg-white text-sm text-gray-700 border"
            >
              <div className="w-24 px-4 py-3 flex justify-center items-center text-center rounded-l-lg bg-blue-800 font-semibold uppercase text-white">
                {lang}
              </div>
              <div className="flex-1">
                <input
                  placeholder="Nhập bản dịch..."
                  className={`flex-1 w-full h-full border-0 rounded-r-lg outline-none px-4 py-3  ${
                    !text ? "bg-orange-100 text-gray-500" : "bg-white"
                  } text-gray-800"bg-white text-gray-800`}
                  value={text}
                  onChange={(e) =>
                    setState(
                      (prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [lang]: e.target.value,
                        },
                      }) // cập nhật giá trị theo lang
                    )
                  }
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end pt-4">
        {JSON.stringify(row.data) !== JSON.stringify(state.data) && (
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Cập nhật
          </button>
        )}
      </div>
    </form>
  )
}
