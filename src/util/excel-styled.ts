import ExcelJS from "exceljs"

// ─── Design Tokens ─────────────────────────────────────────────────────────
const HEADER_BG = "FF1E40AF"          // Ocean Blue (deep indigo-blue)
const HEADER_FONT = "FFFFFFFF"          // White text
const ALT_ROW_BG = "FFF0F9FF"          // Light sky blue (zebra stripe)
const BORDER_COLOR = "FFB0C4DE"         // Soft blue-grey border
const KEY_COL_BG = "FFF8FAFC"          // Very light slate for KEY column
const KEY_COL_FONT = "FF334155"         // Slate-700
const EMPTY_CELL_BG = "FFFFF7ED"        // Warm amber for empty/untranslated cells
const SHEET_TAB_COLORS = [
    "FF3B82F6", "FF10B981", "FF8B5CF6", "FFF59E0B",
    "FFEF4444", "FF06B6D4", "FFF97316", "FF6366F1",
]

function borderStyle(): Partial<ExcelJS.Borders> {
    const side: Partial<ExcelJS.Border> = { style: "thin", color: { argb: BORDER_COLOR } }
    return { top: side, bottom: side, left: side, right: side }
}

function applyHeaderCell(cell: ExcelJS.Cell, value: string) {
    cell.value = value
    cell.font = { name: "Calibri", bold: true, size: 11, color: { argb: HEADER_FONT } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } }
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: false }
    cell.border = borderStyle()
}

function applyKeyCell(cell: ExcelJS.Cell, value: string) {
    cell.value = value
    cell.font = { name: "Consolas", size: 10, bold: true, color: { argb: KEY_COL_FONT } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: KEY_COL_BG } }
    cell.alignment = { vertical: "middle", horizontal: "left" }
    cell.border = borderStyle()
}

function applyDataCell(cell: ExcelJS.Cell, value: string, isAltRow: boolean) {
    cell.value = value || ""
    const isEmpty = !value || !value.trim()
    cell.font = { name: "Calibri", size: 10, color: { argb: isEmpty ? "FFF97316" : "FF1E293B" } }
    cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEmpty ? EMPTY_CELL_BG : isAltRow ? ALT_ROW_BG : "FFFFFFFF" },
    }
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true }
    cell.border = borderStyle()
}

// ─── Helper: build + download workbook ─────────────────────────────────────
async function downloadWorkbook(wb: ExcelJS.Workbook, fileName: string) {
    const buf = await wb.xlsx.writeBuffer()
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}

// ─── Helper: create a styled data sheet ────────────────────────────────────
function createDataSheet(
    wb: ExcelJS.Workbook,
    sheetTitle: string,
    tabColorArgb: string,
    langs: string[],
    rows: Array<{ key: string; values: Record<string, string> }>
) {
    const ws = wb.addWorksheet(sheetTitle, {
        properties: { tabColor: { argb: tabColorArgb } },
        views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
    })

    const headers = ["KEY", ...langs]
    ws.getColumn(1).width = 40
    langs.forEach((_, i) => { ws.getColumn(i + 2).width = 34 })
    ws.getRow(1).height = 28
    headers.forEach((h, ci) => applyHeaderCell(ws.getCell(1, ci + 1), h))

    rows.forEach(({ key, values }, rowIdx) => {
        const excelRow = rowIdx + 2
        const isAlt = rowIdx % 2 === 1
        ws.getRow(excelRow).height = 20
        applyKeyCell(ws.getCell(excelRow, 1), key)
        langs.forEach((lang, li) => {
            applyDataCell(ws.getCell(excelRow, li + 2), values[lang] || "", isAlt)
        })
    })

    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } }
    return ws
}

// ─── 1. Export SpreadsheetResponse (from Google Sheets or Excel import) ─────
export async function exportSpreadsheetToStyledExcel(
    data: {
        id: string
        title: string
        sheets: Array<{
            sheetId: number
            title: string
            rows: Array<{ rowNumber: number; key: string; data: Record<string, string> }>
        }>
    }
) {
    const wb = new ExcelJS.Workbook()
    wb.creator = "Translate Manager"
    wb.created = new Date()

    data.sheets.forEach((sheet, sheetIdx) => {
        const langs = Array.from(new Set(sheet.rows.flatMap((r) => Object.keys(r.data))))
        createDataSheet(
            wb,
            sheet.title || `Sheet${sheetIdx + 1}`,
            SHEET_TAB_COLORS[sheetIdx % SHEET_TAB_COLORS.length],
            langs,
            sheet.rows.map((r) => ({ key: r.key, values: r.data }))
        )
    })

    await downloadWorkbook(wb, `${data.title || "export"}.xlsx`)
}

// ─── 2. Export Multiple JSON files → 1 styled XLSX (namespace → sheet) ─────
export interface ParsedJsonFile {
    language: string
    data: Record<string, string>  // flat dot-notation keys
}

export async function convertJsonFilesToStyledXlsx(
    files: ParsedJsonFile[],
    outputName = "translations"
) {
    const wb = new ExcelJS.Workbook()
    wb.creator = "Translate Manager"
    wb.created = new Date()

    const langs = files.map((f) => f.language)

    // Collect all keys and group by namespace (first segment before '.')
    const allKeysSet = new Set<string>()
    for (const f of files) Object.keys(f.data).forEach((k) => allKeysSet.add(k))
    const allKeys = Array.from(allKeysSet).sort()

    // namespace → { subKey → fullKey }
    const namespaceMap = new Map<string, Map<string, string>>()
    for (const fullKey of allKeys) {
        const dotIdx = fullKey.indexOf(".")
        const ns = dotIdx !== -1 ? fullKey.slice(0, dotIdx) : "_root"
        const subKey = dotIdx !== -1 ? fullKey.slice(dotIdx + 1) : fullKey
        if (!namespaceMap.has(ns)) namespaceMap.set(ns, new Map())
        namespaceMap.get(ns)!.set(subKey, fullKey)
    }

    const namespaces = Array.from(namespaceMap.keys())

    // One sheet per namespace
    namespaces.forEach((ns, nsIdx) => {
        const subKeyMap = namespaceMap.get(ns)!
        const sheetTitle = ns === "_root" ? "Root" : ns
        const rows = Array.from(subKeyMap.entries()).map(([subKey, fullKey]) => ({
            key: subKey,
            values: Object.fromEntries(files.map((f) => [f.language, f.data[fullKey] || ""])),
        }))
        createDataSheet(wb, sheetTitle, SHEET_TAB_COLORS[nsIdx % SHEET_TAB_COLORS.length], langs, rows)
    })

    await downloadWorkbook(wb, `${outputName}.xlsx`)
}
