"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { customToast } from "@/components/ui/toast"

interface FormatValidationError extends Error {
  suggestion?: string
  type?: string
}

interface ValidationResult {
  isValid: boolean
  spreadsheet?: SpreadsheetResponse
  validationIssues: Array<{
    sheetTitle: string
    errors: string[]
    fixes: Array<{
      type:
        | "missing_key"
        | "duplicate_keys"
        | "empty_keys"
        | "no_languages"
        | "no_headers"
      title: string
      description: string
      action: string
    }>
  }>
}

export const useFetchSheet = (
  onSuccess: (data: SpreadsheetResponse, url: string) => void,
  onValidationIssues?: (
    validationResult: ValidationResult,
    url: string
  ) => void,
  onError?: (error: any) => boolean, // Return true if error was handled
  options?: { aggressive?: boolean }
) => {
  const mutation = useMutation<
    SpreadsheetResponse, // Kiểu dữ liệu trả về
    FormatValidationError | AxiosError<{ message: string }>, // Kiểu lỗi API
    string // Biến truyền vào (sheetId)
  >({
    mutationFn: async (sheetUrl: string) => {
      try {
        // Extract spreadsheet ID
        const match = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
        const spreadsheetId = match?.[1]

        // For aggressive loading, use direct API call
        if (options?.aggressive && spreadsheetId) {
          customToast.loading("🚀 Loading với aggressive mode!")
          const result = await sheetApi.getAll(spreadsheetId, {
            aggressive: true,
          })
          return result
        }

        // OPTIMIZED: Chỉ gọi validate một lần - nó đã bao gồm cả data lẫn validation
        const validation = await sheetApi.validateSheet(sheetUrl)

        if (validation.isValid && validation.spreadsheet) {
          // Valid data - trả về luôn, không cần gọi getAll thêm lần nữa
          return validation.spreadsheet
        } else {
          // Invalid - show auto-fix dialog nếu có
          if (validation.validationIssues.length > 0 && onValidationIssues) {
            onValidationIssues(validation, sheetUrl)
          }

          // Tạo error message từ validation issues
          const errorMessages = validation.validationIssues
            .flatMap((issue) => issue.errors)
            .join("\n")

          throw new Error(`Format validation failed:\n${errorMessages}`)
        }
      } catch (error: any) {
        // Handle auth errors
        if (onError) {
          const handled = onError(error)
          if (handled) {
            throw error
          }
        }

        // Handle quota errors với thông báo hữu ích
        if (
          error.response?.status === 429 ||
          error.message?.includes("quota")
        ) {
          customToast.error(
            `🚫 Đã vượt quá giới hạn Google API!\n\n` +
              `⏰ Vui lòng chờ 1-2 phút trước khi thử lại.\n\n` +
              `💡 Tip: Server đã tự động retry, bạn chỉ cần chờ một chút.`
          )
        } else if (error.name === "FormatValidationError" && error.suggestion) {
          customToast.error(
            `❌ Sai format Google Sheets!\n\n${error.message}\n\n💡 ${error.suggestion}`
          )
        } else {
          customToast.error(error.message ?? "Có lỗi xảy ra")
        }
        throw error
      }
    },
    onSuccess: (data, sheetUrl) => {
      customToast.success("Lấy dữ liệu thành công!")
      onSuccess(data, sheetUrl)
    },
    onError: () => {
      // Error handling completed in mutationFn
    },
  })

  return mutation
}
