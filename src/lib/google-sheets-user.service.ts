import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet"
import { OAuth2Client } from "google-auth-library"
import { SpreadsheetResponse } from "@/models"
import {
  GoogleSheetsService,
  SheetRow,
  SheetData,
} from "./google-sheets.service"

export class GoogleSheetsUserService extends GoogleSheetsService {
  private oauth2Client: OAuth2Client | null = null

  constructor(accessToken?: string) {
    super()

    if (accessToken) {
      this.oauth2Client = new OAuth2Client()
      this.oauth2Client.setCredentials({
        access_token: accessToken,
      })
    }
  }

  // Override getDocument để sử dụng user credentials
  protected async getDocument(
    spreadsheetId: string
  ): Promise<GoogleSpreadsheet> {
    return this.withRetry(async () => {
      // Apply rate limiting before API call
      await this.rateLimiter.checkLimit()

      let doc: GoogleSpreadsheet

      if (this.oauth2Client) {
        // Sử dụng user OAuth token
        doc = new GoogleSpreadsheet(spreadsheetId, this.oauth2Client)
      } else {
        // Fallback về service account
        doc = new GoogleSpreadsheet(spreadsheetId, this.auth)
      }

      await doc.loadInfo()
      return doc
    })
  }

  // Tạo instance với user token
  static withUserToken(accessToken: string): GoogleSheetsUserService {
    return new GoogleSheetsUserService(accessToken)
  }

  // Tạo instance với service account (fallback)
  static withServiceAccount(): GoogleSheetsUserService {
    return new GoogleSheetsUserService()
  }

  // Kiểm tra quyền truy cập
  async checkAccess(spreadsheetId: string): Promise<{
    hasAccess: boolean
    authType: "user" | "service_account" | "none"
    message?: string
  }> {
    try {
      await this.getDocument(spreadsheetId)
      return {
        hasAccess: true,
        authType: this.oauth2Client ? "user" : "service_account",
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        return {
          hasAccess: false,
          authType: "none",
          message: this.oauth2Client
            ? "Bạn không có quyền truy cập file này. Vui lòng kiểm tra quyền chia sẻ."
            : `Không có quyền truy cập. Vui lòng thêm quyền cho email: ${process.env.GOOGLE_CLIENT_EMAIL}`,
        }
      }

      return {
        hasAccess: false,
        authType: "none",
        message: `Lỗi truy cập: ${error.message}`,
      }
    }
  }

