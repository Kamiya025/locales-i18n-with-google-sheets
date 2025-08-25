import { NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.spreadsheetId || !body.sheetTitle) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: spreadsheetId, sheetTitle",
        },
        { status: 400 }
      )
    }

    const { spreadsheetId, sheetTitle } = body

    const updatedSpreadsheet = await googleSheetsService.addSheet(
      spreadsheetId,
      sheetTitle
    )

    return NextResponse.json(updatedSpreadsheet)
  } catch (err: any) {
    if (err.response?.status === 403) {
      return NextResponse.json(
        {
          message:
            "Chúng tôi không có quyền chỉnh sửa file của bạn,\n vui lòng thêm quyền truy cập cho email: " +
            process.env.GOOGLE_CLIENT_EMAIL,
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
