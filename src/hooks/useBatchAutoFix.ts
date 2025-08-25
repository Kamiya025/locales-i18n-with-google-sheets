"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { customToast } from "@/components/ui/toast"

interface BatchAutoFixRequest {
  spreadsheetId: string
  fixes: Array<{ sheetTitle: string; fixType: string }>
}

interface BatchAutoFixResponse {
  success: boolean
  data: SpreadsheetResponse
  results: Array<{
    success: boolean
    fixType: string
    sheetTitle: string
    error?: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

export const useBatchAutoFix = (
  onSuccess: (data: SpreadsheetResponse, results: BatchAutoFixResponse) => void
) => {
  return useMutation<
    BatchAutoFixResponse,
    AxiosError<{ message: string; error?: string }>,
    BatchAutoFixRequest
  >({
    mutationFn: async ({ spreadsheetId, fixes }) => {
      const loadingMessage =
        fixes.length === 1
          ? `Đang sửa lỗi "${fixes[0].fixType}"...`
          : `Đang sửa ${fixes.length} lỗi...`

      const successMessage =
        fixes.length === 1
          ? `Đã sửa thành công!`
          : `Đã sửa thành công ${fixes.length} lỗi!`

      return customToast.promise(sheetApi.batchAutoFix(spreadsheetId, fixes), {
        loading: loadingMessage,
        success: (result) => {
          const { summary } = result
          if (summary.failed > 0) {
            return `Đã sửa ${summary.successful}/${summary.total} lỗi. ${summary.failed} lỗi thất bại.`
          }
          return successMessage
        },
        error: (err) =>
          (err as AxiosError<{ message: string; error?: string }>).response
            ?.data?.error ??
          (err as AxiosError<{ message: string; error?: string }>).response
            ?.data?.message ??
          "Có lỗi xảy ra khi sửa format",
      })
    },
    onSuccess: (result) => {
      onSuccess(result.data, result)
    },
  })
}

// Hook for single auto fix with optimizations
export const useOptimizedAutoFix = (
  onSuccess: (data: SpreadsheetResponse) => void
) => {
  const batchMutation = useBatchAutoFix(onSuccess)

  return {
    ...batchMutation,
    mutateAsync: async ({
      spreadsheetId,
      sheetTitle,
      fixType,
    }: {
      spreadsheetId: string
      sheetTitle: string
      fixType: string
    }) => {
      const result = await batchMutation.mutateAsync({
        spreadsheetId,
        fixes: [{ sheetTitle, fixType }],
      })
      return result.data
    },
    mutate: ({
      spreadsheetId,
      sheetTitle,
      fixType,
    }: {
      spreadsheetId: string
      sheetTitle: string
      fixType: string
    }) => {
      batchMutation.mutate({
        spreadsheetId,
        fixes: [{ sheetTitle, fixType }],
      })
    },
  }
}
