import { SpreadsheetResponse, SpreadsheetUpdateRowRequest } from "@/models"
import axiosClient from "../axios-client"

const sheetApi = {
  getAll(
    sheetId: string,
    options?: { aggressive?: boolean }
  ): Promise<SpreadsheetResponse> {
    if (sheetId === "local-excel") {
      if (typeof window !== "undefined") {
        const localData = sessionStorage.getItem("temp_excel_data")
        if (localData) {
          return Promise.resolve(JSON.parse(localData))
        }
      }
      return Promise.reject(new Error("Không tìm thấy file Excel nào đang được tải lên bộ nhớ tạm."))
    }

    const url = "/sheet/" + sheetId
    const params = options?.aggressive ? { aggressive: "true" } : undefined
    console.log("🚀 API call to:", url, "with params:", params)
    return axiosClient.get(url, { params })
  },
  update(data: SpreadsheetResponse): Promise<any> {
    if (data.id === "local-excel") return Promise.resolve({ success: true, data })
    const url = "/sheet/update"
    return axiosClient.post(url, data)
  },
  saveRow(data: SpreadsheetUpdateRowRequest): Promise<any> {
    if (data.spreadsheetId === "local-excel") return Promise.resolve({ success: true, data })
    const url = "/sheet/save-row/"
    return axiosClient.post(url, data)
  },
  saveNewRow(data: SpreadsheetUpdateRowRequest): Promise<SpreadsheetResponse> {
    if (data.spreadsheetId === "local-excel") return Promise.resolve({ success: true, data } as any)
    const url = "/sheet/add-row/"
    return axiosClient.post(url, data)
  },
  addLanguage(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    const url = "/sheet/add-language"
    return axiosClient.post(url, { spreadsheetId, languageName })
  },
  addSheet(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<SpreadsheetResponse> {
    const url = "/sheet/add-sheet"
    return axiosClient.post(url, { spreadsheetId, sheetTitle })
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
    const url = "/sheet/batch-auto-fix"
    return axiosClient.post(url, { spreadsheetId, fixes })
  },
}

export default sheetApi
