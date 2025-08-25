import { useMutation } from "@tanstack/react-query"
import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"

interface AddSheetParams {
  spreadsheetId: string
  sheetTitle: string
}

export function useAddSheet(
  onSuccess?: (data: SpreadsheetResponse) => void,
  onError?: (error: string) => void
) {
  return useMutation({
    mutationFn: ({ spreadsheetId, sheetTitle }: AddSheetParams) =>
      sheetApi.addSheet(spreadsheetId, sheetTitle),
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: (error: any) => {
      let errorMessage = "Có lỗi xảy ra khi tạo danh mục"

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.message) {
        errorMessage = error.message
      }

      if (onError) {
        onError(errorMessage)
      }
    },
  })
}
