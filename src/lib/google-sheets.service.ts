import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { SpreadsheetResponse } from "@/models"

export interface SheetRow {
  rowNumber: number
  key: string
  data: Record<string, string>
}

export interface SheetData {
  sheetId: number
  title: string
  rows: SheetRow[]
}

export class GoogleSheetsService {
  private readonly auth: JWT

  constructor() {
    this.auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
  }

  private async getDocument(spreadsheetId: string): Promise<GoogleSpreadsheet> {
    const doc = new GoogleSpreadsheet(spreadsheetId, this.auth)
    await doc.loadInfo()
    return doc
  }

  private parseSheetRows(
    sheet: any,
    rows: GoogleSpreadsheetRow<Record<string, any>>[]
  ): SheetRow[] {
    return rows.map((row) => {
      const obj: Record<string, string> = {}
      let key = ""
      const rowNumber = row.rowNumber

      sheet.headerValues.forEach((header: string) => {
        const normalized = header.toLowerCase()
        if (normalized === "key") {
          key = row.get(header)
        } else {
          obj[header] = row.get(header) ?? ""
        }
      })

      return { rowNumber, key, data: obj }
    })
  }

  async getSpreadsheet(spreadsheetId: string): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    const sheets = await Promise.all(
      doc.sheetsByIndex.map(async (sheet) => {
        // Validate sheet format first
        await this.validateSheetFormat(sheet)

        const rows = await sheet
          .getRows()
          .catch(() => [] as GoogleSpreadsheetRow<Record<string, any>>[])

        if (rows.length === 0) {
          return {
            sheetId: sheet.sheetId,
            title: sheet.title,
            rows: [],
          }
        }

        const parsed = this.parseSheetRows(sheet, rows)

        // Validate parsed data
        this.validateParsedData(parsed, sheet.title)

        return {
          sheetId: sheet.sheetId,
          title: sheet.title,
          rows: parsed,
        }
      })
    )

