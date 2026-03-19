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
  setResponse: (
    data: SpreadsheetResponse | null,
    options?: { resetChanges?: boolean },
  ) => void
  updateTranslation: (sheetID: number, rows: SheetRowData) => void
  syncSheet: () => void
  hasChanges: boolean
  isSyncing: boolean
  setHasChanges: (val: boolean) => void
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
  const [hasChanges, setHasChanges] = useState(false)
  const mutation = useSyncSheet(() => {
    setHasChanges(false)
  })

  const updateResponse = useCallback(
    (data: SpreadsheetResponse | null, options?: { resetChanges?: boolean }) => {
      const resetChanges = options?.resetChanges ?? true
      if (!data) {
        setResponse(null)
        setListLocales([])
        setSelectedLocales([])
        setHasChanges(false)
        return
      }

      setResponse(data)
      const list = getLanguages(data)
      setListLocales(list)
      // Mặc định chọn tất cả ngôn ngữ khi load data mới
      setSelectedLocales(list)
      if (resetChanges) setHasChanges(false)
    },
    []
  )

  const updateTranslation = useCallback(
    (sheetId: number, row: SheetRowData) => {
      setHasChanges(true)
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
      hasChanges,
      isSyncing: mutation.isPending,
      setHasChanges,
    }),
    [
      response,
      listLocales,
      selectedLocales,
      updateResponse,
      updateTranslation,
      syncSheet,
      hasChanges,
      mutation.isPending,
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
