import { NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets.service"
import { SpreadsheetResponse } from "@/models"

/**
 * Cập nhật dữ liệu vào Google Sheets (sync toàn bộ spreadsheet)
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpreadsheetResponse

    if (!body.id || !body.sheets) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    await googleSheetsService.syncSpreadsheet(body)

    // Return simple success response for backward compatibility
    return NextResponse.json({ success: true })
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
