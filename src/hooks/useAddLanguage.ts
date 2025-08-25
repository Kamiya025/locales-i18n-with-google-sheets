"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"

export const useAddLanguage = (
  onSuccess: (data: SpreadsheetResponse) => void
) => {
  return useMutation<
    SpreadsheetResponse,
    AxiosError<{ message: string; error?: string }>,
    { spreadsheetId: string; languageName: string }
  >({
    mutationFn: async ({ spreadsheetId, languageName }) => {
      return toast.promise(sheetApi.addLanguage(spreadsheetId, languageName), {
        loading: `Đang thêm ngôn ngữ "${languageName}"...`,
        success: `Thêm ngôn ngữ "${languageName}" thành công!`,
        error: (err) =>
          err.response?.data?.error ??
          err.response?.data?.message ??
          "Có lỗi xảy ra khi thêm ngôn ngữ",
      })
    },
    onSuccess,
  })
}
