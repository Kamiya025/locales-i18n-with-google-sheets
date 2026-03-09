import * as XLSX from "xlsx"
import { SpreadsheetResponse, SpreadsheetItem, SheetRowData } from "@/models"

export async function parseExcelToSpreadsheetResponse(
    file: File
): Promise<SpreadsheetResponse> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target?.result
                const workbook = XLSX.read(data, { type: "binary" })

                const sheets: SpreadsheetItem[] = []

                workbook.SheetNames.forEach((sheetName, index) => {
                    const worksheet = workbook.Sheets[sheetName]
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

                    if (!jsonData || jsonData.length === 0) return

                    // Assume row 0 is headers
                    const headers = jsonData[0] || []
                    if (headers.length === 0) return

                    // Column 0 is translation key, column 1..n are languages
                    const keyHeaderStr = String(headers[0] || "").toLowerCase()
                    // We can proceed even if it's not strictly "key"

                    const langHeaders: { index: number; lang: string }[] = []
                    for (let i = 1; i < headers.length; i++) {
                        if (headers[i]) {
                            langHeaders.push({ index: i, lang: String(headers[i]).trim() })
                        }
                    }

                    const rows: SheetRowData[] = []
                    for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
                        const rowArr = jsonData[rowIndex]
                        if (!rowArr || rowArr.length === 0) continue

                        const key = String(rowArr[0] || "").trim()
                        if (!key) continue // Skip empty keys

                        const rowData: Record<string, string> = {}
                        langHeaders.forEach((lh) => {
                            rowData[lh.lang] = String(rowArr[lh.index] || "").trim()
                        })

                        rows.push({
                            rowNumber: rowIndex + 1, // 1-based in google sheets, +1 for 0-index array but skipped header
                            key,
                            data: rowData,
                        })
                    }

                    sheets.push({
                        sheetId: index + 1000, // mock ID
                        title: sheetName,
                        rows,
                    })
                })

                resolve({
                    id: "local-excel",
                    title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                    sheets,
                })
            } catch (err) {
                reject(err)
            }
        }
        reader.readAsBinaryString(file)
    })
}

export function exportSpreadsheetToExcel(data: SpreadsheetResponse) {
    const workbook = XLSX.utils.book_new()

    data.sheets.forEach(sheet => {
        // Collect all languages used in this sheet
        const languages = Array.from(new Set(sheet.rows.flatMap(r => Object.keys(r.data))))
        const headers = ["KEY", ...languages]

        // Prepare sheet data starting with header row
        const sheetData: any[][] = [headers]

        sheet.rows.forEach(row => {
            const rowData: any[] = [row.key]
            languages.forEach(lang => {
                rowData.push(row.data[lang] || "") // Push value or empty string
            })
            sheetData.push(rowData)
        })

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.title || "Sheet1")
    })

    // Trigger file download
    XLSX.writeFile(workbook, `${data.title || 'Export'}.xlsx`)
}
