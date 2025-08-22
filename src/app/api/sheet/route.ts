import { NextRequest, NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { SpreadsheetResponse } from "@/models"

export async function POST(req: NextRequest) {
  const { sheetId } = await req.json()

  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth)

    await doc.loadInfo()
    // Lấy danh sách sheet

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
      id: sheetId,
      sheets,
    }

    return NextResponse.json(response)
  } catch (err: any) {
    if (err.response?.status === 403)
      return NextResponse.json(
        {
          message:
            "Chúng tôi không có quyền truy cập file của bạn,\n vui lòng thêm quyền truy cập cho email:" +
            process.env.GOOGLE_CLIENT_EMAIL,
        },
        { status: 403 }
      )
    return NextResponse.json(
      { message: err.message || "Unknown error" },
      { status: 500 }
    )
  }
}
