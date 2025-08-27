"use client"
import { useSyncSheet } from "@/hooks/useSyncSheet"
import { SheetRowData, SpreadsheetResponse } from "@/models"
import { getLanguages } from "@/util"
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"

interface SpreadsheetContextProps {
  data: SpreadsheetResponse | null
  listLocales: string[]
  selectedLocales: string[]
  setSelectedLocales: (locales: string[]) => void
  setResponse: (data: SpreadsheetResponse | null) => void
  updateTranslation: (sheetID: number, rows: SheetRowData) => void
  syncSheet: () => void
}

const SpreadsheetContext = createContext<SpreadsheetContextProps | undefined>(
  undefined
)

interface SpreadsheetProviderProps {
  children: ReactNode
  initialData?: SpreadsheetResponse | null // Optional initial data
}

export const SpreadsheetProvider = ({
  children,
  initialData = null,
}: SpreadsheetProviderProps) => {
  const [response, setResponse] = useState<SpreadsheetResponse | null>(
    initialData
  )
  const [listLocales, setListLocales] = useState<string[]>([])
  const [selectedLocales, setSelectedLocales] = useState<string[]>([])
  const mutation = useSyncSheet(() => {})

  const updateResponse = useCallback((data: SpreadsheetResponse | null) => {
    if (!data) {
      setResponse(null)
      setListLocales([])
      setSelectedLocales([])
      return
    }

    setResponse(data)
    const list = getLanguages(data)
    setListLocales(list)
    // Mặc định chọn tất cả ngôn ngữ khi load data mới
    setSelectedLocales(list)
  }, [])
  const updateTranslation = useCallback(
    (sheetId: number, row: SheetRowData) => {
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
    []
  )
  const syncSheet = useCallback(() => {
    if (response) mutation.mutate(response)
  }, [response, mutation])

  const contextValue = useMemo(
    () => ({
      data: response,
      setResponse: updateResponse,
      listLocales,
      selectedLocales,
      setSelectedLocales,
      updateTranslation,
      syncSheet,
    }),
    [
      response,
      listLocales,
      selectedLocales,
      updateResponse,
      updateTranslation,
      syncSheet,
    ]
  )

  return (
    <SpreadsheetContext.Provider value={contextValue}>
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
