"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { customToast } from "@/components/ui/toast"

export const useAutoFix = (onSuccess: (data: SpreadsheetResponse) => void) => {
  return useMutation<
    SpreadsheetResponse,
    AxiosError<{ message: string; error?: string }>,
    { spreadsheetId: string; sheetTitle: string; fixType: string }
  >({
    mutationFn: async ({ spreadsheetId, sheetTitle, fixType }) => {
      return customToast.promise(
        sheetApi.autoFix(spreadsheetId, sheetTitle, fixType),
        {
          loading: `Đang sửa lỗi "${fixType}"...`,
          success: `Đã sửa thành công!`,
          error: (err) =>
            (err as AxiosError<{ message: string; error?: string }>).response
              ?.data?.error ??
            (err as AxiosError<{ message: string; error?: string }>).response
              ?.data?.message ??
            "Có lỗi xảy ra khi sửa format",
        }
      )
    },
    onSuccess,
  })
}

export const useValidateSheet = () => {
  return useMutation<
    {
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
    },
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (sheetUrl: string) => {
      return sheetApi.validateSheet(sheetUrl)
    },
  })
}
