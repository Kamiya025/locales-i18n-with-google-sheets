"use client"

import { useAddSheet } from "@/hooks/useAddSheet"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import Button from "../button"
import { Dialog } from "../dialog"
import Input from "../input"

interface AddSheetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddSheetModal({ isOpen, onClose }: AddSheetModalProps) {
  const [sheetTitle, setSheetTitle] = useState("")
  const [validationError, setValidationError] = useState("")
  const { data, setResponse } = useSpreadsheet()

  const addSheetMutation = useAddSheet(
    (updatedData) => {
      // Success callback
      setResponse(updatedData)
      setSheetTitle("")
      setValidationError("")
      onClose()
    },
    (errorMessage) => {
      // Error callback
      setValidationError(errorMessage)
    }
  )

  // Validation function
  const validateSheetTitle = (title: string): string => {
    const trimmed = title.trim()

    if (!trimmed) {
      return "Tên danh mục không được để trống"
    }

    if (trimmed.length < 2) {
      return "Tên danh mục phải có ít nhất 2 ký tự"
    }

    if (trimmed.length > 50) {
      return "Tên danh mục không được quá 50 ký tự"
    }

    // Check invalid characters for Google Sheets
    const invalidChars = /[[\]\\\/\?*:]/
    if (invalidChars.test(trimmed)) {
      return "Tên danh mục không được chứa ký tự đặc biệt: [ ] \\ / ? * :"
    }

    // Check if sheet title already exists
    if (
      data?.sheets?.some(
        (sheet) => sheet.title.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      return "Danh mục này đã tồn tại"
    }

    return ""
  }

  // Real-time validation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSheetTitle(value)

    // Clear error when typing
    if (validationError) {
      setValidationError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Pre-validation
    const error = validateSheetTitle(sheetTitle)
    if (error) {
      setValidationError(error)
      return
    }

    if (!data?.id) {
      setValidationError("Không có spreadsheet nào được tải")
      return
    }

    // Clear any previous errors
    setValidationError("")

    addSheetMutation.mutate({
      spreadsheetId: data.id,
      sheetTitle: sheetTitle.trim(),
    })
  }

  const handleClose = () => {
    if (!addSheetMutation.isPending) {
      setSheetTitle("")
      setValidationError("")
      onClose()
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo Danh Mục Mới"
      subtitle="Thêm sheet mới vào Google Spreadsheet"
      icon="📁"
      iconColor="blue"
      size="sm"
      showCloseButton={true}
    >
      <form id="add-sheet-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="sheet-title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Tên danh mục
            </label>
            <Input
              id="sheet-title"
              type="text"
              value={sheetTitle}
              onChange={handleTitleChange}
              placeholder="Ví dụ: Common, Navigation, Errors..."
              disabled={addSheetMutation.isPending}
              className={`w-full ${
                validationError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {validationError ? (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationError}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                Tên danh mục sẽ trở thành sheet mới trong Google Spreadsheet
              </p>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={addSheetMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={
              !sheetTitle.trim() ||
              addSheetMutation.isPending ||
              !!validationError
            }
            loading={addSheetMutation.isPending}
            icon={
              !addSheetMutation.isPending ? (
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              ) : undefined
            }
          >
            Tạo Danh Mục
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
