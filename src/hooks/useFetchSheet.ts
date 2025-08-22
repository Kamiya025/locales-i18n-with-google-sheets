"use client"

import sheetApi from "@/apis/sheet"
import { SpreadsheetResponse } from "@/models"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"

export const useFetchSheet = (
  onSuccess: (data: SpreadsheetResponse, url: string) => void
) => {
  return useMutation<
    SpreadsheetResponse, // Kiểu dữ liệu trả về
    AxiosError<{ message: string }>, // Kiểu lỗi API
    string // Biến truyền vào (sheetId)
  >({
    mutationFn: async (sheetId: string) => {
      return toast.promise(sheetApi.getAll(sheetId), {
        loading: "Đang lấy dữ liệu Google Sheet...",
        success: "Lấy dữ liệu thành công!",
        error: (err) => err.response?.data?.message || "Có lỗi xảy ra",
      })
    },
    onSuccess: onSuccess,
  })
}
