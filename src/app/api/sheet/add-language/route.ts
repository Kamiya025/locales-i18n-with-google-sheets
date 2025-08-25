import { NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.spreadsheetId || !body.languageName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: spreadsheetId, languageName",
        },
        { status: 400 }
      )
    }

    const { spreadsheetId, languageName } = body

    const updatedSpreadsheet = await googleSheetsService.addLanguageColumn(
      spreadsheetId,
      languageName
    )

    // Return direct format for backward compatibility
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
