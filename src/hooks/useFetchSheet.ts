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
  onError?: (error: any) => boolean // Return true if error was handled
) => {
  return useMutation<
    SpreadsheetResponse, // Kiểu dữ liệu trả về
    FormatValidationError | AxiosError<{ message: string }>, // Kiểu lỗi API
    string // Biến truyền vào (sheetId)
  >({
    mutationFn: async (sheetUrl: string) => {
      try {
        // First, validate the sheet
        const validation = await sheetApi.validateSheet(sheetUrl)

        if (validation.isValid && validation.spreadsheet) {
          // If valid, return the spreadsheet data directly
          return validation.spreadsheet
        } else {
          // If not valid, check if we have fixable issues
          if (validation.validationIssues.length > 0 && onValidationIssues) {
            // Call the validation issues handler to show auto-fix dialog
            onValidationIssues(validation, sheetUrl)
          }

          // Create a comprehensive error message
          const errorMessages = validation.validationIssues
            .flatMap((issue) => issue.errors)
            .join("\n")

          throw new Error(`Format validation failed:\n${errorMessages}`)
        }
      } catch (error: any) {
        // Check if onError handler can handle this error (for auth errors)
        if (onError) {
          const handled = onError(error)
          if (handled) {
            // Error was handled by onError callback (likely auth error)
            throw error
          }
        }

        // Handle format validation errors with detailed suggestions
        if (error.name === "FormatValidationError" && error.suggestion) {
          // Show detailed error with suggestion
          customToast.error(
            `❌ Sai format Google Sheets!\n\n${error.message}\n\n💡 ${error.suggestion}`
          )
        } else {
          // Regular error handling
          customToast.error(error.message ?? "Có lỗi xảy ra")
        }
        throw error
      }
    },
    onSuccess: (data, sheetUrl) => {
      customToast.success("Lấy dữ liệu thành công!")
      onSuccess(data, sheetUrl)
    },
  })
}
