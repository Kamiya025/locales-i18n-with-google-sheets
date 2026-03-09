import * as XLSX from "xlsx"

/**
 * Flatten a nested JSON object to dot-notation keys.
 * e.g. { home: { title: "Hello" } } → { "home.title": "Hello" }
 */
function flattenJson(
    obj: Record<string, any>,
    prefix = ""
): Record<string, string> {
    const result: Record<string, string> = {}

    for (const key of Object.keys(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key
        const value = obj[key]

        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenJson(value, newKey))
        } else {
            result[newKey] = String(value ?? "")
        }
    }

    return result
}

export interface ParsedJsonFile {
    language: string   // e.g. "vi"
    data: Record<string, string>  // flattened { "key": "value" }
}

/**
 * Parse a JSON i18n file (supports flat or nested structure).
 */
export async function parseJsonFile(file: File): Promise<ParsedJsonFile> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const raw = JSON.parse(e.target?.result as string)

                // Detect if the top-level keys are namespaces (objects) or regular keys
                // If first value is an object → file is { namespace: { key: value } }
                // If first value is a string → file is { key: value } (flat)
                let flattened: Record<string, string>

                const firstVal = Object.values(raw)[0]
                if (firstVal !== null && typeof firstVal === "object" && !Array.isArray(firstVal)) {
                    // namespace-grouped: { home: { title: "..." }, cart: { ... } }
                    flattened = flattenJson(raw)
                } else {
                    // flat: { "key": "value" }
                    flattened = Object.fromEntries(
                        Object.entries(raw).map(([k, v]) => [k, String(v ?? "")])
                    )
                }

                // Language name = filename without extension
                const language = file.name.replace(/\.[^/.]+$/, "").toLowerCase()
                resolve({ language, data: flattened })
            } catch (err) {
                reject(new Error(`Lỗi đọc file ${file.name}: không phải JSON hợp lệ`))
            }
        }
        reader.onerror = () => reject(new Error(`Không thể đọc file ${file.name}`))
        reader.readAsText(file, "utf-8")
    })
}

/**
 * Convert an array of parsed JSON files into a downloadable XLSX.
 * Each language becomes a column. Each unique key is a row.
 */
export function convertJsonFilesToXlsx(files: ParsedJsonFile[], outputName = "translations") {
    // Collect all unique keys (preserving order of first appearance)
    const allKeysSet = new Set<string>()
    for (const f of files) {
        for (const k of Object.keys(f.data)) {
            allKeysSet.add(k)
        }
    }
    const allKeys = Array.from(allKeysSet).sort()

    // Build header row
    const langs = files.map((f) => f.language)
    const headers = ["KEY", ...langs]

    // Build data rows
    const rows: string[][] = allKeys.map((key) => {
        const row: string[] = [key]
        for (const f of files) {
            row.push(f.data[key] ?? "")
        }
        return row
    })

    // Create worksheet
    const wsData = [headers, ...rows]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Column widths (auto-fit rough estimate)
    ws["!cols"] = headers.map((_, i) =>
        i === 0 ? { wch: 40 } : { wch: 30 }
    )

    // Style header row bold (limited support in SheetJS community edition)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Translations")

    XLSX.writeFile(wb, `${outputName}.xlsx`)
}
