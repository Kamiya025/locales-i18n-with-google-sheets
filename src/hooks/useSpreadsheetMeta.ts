"use client"

import { useQuery } from "@tanstack/react-query"
import sheetApi from "@/apis/sheet"

export interface SheetMeta {
  sheetId: number
  title: string
  index: number
  rowCount: number
  columnCount: number
  hidden: boolean
}

export interface SpreadsheetMeta {
  spreadsheetId: string
  title: string
  sheets: SheetMeta[]
  _meta: {
    authType: string
    fetchedAt: string
    totalSheets: number
  }
}

/**
 * Hook lấy nhanh metadata spreadsheet (chỉ title + danh sách sheets, không load rows).
 * - Chỉ 1 HTTP request đến Google Sheets REST API
 * - Cực nhanh so với getSpreadsheetLazy
 * - Dùng cho: hiển thị danh sách sheet, kiểm tra quyền, preview nhanh
 *
 * @param spreadsheetId - ID spreadsheet Google Sheets
 * @param enabled - bật/tắt fetch (mặc định true nếu có ID)
 */
export function useSpreadsheetMeta(
  spreadsheetId: string | null | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ["spreadsheet-meta", spreadsheetId],
    queryFn: async (): Promise<SpreadsheetMeta> => {
      if (!spreadsheetId) throw new Error("No spreadsheet ID provided")
      const res = await sheetApi.getMetadata(spreadsheetId)
      return res.data
    },
    enabled: !!spreadsheetId && enabled,
    staleTime: 5 * 60 * 1000,   // 5 phút
    gcTime: 10 * 60 * 1000,     // 10 phút
    retry: (failureCount, error: any) => {
      // Không retry khi lỗi quyền hoặc không tìm thấy
      if (error?.response?.status === 403 || error?.response?.status === 404) return false
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
  })
}
