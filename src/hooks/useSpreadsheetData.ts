"use client"

import sheetApi from "@/apis/sheet"
import { useQuery } from "@tanstack/react-query"

/**
 * Hook để auto-load spreadsheet data theo ID
 * Dùng cho providers và detail pages
 */
export const useSpreadsheetData = (spreadsheetId: string) => {
  return useQuery({
    queryKey: ["spreadsheet", spreadsheetId],
    queryFn: () => sheetApi.getAll(spreadsheetId),
    enabled: !!spreadsheetId, // Only run query if spreadsheetId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