    return {
      title: doc.title,
      id: spreadsheetId,
      sheets,
    }
  }

  async getSpreadsheetValidation(spreadsheetId: string): Promise<{
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
    const doc = await this.getDocument(spreadsheetId)
    const validationIssues: Array<{
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
    }> = []

    let isAllValid = true

    // Check each sheet for validation issues
    for (const sheet of doc.sheetsByIndex) {
      try {
        // Try to load header row safely
        await sheet.loadHeaderRow()
      } catch (error: any) {
        // Handle case where sheet has no headers or empty first row
        if (error.message?.includes("No values in the header row")) {
          isAllValid = false
          validationIssues.push({
            sheetTitle: sheet.title,
            errors: [
              `Sheet "${sheet.title}" không có headers hoặc row đầu tiên trống.`,
            ],
            fixes: [
              {
                type: "no_headers",
                title: "📝 Tạo Headers",
                description: "Tự động tạo headers cơ bản: KEY, English",
                action: "Tạo Headers",
              },
            ],
          })
          continue // Skip further validation for this sheet
        } else {
          // Re-throw other unexpected errors
          throw error
        }
      }

      // Validate sheet format
      const formatValidation = this.validateSheetFormatWithFixes(sheet)

      if (!formatValidation.isValid) {
        isAllValid = false
        validationIssues.push({
          sheetTitle: sheet.title,
          errors: formatValidation.errors,
          fixes: formatValidation.fixes,
        })
        continue // Skip further validation for this sheet
      }

      // Validate data if format is OK
      const rows = await sheet
        .getRows()
        .catch(() => [] as GoogleSpreadsheetRow<Record<string, any>>[])

      if (rows.length > 0) {
        const parsed = this.parseSheetRows(sheet, rows)
        const dataValidation = this.validateParsedDataWithFixes(
          parsed,
          sheet.title
        )

        if (!dataValidation.isValid) {
          isAllValid = false
          validationIssues.push({
            sheetTitle: sheet.title,
            errors: dataValidation.errors,
            fixes: dataValidation.fixes,
          })
        }
      }
    }

    // If all valid, return the spreadsheet data
    let spreadsheet: SpreadsheetResponse | undefined
    if (isAllValid) {
      spreadsheet = await this.getSpreadsheet(spreadsheetId)
    }

    return {
      isValid: isAllValid,
      spreadsheet,
      validationIssues,
    }
  }

  async addRowToSheet(
    spreadsheetId: string,
    sheetId: number,
    rowData: { key: string; data: Record<string, string> }
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    const sheet = doc.sheetsById[sheetId]
    if (!sheet) {
      throw new Error("Sheet not found")
    }

    await sheet.loadHeaderRow()
    await sheet.addRows([
      {
        KEY: rowData.key,
        ...rowData.data,
      },
    ])

    // Return updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }

  async updateRow(
    spreadsheetId: string,
    sheetId: number,
    rowNumber: number,
    data: Record<string, string>
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)

    const sheet = doc.sheetsById[sheetId]
    if (!sheet) {
      throw new Error("Sheet not found")
    }

    await sheet.loadHeaderRow()
    const rows = await sheet.getRows()

    const row = rows.find((r) => r.rowNumber === rowNumber)
    if (!row) {
      throw new Error("Row not found")
    }

    // Update each column in data
    for (const [lang, value] of Object.entries(data)) {
      if (sheet.headerValues.includes(lang)) {
        row.set(lang, String(value))
      } else {
        console.warn(`Column ${lang} not in headers`)
      }
    }

    await row.save()
  }

  async syncSpreadsheet(spreadsheetData: SpreadsheetResponse): Promise<void> {
    const doc = await this.getDocument(spreadsheetData.id)

    // Process each sheet
    for (const sheetData of spreadsheetData.sheets) {
      await this.syncSingleSheet(doc, sheetData)
    }
  }

  private async syncSingleSheet(
    doc: GoogleSpreadsheet,
    sheetData: SheetData
  ): Promise<void> {
    const sheet = doc.sheetsByTitle[sheetData.title]
    if (!sheet) return

    const rowMap = await this.buildRowMap(sheet)

    // Update existing rows
    for (const row of sheetData.rows) {
      await this.updateExistingRow(rowMap, row)
    }
  }

  private async buildRowMap(
    sheet: any
  ): Promise<Map<string, GoogleSpreadsheetRow<Record<string, any>>>> {
    const rows = await sheet.getRows()
    const rowMap = new Map<string, GoogleSpreadsheetRow<Record<string, any>>>()

    for (const r of rows) {
      const key = r.get("KEY") ?? r.get("key")
      if (key) {
        rowMap.set(key, r)
      }
    }

    return rowMap
  }

  private async updateExistingRow(
    rowMap: Map<string, GoogleSpreadsheetRow<Record<string, any>>>,
    row: SheetRow
  ): Promise<void> {
    const existing = rowMap.get(row.key)
    if (!existing) return

    // Update each column
    for (const [lang, value] of Object.entries(row.data)) {
      existing.set(lang, value)
    }
    await existing.save()
  }

  async addLanguageColumn(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    // Validate language name
    if (!languageName.trim()) {
      throw new Error("Language name cannot be empty")
    }

    // Check if language already exists in any sheet
    const existingLanguages = new Set<string>()
    for (const sheet of doc.sheetsByIndex) {
      await sheet.loadHeaderRow()
      sheet.headerValues.forEach((header) => {
        if (header.toLowerCase() !== "key") {
          existingLanguages.add(header.toLowerCase())
        }
      })
    }

    if (existingLanguages.has(languageName.toLowerCase())) {
      throw new Error(`Language "${languageName}" already exists`)
    }

    // Add the new language column to all sheets
    for (const sheet of doc.sheetsByIndex) {
      await sheet.loadHeaderRow()

      // Add new header if not exists
      if (!sheet.headerValues.includes(languageName)) {
        // Get the next column index
        const nextColIndex = sheet.headerValues.length

        // Add the new column header
        await sheet.loadCells(`A1:${String.fromCharCode(65 + nextColIndex)}1`)
        const headerCell = sheet.getCell(0, nextColIndex)
        headerCell.value = languageName

        // Preserve existing header formatting if any
        const firstHeaderCell = sheet.getCell(0, 0)
        if (firstHeaderCell.backgroundColor) {
          headerCell.backgroundColor = firstHeaderCell.backgroundColor
        }
        if (firstHeaderCell.textFormat) {
          headerCell.textFormat = firstHeaderCell.textFormat
        }

        await sheet.saveUpdatedCells()

        // Update header row to include the new column
        const newHeaders = [...sheet.headerValues, languageName]
        await sheet.setHeaderRow(newHeaders)
      }
    }

    // Return updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }

  private async validateSheetFormat(sheet: any): Promise<void> {
    await sheet.loadHeaderRow()

    const headers = sheet.headerValues ?? []

    // Check if sheet has headers
    if (headers.length === 0) {
      throw new Error(
        `Sheet "${sheet.title}" không có headers. Vui lòng thêm row đầu tiên làm headers.`
      )
    }

    // Check for KEY column
    const hasKeyColumn = headers.some(
      (header: string) => header && header.toLowerCase() === "key"
    )

    if (!hasKeyColumn) {
      throw new Error(
        `Sheet "${sheet.title}" thiếu column KEY.\n\n` +
          `Format mong đợi:\n` +
          `| KEY | Language1 | Language2 |\n` +
          `| key1 | value1 | value2 |\n\n` +
          `Headers hiện tại: ${headers.join(", ")}`
      )
    }

    // Check for at least one language column
    const languageColumns = headers.filter(
      (header: string) => header && header.toLowerCase() !== "key"
    )

    if (languageColumns.length === 0) {
      throw new Error(
        `Sheet "${sheet.title}" chỉ có column KEY mà không có ngôn ngữ nào.\n` +
          `Vui lòng thêm ít nhất 1 column ngôn ngữ.`
      )
    }

    // Check for duplicate headers
    const headerCounts = new Map<string, number>()
    headers.forEach((header: string) => {
      if (header) {
        const count = headerCounts.get(header.toLowerCase()) ?? 0
        headerCounts.set(header.toLowerCase(), count + 1)
      }
    })

    const duplicates = Array.from(headerCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([header]) => header)

    if (duplicates.length > 0) {
      throw new Error(
        `Sheet "${sheet.title}" có headers trùng lặp: ${duplicates.join(
          ", "
        )}\n` + `Mỗi column phải có tên riêng biệt.`
      )
    }
  }

  private validateParsedData(rows: SheetRow[], sheetTitle: string): void {
    if (rows.length === 0) return

    // Check for duplicate keys
    const keySet = new Set<string>()
    const duplicateKeys: string[] = []

    rows.forEach((row, index) => {
      // Check for empty keys
      if (!row.key?.trim()) {
        throw new Error(
          `Sheet "${sheetTitle}", Row ${
            index + 2
          }: KEY không được để trống.\n` + `Mỗi row phải có KEY duy nhất.`
        )
      }

      // Check for duplicate keys
      const normalizedKey = row.key.trim().toLowerCase()
      if (keySet.has(normalizedKey)) {
        duplicateKeys.push(row.key)
      } else {
        keySet.add(normalizedKey)
      }
    })

    if (duplicateKeys.length > 0) {
      throw new Error(
        `Sheet "${sheetTitle}" có KEY trùng lặp: ${duplicateKeys.join(
          ", "
        )}\n` + `Mỗi KEY phải là duy nhất trong sheet.`
      )
    }

    // Warning for rows with all empty translations
    const emptyRows = rows.filter((row) =>
      Object.values(row.data).every((value) => !value?.trim())
    )

    if (emptyRows.length > 0) {
      console.warn(
        `Sheet "${sheetTitle}": ${emptyRows.length} rows có tất cả translations trống: ` +
          emptyRows.map((r) => r.key).join(", ")
      )
    }
  }

  // Auto-fix methods
  async autoFixNoHeaders(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    // Create basic headers: KEY and English
    const headers = ["KEY", "English"]

    // Set the headers in row 1
    await sheet.setHeaderRow(headers)

    // Optionally apply formatting to the header row
    await sheet.loadCells("A1:B1")
    for (let i = 0; i < headers.length; i++) {
      const cell = sheet.getCell(0, i)
      cell.textFormat = { bold: true }
      cell.backgroundColor = { red: 0.8, green: 0.9, blue: 1 } // Light blue
    }
    await sheet.saveUpdatedCells()
  }

  async autoFixMissingKeyColumn(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    await sheet.loadHeaderRow()
    const headers = sheet.headerValues ?? []

    // If no KEY column, insert it at the beginning
    if (!headers.some((h) => h && h.toLowerCase() === "key")) {
      // Shift all existing data to the right and add KEY column
      await sheet.insertDimension("COLUMNS", { startIndex: 0, endIndex: 1 })

      // Set the new header
      await sheet.loadCells("A1:A1")
      const keyCell = sheet.getCell(0, 0)
      keyCell.value = "KEY"

      // Apply header formatting if other headers exist
      if (headers.length > 0) {
        await sheet.loadCells("B1:B1")
        const firstExistingHeader = sheet.getCell(0, 1)
        if (firstExistingHeader.backgroundColor) {
          keyCell.backgroundColor = firstExistingHeader.backgroundColor
        }
        if (firstExistingHeader.textFormat) {
          keyCell.textFormat = firstExistingHeader.textFormat
        }
      }

      await sheet.saveUpdatedCells()

      // Generate keys for existing rows
      const rows = await sheet.getRows()
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (!row.get("KEY")) {
          row.set("KEY", `item_${i + 1}`)
          await row.save()
        }
      }
    }
  }

  async autoFixDuplicateKeys(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    const rows = await sheet.getRows()
    const seenKeys = new Set<string>()
    const duplicateCount = new Map<string, number>()

    for (const row of rows) {
      const originalKey = row.get("KEY")?.trim()
      if (!originalKey) continue

      const normalizedKey = originalKey.toLowerCase()

      if (seenKeys.has(normalizedKey)) {
        // This is a duplicate, rename it
        const count = duplicateCount.get(normalizedKey) ?? 1
        duplicateCount.set(normalizedKey, count + 1)

        const newKey = `${originalKey}_${count + 1}`
        row.set("KEY", newKey)
        await row.save()

        seenKeys.add(newKey.toLowerCase())
      } else {
        seenKeys.add(normalizedKey)
        duplicateCount.set(normalizedKey, 0)
      }
    }
  }

  async autoFixEmptyKeys(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    const rows = await sheet.getRows()
    let emptyKeyIndex = 1

    for (const row of rows) {
      const key = row.get("KEY")?.trim()
      if (!key) {
        row.set("KEY", `auto_key_${emptyKeyIndex}`)
        await row.save()
        emptyKeyIndex++
      }
    }
  }

  async autoFixNoLanguageColumns(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    await sheet.loadHeaderRow()
    const headers = sheet.headerValues ?? []
    const languageColumns = headers.filter(
      (h) => h && h.toLowerCase() !== "key"
    )

    if (languageColumns.length === 0) {
      // Add a default language column
      const newHeaders = [...headers, "English"]
      await sheet.setHeaderRow(newHeaders)

      // Apply formatting to new header
      const headerRowIndex = 0
      const newColIndex = headers.length
      await sheet.loadCells(
        `${String.fromCharCode(65 + newColIndex)}1:${String.fromCharCode(
          65 + newColIndex
        )}1`
      )
      const newHeaderCell = sheet.getCell(headerRowIndex, newColIndex)

      // Copy formatting from KEY column if it exists
      if (headers.length > 0) {
        const keyCell = sheet.getCell(headerRowIndex, 0)
        if (keyCell.backgroundColor) {
          newHeaderCell.backgroundColor = keyCell.backgroundColor
        }
        if (keyCell.textFormat) {
          newHeaderCell.textFormat = keyCell.textFormat
        }
      }

      await sheet.saveUpdatedCells()
    }
  }

  // Enhanced validation that returns fixable issues
  private validateSheetFormatWithFixes(sheet: any): {
    isValid: boolean
    errors: string[]
    fixes: Array<{
      type: "missing_key" | "duplicate_keys" | "empty_keys" | "no_languages"
      title: string
      description: string
      action: string
    }>
  } {
    const errors: string[] = []
    const fixes: Array<{
      type: "missing_key" | "duplicate_keys" | "empty_keys" | "no_languages"
      title: string
      description: string
      action: string
    }> = []

    const headers = sheet.headerValues ?? []

    // Check if sheet has headers
    if (headers.length === 0) {
      errors.push(`Sheet "${sheet.title}" không có headers.`)
      return { isValid: false, errors, fixes }
    }

    // Check for KEY column
    const hasKeyColumn = headers.some(
      (header: string) => header && header.toLowerCase() === "key"
    )

    if (!hasKeyColumn) {
      errors.push(`Sheet "${sheet.title}" thiếu column KEY.`)
      fixes.push({
        type: "missing_key",
        title: "🔧 Thêm Column KEY",
        description: "Tự động thêm column KEY và tạo keys cho các rows hiện có",
        action: "Thêm KEY Column",
      })
    }

    // Check for at least one language column
    const languageColumns = headers.filter(
      (header: string) => header && header.toLowerCase() !== "key"
    )

    if (languageColumns.length === 0) {
      errors.push(
        `Sheet "${sheet.title}" chỉ có column KEY mà không có ngôn ngữ nào.`
      )
      fixes.push({
        type: "no_languages",
        title: "🌍 Thêm Column Ngôn Ngữ",
        description: 'Tự động thêm column "English" làm ngôn ngữ mặc định',
        action: "Thêm Ngôn Ngữ",
      })
    }

    return { isValid: errors.length === 0, errors, fixes }
  }

  private validateParsedDataWithFixes(
    rows: SheetRow[],
    sheetTitle: string
  ): {
    isValid: boolean
    errors: string[]
    fixes: Array<{
      type: "duplicate_keys" | "empty_keys"
      title: string
      description: string
      action: string
    }>
  } {
    const errors: string[] = []
    const fixes: Array<{
      type: "duplicate_keys" | "empty_keys"
      title: string
      description: string
      action: string
    }> = []

    if (rows.length === 0) return { isValid: true, errors, fixes }

    // Check for empty keys
    const emptyKeyRows = rows.filter((row) => !row.key?.trim())
    if (emptyKeyRows.length > 0) {
      errors.push(
        `Sheet "${sheetTitle}": ${emptyKeyRows.length} rows có KEY trống.`
      )
      fixes.push({
        type: "empty_keys",
        title: "🏷️ Sửa KEY Trống",
        description: `Tự động tạo keys cho ${emptyKeyRows.length} rows trống`,
        action: "Sửa KEY Trống",
      })
    }

    // Check for duplicate keys
    const keySet = new Set<string>()
    const duplicateKeys: string[] = []

    rows.forEach((row) => {
      if (!row.key?.trim()) return

      const normalizedKey = row.key.trim().toLowerCase()
      if (keySet.has(normalizedKey)) {
        duplicateKeys.push(row.key)
      } else {
        keySet.add(normalizedKey)
      }
    })

    if (duplicateKeys.length > 0) {
      errors.push(
        `Sheet "${sheetTitle}" có KEY trùng lặp: ${duplicateKeys.join(", ")}`
      )
      fixes.push({
        type: "duplicate_keys",
        title: "🔄 Sửa KEY Trùng Lặp",
        description: `Tự động rename ${duplicateKeys.length} keys bị trùng lặp`,
        action: "Sửa Trùng Lặp",
      })
    }

    return { isValid: errors.length === 0, errors, fixes }
  }

  // Helper method để suggest format fixes
  static generateFormatSuggestion(error: string): string {
    if (
      error.includes("không có headers") ||
      error.includes("row đầu tiên trống")
    ) {
      return `
📋 Cách khắc phục:
1. Mở Google Sheets
2. Thêm row đầu tiên với headers: KEY, English, Vietnamese, ...
3. Row đầu tiên phải có ít nhất 2 columns: KEY và 1 ngôn ngữ
4. Không để row đầu tiên trống

✅ Ví dụ headers đúng:
| KEY     | English | Vietnamese |
|---------|---------|------------|
      `.trim()
    }

    if (error.includes("thiếu column KEY")) {
      return `
📋 Cách khắc phục:
1. Mở Google Sheets
2. Thêm column đầu tiên với tên "KEY" 
3. Điền các key translations vào column này
4. Các columns khác sẽ là tên ngôn ngữ

✅ Ví dụ format đúng:
| KEY     | English | Vietnamese |
|---------|---------|------------|
| hello   | Hello   | Xin chào   |
| goodbye | Goodbye | Tạm biệt   |
      `.trim()
    }

    if (error.includes("trùng lặp")) {
      return `
📋 Cách khắc phục:
1. Kiểm tra và xóa các KEY trùng lặp
2. Đảm bảo mỗi KEY là duy nhất
3. Có thể thêm số vào cuối: hello1, hello2
      `.trim()
    }

    return `
📋 Format mong đợi:
| KEY     | Language1 | Language2 |
|---------|-----------|-----------|
| key1    | value1    | value2    |
| key2    | value3    | value4    |

❌ Tránh:
- Sheet không có headers hoặc row đầu tiên trống
- KEY trống hoặc trùng lặp
- Chỉ có column KEY mà không có ngôn ngữ
    `.trim()
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService()