  // Override các phương thức cần quyền ghi để kiểm tra permission
  async addRowToSheet(
    spreadsheetId: string,
    sheetId: number,
    rowData: { key: string; data: Record<string, string> }
  ): Promise<SpreadsheetResponse> {
    if (this.oauth2Client) {
      // Với user token, cần kiểm tra quyền ghi
      try {
        return await super.addRowToSheet(spreadsheetId, sheetId, rowData)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.addRowToSheet(spreadsheetId, sheetId, rowData)
  }

  async updateRow(
    spreadsheetId: string,
    sheetId: number,
    rowNumber: number,
    data: Record<string, string>
  ): Promise<void> {
    if (this.oauth2Client) {
      try {
        return await super.updateRow(spreadsheetId, sheetId, rowNumber, data)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.updateRow(spreadsheetId, sheetId, rowNumber, data)
  }

  async syncSpreadsheet(spreadsheetData: SpreadsheetResponse): Promise<void> {
    if (this.oauth2Client) {
      try {
        return await super.syncSpreadsheet(spreadsheetData)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.syncSpreadsheet(spreadsheetData)
  }

  async addSheet(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<SpreadsheetResponse> {
    if (this.oauth2Client) {
      try {
        return await super.addSheet(spreadsheetId, sheetTitle)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.addSheet(spreadsheetId, sheetTitle)
  }

  async deleteSheet(
    spreadsheetId: string,
    sheetId: number
  ): Promise<SpreadsheetResponse> {
    if (this.oauth2Client) {
      try {
        return await super.deleteSheet(spreadsheetId, sheetId)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.deleteSheet(spreadsheetId, sheetId)
  }

  async addLanguageColumn(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    if (!this.oauth2Client) {
      return super.addLanguageColumn(spreadsheetId, languageName)
    }

    try {
      const doc = await this.getDocument(spreadsheetId)

      if (!languageName.trim()) {
        throw new Error("Language name cannot be empty")
      }

      console.log(`🚀 [UserService] Adding language column "${languageName}" (BatchGet + BatchUpdate)`)

      // ── STEP 1: Lấy headers của TẤT CẢ sheets trong 1 API call ──────────
      const accessToken = this.oauth2Client.credentials.access_token
      const ranges = doc.sheetsByIndex.map((s) => `'${s.title}'!1:1`)
      const rangesParam = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&")
      const batchGetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangesParam}&majorDimension=ROWS`

      const headerRes = await fetch(batchGetUrl, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      })

      const sheetHeaders: Map<number, string[]> = new Map()

      if (!headerRes.ok) {
        for (const sheet of doc.sheetsByIndex) {
          await this.rateLimiter.checkLimit()
          await sheet.loadHeaderRow()
          sheetHeaders.set(sheet.sheetId, sheet.headerValues ?? [])
        }
      } else {
        const headerData = await headerRes.json()
        const valueRanges: any[] = headerData.valueRanges ?? []
        for (let i = 0; i < doc.sheetsByIndex.length; i++) {
          const sheet = doc.sheetsByIndex[i]
          const rawHeaders: string[] = valueRanges[i]?.values?.[0] ?? []
          sheetHeaders.set(sheet.sheetId, rawHeaders.map((h: string) => h?.trim() ?? ""))
        }
      }

      // Kiểm tra trùng
      const normalizedNew = languageName.toLowerCase()
      for (const [, headers] of sheetHeaders) {
        if (headers.some((h) => h.toLowerCase() === normalizedNew)) {
          throw new Error(`Language "${languageName}" already exists`)
        }
      }

      // ── STEP 2: batchUpdate append header cho tất cả sheets ──────────────
      const requests: any[] = []
      for (const sheet of doc.sheetsByIndex) {
        const headers = sheetHeaders.get(sheet.sheetId) ?? []
        const colIndex = headers.length

        requests.push({
          updateCells: {
            rows: [{ values: [{ userEnteredValue: { stringValue: languageName } }] }],
            fields: "userEnteredValue",
            range: {
              sheetId: sheet.sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: colIndex,
              endColumnIndex: colIndex + 1,
            },
          },
        })
        console.log(`  ✓ [user] Will add "${languageName}" to "${sheet.title}" at column ${colIndex}`)
      }

      if (requests.length > 0) {
        await this.rateLimiter.checkLimit()
        // @ts-ignore
        await doc._makeBatchUpdateRequest(requests)
        console.log(`📍 [user] batchUpdate: added "${languageName}" to ${requests.length} sheet(s)`)
      }

      this["invalidateSpreadsheetCache"](spreadsheetId)
      return this.getSpreadsheet(spreadsheetId)
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ.")
      }
      throw error
    }
  }

  async deleteLanguageColumn(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    if (!this.oauth2Client) {
      return super.deleteLanguageColumn(spreadsheetId, languageName)
    }

    try {
      // Dùng OAuth user token cho batchGet headers
      const doc = await this.getDocument(spreadsheetId)

      if (!languageName.trim()) {
        throw new Error("Tên ngôn ngữ không được để trống")
      }

      console.log(`🚀 [UserService] Deleting language column "${languageName}" (BatchGet + BatchUpdate)`)

      // ── STEP 1: Lấy header row của tất cả sheets trong 1 API call ──────────
      const accessToken = this.oauth2Client.credentials.access_token
      const ranges = doc.sheetsByIndex.map((s) => `'${s.title}'!1:1`)
      const rangesParam = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&")
      const batchGetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangesParam}&majorDimension=ROWS`

      const headerRes = await fetch(batchGetUrl, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      })

      if (!headerRes.ok) {
        // Fallback: load từng sheet
        await Promise.all(
          doc.sheetsByIndex.map(async (sheet) => {
            try {
              await this.rateLimiter.checkLimit()
              await sheet.loadHeaderRow()
            } catch { /* ignore */ }
          })
        )
      } else {
        const headerData = await headerRes.json()
        const valueRanges: any[] = headerData.valueRanges ?? []
        for (let i = 0; i < doc.sheetsByIndex.length; i++) {
          const rawHeaders: string[] = valueRanges[i]?.values?.[0] ?? []
          ;(doc.sheetsByIndex[i] as any)._cachedHeaders = rawHeaders.map((h: string) => h?.trim() ?? "")
        }
      }

      // ── STEP 2: Build batchUpdate ──────────────────────────────────────────
      const requests: any[] = []
      const normalizedTarget = languageName.toLowerCase()

      for (const sheet of doc.sheetsByIndex) {
        const headers: string[] = (sheet as any)._cachedHeaders ?? sheet.headerValues ?? []
        const colIndex = headers.findIndex((h: string) => h.toLowerCase() === normalizedTarget)

        if (colIndex !== -1) {
          requests.push({
            deleteDimension: {
              range: { sheetId: sheet.sheetId, dimension: "COLUMNS", startIndex: colIndex, endIndex: colIndex + 1 },
            },
          })
          console.log(`  ✓ [user] Found "${languageName}" in "${sheet.title}" at column ${colIndex}`)
        }
      }

      if (requests.length > 0) {
        await this.rateLimiter.checkLimit()
        // @ts-ignore
        await doc._makeBatchUpdateRequest(requests)
      }

      this["invalidateSpreadsheetCache"](spreadsheetId)
      return this.getSpreadsheet(spreadsheetId)
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ.")
      }
      throw error
    }
  }


  // Inherit lazy loading từ parent class
  async getSpreadsheetLazy(
    spreadsheetId: string, 
    options: {
      mode: "lazy" | "first-only"
      specificSheet?: string
    }
  ): Promise<any> {
    if (this.oauth2Client) {
      try {
        return await super.getSpreadsheetLazy(spreadsheetId, options)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền truy cập file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.getSpreadsheetLazy(spreadsheetId, options)
  }

  /**
   * Override batchGetAllSheets để dùng OAuth user token thay vì service account JWT.
   * Cùng logic 1-call nhưng lấy token từ oauth2Client.
   */
  protected async batchGetAllSheets(
    spreadsheetId: string,
    sheetsByIndex: any[]
  ): Promise<any[]> {
    if (!this.oauth2Client) {
      // Không có OAuth → dùng service account (parent implementation)
      return super.batchGetAllSheets(spreadsheetId, sheetsByIndex)
    }

    if (sheetsByIndex.length === 0) return []

    const credentials = this.oauth2Client.credentials
    const accessToken = credentials.access_token
    if (!accessToken) {
      throw new Error("OAuth access token not available")
    }

    const ranges = sheetsByIndex.map((s) => `'${s.title}'`)
    const rangesParam = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&")
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangesParam}&valueRenderOption=FORMATTED_VALUE&majorDimension=ROWS`

    console.log(`⚡ [UserService] BatchGet: ${sheetsByIndex.length} sheets in 1 call`)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new Error(`BatchGet failed: ${response.status} - ${JSON.stringify(errBody)}`)
    }

    const data = await response.json()
    const valueRanges: any[] = data.valueRanges ?? []

    const sheets: any[] = []
    for (let i = 0; i < sheetsByIndex.length; i++) {
      const sheet = sheetsByIndex[i]
      const rows2D: string[][] = valueRanges[i]?.values ?? []

      if (rows2D.length === 0) {
        sheets.push({ sheetId: sheet.sheetId, title: sheet.title, rows: [] })
        continue
      }

      const headers = rows2D[0].map((h: string) => h?.trim() ?? "")
      const keyColIdx = headers.findIndex((h: string) => h.toLowerCase() === "key")

      if (keyColIdx === -1) {
        sheets.push({ sheetId: sheet.sheetId, title: sheet.title, rows: [] })
        continue
      }

      const parsedRows: import("./google-sheets.service").SheetRow[] = []
      for (let rowIdx = 1; rowIdx < rows2D.length; rowIdx++) {
        const rawRow = rows2D[rowIdx]
        const key = rawRow[keyColIdx]?.trim() ?? ""
        if (!key) continue

        const obj: Record<string, string> = {}
        for (let colIdx = 0; colIdx < headers.length; colIdx++) {
          const header = headers[colIdx]
          if (!header || header.toLowerCase() === "key") continue
          obj[header] = rawRow[colIdx]?.trim() ?? ""
        }

        parsedRows.push({ rowNumber: rowIdx + 1, key, data: obj })
      }

      sheets.push({ sheetId: sheet.sheetId, title: sheet.title, rows: parsedRows })
      console.log(`  ✓ [user] ${sheet.title}: ${parsedRows.length} rows`)
    }

    return sheets
  }
}
