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

  async addLanguageColumn(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    if (this.oauth2Client) {
      try {
        return await super.addLanguageColumn(spreadsheetId, languageName)
      } catch (error: any) {
        if (error.response?.status === 403) {
          throw new Error(
            "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ."
          )
        }
        throw error
      }
    }

    return super.addLanguageColumn(spreadsheetId, languageName)
  }
}
