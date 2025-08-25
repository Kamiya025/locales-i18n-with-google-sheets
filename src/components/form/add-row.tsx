import { useSyncSheetAddNewRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData, SpreadsheetResponse } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState, useEffect } from "react"
import Card from "../ui/card"
import Button from "../ui/button"
import Input from "../ui/input"
import LanguageInputRow from "../ui/language-input-row"

export function RowNewItemViewer(
  props: Readonly<{
    sheetId: number
    lastIndexRow: number
    onSaveSuccess?: (data: SpreadsheetResponse) => void
  }>
) {
  const { sheetId, lastIndexRow, onSaveSuccess } = props
  const { data, selectedLocales, updateTranslation } = useSpreadsheet()
  const initialData = toKeyObject(selectedLocales)

  const [state, setState] = useState<SheetRowData>({
    rowNumber: lastIndexRow + 1,
    key: "",
    data: initialData,
  })

  const mutationSaveRow = useSyncSheetAddNewRow((data) => {
    if (state) updateTranslation(sheetId, state)
    onSaveSuccess?.(data)
    // reset lại sau khi lưu
    setState({
      rowNumber: lastIndexRow + 1,
      key: "",
      data: toKeyObject(selectedLocales),
    })
  })

  // Cập nhật state khi selectedLocales thay đổi
  useEffect(() => {
    const newInitialData = toKeyObject(selectedLocales)
    setState((prev) => ({
      ...prev,
      data: {
        ...newInitialData,
        // Giữ lại data đã nhập cho các ngôn ngữ vẫn còn được chọn
        ...Object.keys(prev.data).reduce((acc, lang) => {
          if (selectedLocales.includes(lang)) {
            acc[lang] = prev.data[lang]
          }
          return acc
        }, {} as { [key: string]: string }),
      },
    }))
  }, [selectedLocales])

  return (
    <Card className="relative">
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
      >
        {/* ô nhập key */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Nhập từ khóa (vd: home.title)"
            value={state?.key}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                key: e.target.value,
              }))
            }
            variant="outline"
          />
        </div>

        {/* các bản dịch theo ngôn ngữ */}
        <div className="flex flex-col gap-3 pt-2">
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
              variant="default"
            />
          ))}
        </div>

        <div className="flex justify-end pt-6">
          {state.key && (
            <Button
              type="submit"
              disabled={mutationSaveRow.isPending}
              loading={mutationSaveRow.isPending}
              variant="gradient"
              icon={
                !mutationSaveRow.isPending && (
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                )
              }
            >
              {mutationSaveRow.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
function toKeyObject(keys: string[]): { [key: string]: string } {
  return keys.reduce((acc, key) => {
    acc[key] = ""
    return acc
  }, {} as { [key: string]: string })
}
