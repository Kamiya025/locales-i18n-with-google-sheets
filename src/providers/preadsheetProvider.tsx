"use client"
import { useSyncSheet } from "@/hooks/useSyncSheet"
import { useSyncSheetSaveRow } from "@/hooks/useSyncSheetSaveRow"
import { SheetRowData, SpreadsheetResponse } from "@/models"
import React, { createContext, useContext, useState, ReactNode } from "react"

interface SpreadsheetContextProps {
  data: SpreadsheetResponse | null
  setResponse: (data: SpreadsheetResponse) => void
  updateTranslation: (sheetID: number, rows: SheetRowData) => void
  syncSheet: () => void
}

const SpreadsheetContext = createContext<SpreadsheetContextProps | undefined>(
  undefined
)

export const SpreadsheetProvider = ({ children }: { children: ReactNode }) => {
  const [response, setResponse] = useState<SpreadsheetResponse | null>(null)
  const mutation = useSyncSheet(() => {})
  const mutationSaveRow = useSyncSheetSaveRow(() => {})
  function updateTranslation(sheetId: number, row: SheetRowData) {
    if (response === null) return

    mutationSaveRow.mutate({
      data: {
        spreadsheetId: response.id,
        row,
        sheetId,
      },
      onSuccess: () => {
        setResponse((prev) => {
          if (!prev) return prev

          // Nếu đã có rồi => cập nhật
          return {
            ...prev,
            sheets: prev.sheets.map((s) => {
              if (s.sheetId !== sheetId) return s
              const existing = s.rows.find((r) => r.key === row.key)
              if (existing) {
                // merge data cũ + data mới
                return {
                  ...s,
                  rows: s.rows.map((r) =>
                    r.key === row.key
                      ? { ...r, data: { ...r.data, ...row.data } }
                      : r
                  ),
                }
              }
              // nếu chưa có thì thêm row mới
              return {
                ...s,
                rows: [...s.rows, row],
              }
            }),
          }
        })
      },
    })
  }
  return (
    <SpreadsheetContext.Provider
      value={{
        data: response,
        setResponse,
        updateTranslation,
        syncSheet: () => {
          if (response) mutation.mutate(response)
        },
      }}
    >
      {children}
    </SpreadsheetContext.Provider>
  )
}

// Hook tiện dùng
export const useSpreadsheet = () => {
  const ctx = useContext(SpreadsheetContext)
  if (!ctx)
    throw new Error("useSpreadsheet must be used inside SpreadsheetProvider")
  return ctx
}
