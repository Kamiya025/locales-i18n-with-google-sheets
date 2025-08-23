// app/api/sheet/save-row/route.ts
import { NextRequest, NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { SpreadsheetResponse, SpreadsheetUpdateRowRequest } from "@/models"

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

    await sheet.addRows([
      {
        KEY: data.key,
        ...data.data,
      },
    ])

    const sheets = await Promise.all(
      doc.sheetsByIndex.map(async (sheet) => {
        const rows = await sheet.getRows()
        const parsed = rows.map((row, index) => {
          const obj: Record<string, string> = {}
          let key = ""
          const rowNumber = row.rowNumber
          sheet.headerValues.forEach((header) => {
            const normalized = header.toLowerCase()
            if (normalized === "key") {
              key = row.get(header)
            } else {
              obj[header] = row.get(header) ?? ""
            }
          })

          return { rowNumber, key, data: obj }
        })

        return {
          sheetId: sheet.sheetId,
          title: sheet.title,
          rows: parsed,
        }
      })
    )

    const response: SpreadsheetResponse = {
      title: doc.title,
      id: spreadsheetId,
      sheets,
    }

    return NextResponse.json(response)
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
