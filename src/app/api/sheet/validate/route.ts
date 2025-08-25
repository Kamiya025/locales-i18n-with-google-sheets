import { NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets.service"

export async function POST(req: NextRequest) {
  try {
    const { sheetId } = await req.json()

    if (!sheetId) {
      return NextResponse.json(
        { message: "Missing sheetId parameter" },
        { status: 400 }
      )
    }

    const validation = await googleSheetsService.getSpreadsheetValidation(
      sheetId
    )

    return NextResponse.json(validation)
  } catch (err: any) {
    if (err.response?.status === 403) {
      return NextResponse.json(
        {
          message:
            "Chúng tôi không có quyền truy cập file của bạn,\n vui lòng thêm quyền truy cập cho email: " +
            process.env.GOOGLE_CLIENT_EMAIL,
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { message: err.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
