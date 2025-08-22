// app/api/sheet/save-row/route.ts
import { NextRequest, NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { SpreadsheetUpdateRowRequest } from "@/models"

export async function POST(req: NextRequest) {
  try {
    const {
      spreadsheetId,
      sheetId,
      row: data,
    } = (await req.json()) as SpreadsheetUpdateRowRequest

    if (!spreadsheetId || !sheetId || !data || !data.rowNumber) {
      return NextResponse.json(
        { success: false, error: "Missing params" },
        { status: 400 }
      )
    }

    // Auth
    const auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    const doc = new GoogleSpreadsheet(spreadsheetId, auth)
    await doc.loadInfo()

    const sheet = doc.sheetsById[sheetId]
    if (!sheet) {
      return NextResponse.json(
        { success: false, error: "Sheet not found" },
        { status: 404 }
      )
    }
    await sheet.loadHeaderRow()
    const rows = await sheet.getRows()

    const row = rows.find((r) => r.rowNumber === data.rowNumber)
    if (!row) {
      return NextResponse.json(
        { success: false, error: "Row not found" },
        { status: 404 }
      )
    }

    // update từng cột trong data.data
    for (const [lang, value] of Object.entries(data.data)) {
      if (sheet.headerValues.includes(lang)) {
        row.set(lang, "" + value)
      } else {
        console.warn(`⚠️ Column ${lang} not in headers`)
      }
    }

    await row.save()
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.response?.status === 403)
      return NextResponse.json(
        {
          message:
            "Chúng tôi không có quyền chỉnh sửa file của bạn,\n vui lòng thêm quyền truy cập cho email: " +
            process.env.GOOGLE_CLIENT_EMAIL,
        },
        { status: 403 }
      )
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
