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
    SpreadsheetUpdateRowRequest // Biến truyền vào
  >({
    mutationFn: async (data) => {
      const isLocal = data.spreadsheetId === "local-excel"
      return toast.promise(sheetApi.saveRow(data), {
        loading: isLocal ? "Đang lưu bản dịch..." : "Đang cập nhật bản dịch lên Google Sheet...",
        success: "Lưu bản dịch thành công!",
        error: (err) => err.response?.data?.message || "Có lỗi xảy ra",
      })
    },
    onSuccess,
  })
}

export const useSyncSheetAddNewRow = (
  onSuccess: (data: SpreadsheetResponse) => void
) => {
  return useMutation<
    SpreadsheetResponse, // Kiểu dữ liệu trả về
    AxiosError<{ message: string }>, // Kiểu lỗi API
    SpreadsheetUpdateRowRequest // Biến truyền vào
  >({
    mutationFn: async (data) => {
      const isLocal = data.spreadsheetId === "local-excel"
      return toast.promise(sheetApi.saveNewRow(data), {
        loading: isLocal ? "Đang thêm bản dịch..." : "Đang thêm bản dịch lên Google Sheet...",
        success: "Thêm bản dịch thành công!",
        error: (err) => err.response?.data?.message || "Có lỗi xảy ra",
      })
    },
    onSuccess,
  })
}

