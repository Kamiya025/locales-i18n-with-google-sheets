// models/sheet.ts
export interface SheetInfo {
  title: string
  rowCount: number
  columnCount: number
}
export interface SheetRowData {
  rowNumber: number
  key: string
  data: Record<string, string> // vi, en, ja,...
}
export interface SpreadsheetItem {
  sheetId: number
  title: string
  rows: SheetRowData[]
}
export interface SpreadsheetResponse {
  id: string
  title: string
  sheets: SpreadsheetItem[]
}

export interface SpreadsheetUpdateRowRequest {
  spreadsheetId: string
  sheetId: number
  row: SheetRowData
}
