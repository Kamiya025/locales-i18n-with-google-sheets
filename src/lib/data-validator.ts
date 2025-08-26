import { SpreadsheetResponse, SpreadsheetItem, SheetRowData } from "@/models"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data?: SpreadsheetResponse
}

export class DataValidator {
  static validateSpreadsheetResponse(data: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic structure validation
    if (!data || typeof data !== "object") {
      return {
        isValid: false,
        errors: ["Data is null or not an object"],
        warnings: [],
      }
    }

    // Required fields
    if (!data.id || typeof data.id !== "string") {
      errors.push("Missing or invalid spreadsheet ID")
    }

    if (!data.title || typeof data.title !== "string") {
      errors.push("Missing or invalid spreadsheet title")
    }

    // Sheets validation
    if (!Array.isArray(data.sheets)) {
      errors.push("Sheets must be an array")
    } else {
      data.sheets.forEach((sheet: any, index: number) => {
        const sheetErrors = this.validateSheet(sheet, index)
        errors.push(...sheetErrors.errors)
        warnings.push(...sheetErrors.warnings)
      })
    }

    // Normalize data if valid
    let normalizedData: SpreadsheetResponse | undefined
    if (errors.length === 0) {
      normalizedData = this.normalizeSpreadsheetData(data)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data: normalizedData,
    }
  }

  private static validateSheet(
    sheet: any,
    index: number
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!sheet || typeof sheet !== "object") {
      errors.push(`Sheet ${index}: Invalid sheet object`)
      return { errors, warnings }
    }

    // Required sheet fields
    if (typeof sheet.sheetId !== "number") {
      errors.push(`Sheet ${index}: Missing or invalid sheetId`)
    }

    if (!sheet.title || typeof sheet.title !== "string") {
      errors.push(`Sheet ${index}: Missing or invalid title`)
    }

    // Rows validation
    if (!Array.isArray(sheet.rows)) {
      errors.push(`Sheet ${index}: Rows must be an array`)
    } else {
      sheet.rows.forEach((row: any, rowIndex: number) => {
        const rowErrors = this.validateRow(row, index, rowIndex)
        errors.push(...rowErrors.errors)
        warnings.push(...rowErrors.warnings)
      })

      if (sheet.rows.length === 0) {
        warnings.push(`Sheet ${index} "${sheet.title}": No rows found`)
      }
    }

    return { errors, warnings }
  }

  private static validateRow(
    row: any,
    sheetIndex: number,
    rowIndex: number
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!row || typeof row !== "object") {
      errors.push(`Sheet ${sheetIndex}, Row ${rowIndex}: Invalid row object`)
      return { errors, warnings }
    }

    // Required row fields
    if (typeof row.rowNumber !== "number") {
      errors.push(
        `Sheet ${sheetIndex}, Row ${rowIndex}: Missing or invalid rowNumber`
      )
    }

    if (!row.key || typeof row.key !== "string") {
      errors.push(
        `Sheet ${sheetIndex}, Row ${rowIndex}: Missing or invalid key`
      )
    }

    if (!row.data || typeof row.data !== "object") {
      errors.push(
        `Sheet ${sheetIndex}, Row ${rowIndex}: Missing or invalid data object`
      )
    } else {
      // Check if all values are strings
      Object.entries(row.data).forEach(([lang, value]) => {
        if (typeof value !== "string") {
          warnings.push(
            `Sheet ${sheetIndex}, Row ${rowIndex}: Language "${lang}" value is not a string`
          )
        }
      })

      // Check for empty translations
      const emptyLangs = Object.entries(row.data)
        .filter(
          ([_, value]) => !value || (typeof value === "string" && !value.trim())
        )
        .map(([lang]) => lang)

      if (emptyLangs.length > 0) {
        warnings.push(
          `Sheet ${sheetIndex}, Row ${rowIndex}: Empty translations for languages: ${emptyLangs.join(
            ", "
          )}`
        )
      }
    }

    return { errors, warnings }
  }

  private static normalizeSpreadsheetData(data: any): SpreadsheetResponse {
    return {
      id: String(data.id),
      title: String(data.title),
      sheets: data.sheets.map(
        (sheet: any): SpreadsheetItem => ({
          sheetId: Number(sheet.sheetId),
          title: String(sheet.title),
          rows: sheet.rows.map(
            (row: any): SheetRowData => ({
              rowNumber: Number(row.rowNumber),
              key: String(row.key).trim(),
              data: Object.fromEntries(
                Object.entries(row.data).map(([lang, value]) => [
                  lang,
                  String(value || ""),
                ])
              ),
            })
          ),
        })
      ),
    }
  }

  static logValidationResult(
    result: ValidationResult,
    context: string = "Data validation"
  ): void {
    // Validation logging removed for production
  }
}
