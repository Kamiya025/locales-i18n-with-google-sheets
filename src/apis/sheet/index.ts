import { SpreadsheetResponse, SpreadsheetUpdateRowRequest } from "@/models"
import axiosClient from "../axios-client"

// ─── Helpers cho local-excel (sessionStorage) ────────────────────────────────

function isLocalExcel(id: string): boolean {
  return id === "local-excel"
}

function getLocalExcelData(): SpreadsheetResponse | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem("temp_excel_data")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persistLocalExcel(data: SpreadsheetResponse): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("temp_excel_data", JSON.stringify(data))
  }
}

// ─── Sheet API ───────────────────────────────────────────────────────────────

const sheetApi = {
  getAll(
    sheetId: string,
    options?: { aggressive?: boolean }
  ): Promise<SpreadsheetResponse> {
    if (isLocalExcel(sheetId)) {
      const localData = getLocalExcelData()
      if (localData) return Promise.resolve(localData)
      return Promise.reject(new Error("Không tìm thấy file Excel nào đang được tải lên bộ nhớ tạm."))
    }

    const url = "/sheet/" + sheetId
    const params = options?.aggressive ? { aggressive: "true" } : undefined
    console.log("🚀 API call to:", url, "with params:", params)
    return axiosClient.get(url, { params })
  },

  getSpecificSheet(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<SpreadsheetResponse> {
    const url = "/sheet/" + spreadsheetId
    const params = { mode: "first-only", sheet: sheetTitle }
    console.log("🚀 API call for specific sheet:", sheetTitle)
    return axiosClient.get(url, { params })
  },

  update(data: SpreadsheetResponse): Promise<any> {
    if (isLocalExcel(data.id)) {
      persistLocalExcel(data)
      return Promise.resolve({ success: true, data })
    }
    const url = "/sheet/update"
    return axiosClient.post(url, data)
  },

  saveRow(data: SpreadsheetUpdateRowRequest): Promise<any> {
    if (isLocalExcel(data.spreadsheetId)) {
      // Cập nhật row trong sessionStorage
      const current = getLocalExcelData()
      if (current) {
        const updated: SpreadsheetResponse = {
          ...current,
          sheets: current.sheets.map((sheet) => {
            if (sheet.sheetId !== data.sheetId) return sheet
            return {
              ...sheet,
              rows: sheet.rows.map((row) =>
                row.key === data.row.key
                  ? { ...row, data: { ...row.data, ...data.row.data } }
                  : row
              ),
            }
          }),
        }
        persistLocalExcel(updated)
      }
      return Promise.resolve({ success: true, data })
    }
    const url = "/sheet/save-row/"
    return axiosClient.post(url, data)
  },

  saveNewRow(data: SpreadsheetUpdateRowRequest): Promise<SpreadsheetResponse> {
    if (isLocalExcel(data.spreadsheetId)) {
      // Thêm row mới vào sessionStorage
      const current = getLocalExcelData()
      if (current) {
        const updated: SpreadsheetResponse = {
          ...current,
          sheets: current.sheets.map((sheet) => {
            if (sheet.sheetId !== data.sheetId) return sheet
            const maxRowNumber = sheet.rows.reduce((max, r) => Math.max(max, r.rowNumber), 0)
            return {
              ...sheet,
              rows: [
                ...sheet.rows,
                {
                  rowNumber: maxRowNumber + 1,
                  key: data.row.key,
                  data: data.row.data || {},
                },
              ],
            }
          }),
        }
        persistLocalExcel(updated)
        return Promise.resolve(updated)
      }
      return Promise.resolve({ success: true, data } as any)
    }
    const url = "/sheet/add-row/"
    return axiosClient.post(url, data)
  },

  addLanguage(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    if (isLocalExcel(spreadsheetId)) {
      // Thêm cột ngôn ngữ mới vào tất cả sheets (giá trị rỗng)
      const current = getLocalExcelData()
      if (!current) return Promise.reject(new Error("Không tìm thấy dữ liệu local-excel"))

      const updated: SpreadsheetResponse = {
        ...current,
        sheets: current.sheets.map((sheet) => ({
          ...sheet,
          rows: sheet.rows.map((row) => ({
            ...row,
            data: {
              ...row.data,
              [languageName]: row.data[languageName] || "",
            },
          })),
        })),
      }
      persistLocalExcel(updated)
      return Promise.resolve(updated)
    }
    const url = "/sheet/add-language"
    return axiosClient.post(url, { spreadsheetId, languageName })
  },

  deleteLanguage(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    if (isLocalExcel(spreadsheetId)) {
      // Xóa cột ngôn ngữ khỏi tất cả sheets
      const current = getLocalExcelData()
      if (!current) return Promise.reject(new Error("Không tìm thấy dữ liệu local-excel"))

      const updated: SpreadsheetResponse = {
        ...current,
        sheets: current.sheets.map((sheet) => ({
          ...sheet,
          rows: sheet.rows.map((row) => {
            const { [languageName]: _, ...rest } = row.data
            return { ...row, data: rest }
          }),
        })),
      }
      persistLocalExcel(updated)
      return Promise.resolve(updated)
    }
    // Online mode — gọi API route riêng (xử lý ở LanguageFilter)
    const url = "/sheet/delete-language"
    return axiosClient.post(url, { spreadsheetId, languageName })
  },

  addSheet(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<SpreadsheetResponse> {
    if (isLocalExcel(spreadsheetId)) {
      const current = getLocalExcelData()
      if (!current) return Promise.reject(new Error("Không tìm thấy dữ liệu local-excel"))

      // Tạo sheetId mới (lấy max hiện tại + 1)
      const maxSheetId = current.sheets.reduce((max, s) => Math.max(max, s.sheetId), 0)

      const updated: SpreadsheetResponse = {
        ...current,
        sheets: [
          ...current.sheets,
          {
            sheetId: maxSheetId + 1,
            title: sheetTitle,
            rows: [],
          },
        ],
      }
      persistLocalExcel(updated)
      return Promise.resolve(updated)
    }
    const url = "/sheet/add-sheet"
    return axiosClient.post(url, { spreadsheetId, sheetTitle })
  },
  deleteSheet(
    spreadsheetId: string,
    sheetId: number
  ): Promise<SpreadsheetResponse> {
    if (isLocalExcel(spreadsheetId)) {
      const current = getLocalExcelData()
      if (!current) return Promise.reject(new Error("Không tìm thấy dữ liệu local-excel"))

      // Google Sheets requires at least one sheet to remain
      if (current.sheets.length <= 1) {
        return Promise.reject(new Error("Không thể xóa danh mục cuối cùng. Bảng tính phải có ít nhất một danh mục."))
      }

      const updated: SpreadsheetResponse = {
        ...current,
        sheets: current.sheets.filter((s) => s.sheetId !== sheetId),
      }
      persistLocalExcel(updated)
      return Promise.resolve(updated)
    }
    const url = "/sheet/delete-sheet"
    return axiosClient.post(url, { spreadsheetId, sheetId })
  },

  validateSheet(sheetUrl: string): Promise<{
    isValid: boolean
    spreadsheet?: SpreadsheetResponse
    validationIssues: Array<{
      sheetTitle: string
      errors: string[]
      fixes: Array<{
        type:
        | "missing_key"
        | "duplicate_keys"
        | "empty_keys"
        | "no_languages"
        | "no_headers"
        title: string
        description: string
        action: string
      }>
    }>
  }> {
    const url = "/sheet/validate"
    // Send URL directly to server, let server extract ID
    return axiosClient.post(url, { sheetUrl })
  },

  autoFix(
    spreadsheetId: string,
    sheetTitle: string,
    fixType: string
  ): Promise<SpreadsheetResponse> {
    if (isLocalExcel(spreadsheetId)) {
      // Auto-fix không áp dụng cho local-excel
      const current = getLocalExcelData()
      if (current) return Promise.resolve(current)
      return Promise.reject(new Error("Không tìm thấy dữ liệu local-excel"))
    }
    const url = "/sheet/auto-fix"
    return axiosClient.post(url, { spreadsheetId, sheetTitle, fixType })
  },

  batchAutoFix(
    spreadsheetId: string,
    fixes: Array<{ sheetTitle: string; fixType: string }>
  ): Promise<{
    success: boolean
    data: SpreadsheetResponse
    results: Array<{
      success: boolean
      fixType: string
      sheetTitle: string
      error?: string
    }>
    summary: {
      total: number
      successful: number
      failed: number
    }
  }> {
    if (isLocalExcel(spreadsheetId)) {
      const current = getLocalExcelData()
      if (current) {
        return Promise.resolve({
          success: true,
          data: current,
          results: fixes.map((f) => ({ success: true, fixType: f.fixType, sheetTitle: f.sheetTitle })),
          summary: { total: fixes.length, successful: fixes.length, failed: 0 },
        })
      }
      return Promise.reject(new Error("Không tìm thấy dữ liệu local-excel"))
    }
    const url = "/sheet/batch-auto-fix"
    return axiosClient.post(url, { spreadsheetId, fixes })
  },
}

export default sheetApi
