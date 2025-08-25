import { useSyncSheetAddNewRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData, SpreadsheetResponse } from "@/models"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState, useEffect } from "react"
import Card from "../ui/card"
import Button from "../ui/button"
import Input from "../ui/input"
import LanguageInputRow from "../ui/language-input-row"
import FieldWrapper from "../ui/field"
import Tooltip from "../ui/tooltip"

interface ValidationError {
  field: string
  message: string
}

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

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )

  // Validation functions
  const validateKey = (key: string): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!key.trim()) {
      errors.push({ field: "key", message: "Key không được để trống" })
    } else {
      // Kiểm tra key trùng lặp
      if (data) {
        const existingKeys =
          data.sheets
            .find((sheet) => sheet.sheetId === sheetId)
            ?.rows.map((row) => row.key) || []

        if (existingKeys.includes(key.trim())) {
          errors.push({
            field: "key",
            message: "Key này đã tồn tại trong sheet",
          })
        }
      }
    }

    return errors
  }

  const validateTranslations = (translations: {
    [key: string]: string
  }): ValidationError[] => {
    const errors: ValidationError[] = []

    // Kiểm tra ít nhất phải có một bản dịch không rỗng
    const hasNonEmptyTranslation = Object.values(translations).some((value) =>
      value.trim()
    )
    if (!hasNonEmptyTranslation) {
      errors.push({
        field: "translations",
        message: "Phải có ít nhất một bản dịch không rỗng",
      })
    }

    return errors
  }

  const validateForm = (): boolean => {
    const keyErrors = validateKey(state.key)
    const translationErrors = validateTranslations(state.data)

    const allErrors = [...keyErrors, ...translationErrors]
    setValidationErrors(allErrors)

    return allErrors.length === 0
  }

  const mutationSaveRow = useSyncSheetAddNewRow((data) => {
    if (state) updateTranslation(sheetId, state)
    onSaveSuccess?.(data)
    // reset lại sau khi lưu
    setState({
      rowNumber: lastIndexRow + 1,
      key: "",
      data: toKeyObject(selectedLocales),
    })
    setValidationErrors([])
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
          if (validateForm() && state && data) {
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
          <FieldWrapper
            label={
              <div className="flex items-center gap-2">
                <span>Từ khóa</span>
                <Tooltip
                  content={
                    <div className="space-y-1">
                      <div className="font-medium">
                        Quy tắc đặt tên từ khóa:
                      </div>
                      <div>• Sử dụng dấu chấm (.) để phân cấp</div>
                      <div>• Ví dụ: home.title, button.save</div>
                      <div>• Không được trùng lặp</div>
                    </div>
                  }
                  placement="top"
                  trigger="click"
                >
                  <svg
                    className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
              </div>
            }
            description="Nhập key để định danh bản dịch (vd: home.title, button.save)"
            error={validationErrors
              .filter((err) => err.field === "key")
              .map((err) => err.message)}
            required
          >
            <Input
              type="text"
              placeholder="Nhập từ khóa (vd: home.title)"
              value={state?.key}
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  key: e.target.value,
                }))
                // Clear validation errors when user types
                if (validationErrors.some((err) => err.field === "key")) {
                  setValidationErrors((prev) =>
                    prev.filter((err) => err.field !== "key")
                  )
                }
              }}
              variant="outline"
              className={
                validationErrors.some((err) => err.field === "key")
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }
            />
          </FieldWrapper>
        </div>

        {/* các bản dịch theo ngôn ngữ */}
        <FieldWrapper
          label={
            <div className="flex items-center gap-2">
              <span>Bản dịch</span>
              <Tooltip
                content={
                  <div className="space-y-1">
                    <div className="font-medium">Tips bản dịch:</div>
                    <div>• Phải có ít nhất 1 bản dịch</div>
                    <div>• Giữ ý nghĩa nhất quán</div>
                    <div>• Tránh dịch quá dài</div>
                    <div>• Kiểm tra ngữ cảnh sử dụng</div>
                  </div>
                }
                placement="top"
                trigger="click"
              >
                <svg
                  className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Tooltip>
            </div>
          }
          description="Nhập bản dịch cho từng ngôn ngữ. Ít nhất phải có một bản dịch không trống."
          error={validationErrors
            .filter((err) => err.field === "translations")
            .map((err) => err.message)}
          className="pt-2"
        >
          <div className="flex flex-col gap-3">
            {selectedLocales.map((lang) => (
              <LanguageInputRow
                key={lang}
                language={lang}
                value={state.data[lang] || ""}
                onChange={(value) => {
                  setState((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      [lang]: value,
                    },
                  }))
                  // Clear translation validation errors when user types
                  if (
                    validationErrors.some((err) => err.field === "translations")
                  ) {
                    setValidationErrors((prev) =>
                      prev.filter((err) => err.field !== "translations")
                    )
                  }
                }}
                variant="default"
              />
            ))}
          </div>
        </FieldWrapper>

        <div className="flex justify-end pt-6">
          {(state.key.trim() ||
            Object.values(state.data).some((v) => v.trim())) && (
            <Button
              type="submit"
              disabled={
                mutationSaveRow.isPending ||
                validationErrors.length > 0 ||
                !state.key.trim()
              }
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
