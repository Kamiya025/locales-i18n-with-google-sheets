"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"

export const useSyncSheet = (
  onSuccess: (data: SpreadsheetResponse) => void
) => {
  return useMutation<
    SpreadsheetResponse, // Kiểu dữ liệu trả về
    AxiosError<{ message: string }>, // Kiểu lỗi API
    SpreadsheetResponse // Biến truyền vào
  >({
    mutationFn: async (data: SpreadsheetResponse) => {
      const isLocal = data.id === "local-excel"
      return toast.promise(sheetApi.update(data), {
        loading: isLocal ? "Đang lưu dữ liệu..." : "Đang đẩy dữ liệu lên Google Sheet...",
        success: isLocal ? "Đã lưu dữ liệu!" : "Đẩy dữ liệu thành công!",
        error: (err) => err.response?.data?.message || "Có lỗi xảy ra",
      })
    },
    onSuccess: onSuccess,
  })
}

