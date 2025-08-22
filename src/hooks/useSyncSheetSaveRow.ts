"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse, SpreadsheetUpdateRowRequest } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"

export const useSyncSheetSaveRow = (onSuccess: () => void) => {
  return useMutation<
    SpreadsheetResponse, // Kiểu dữ liệu trả về
    AxiosError<{ message: string }>, // Kiểu lỗi API
    { data: SpreadsheetUpdateRowRequest; onSuccess: () => void } // Biến truyền vào
  >({
    mutationFn: async (data) => {
      return toast.promise(sheetApi.saveRow(data.data), {
        loading: "Đang cập nhật bản dịch lên Google Sheet...",
        success: "Lưu bản dịch thành công!",
        error: (err) => err.response?.data?.message || "Có lỗi xảy ra",
      })
    },
    onSuccess: (_, variables) => {
      variables.onSuccess()
    },
  })
}
