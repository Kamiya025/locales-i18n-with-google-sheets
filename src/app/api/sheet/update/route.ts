// app/api/sync/route.ts
import { NextRequest, NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { SpreadsheetResponse } from "@/models"

/**
 * Cập nhật dữ liệu vào Google Sheets
 * @param req
 * @returns
 */

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SpreadsheetResponse
  try {
    // Auth service account
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    const doc = new GoogleSpreadsheet(body.id, serviceAccountAuth)
    await doc.loadInfo()

    // Lặp qua từng sheet
    for (const sheetData of body.sheets) {
      const sheet = doc.sheetsByTitle[sheetData.title]
      if (!sheet) continue

      // Lấy rows hiện tại
      const rows = await sheet.getRows()

      // Map: key -> row (ép kiểu để tránh lỗi TS7053)
      const rowMap = new Map<string, (typeof rows)[number]>()
      for (const r of rows) {
        const key = (r as any).key as string | undefined
        if (key) {
          rowMap.set(key, r)
        }
      }

      // Cập nhật
      for (const row of sheetData.rows) {
        const existing = rowMap.get(row.key)
        if (existing) {
          // update từng cột
          for (const [lang, value] of Object.entries(row.data)) {
            ;(existing as any)[lang] = value
          }
          await existing.save()
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Sync error:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
