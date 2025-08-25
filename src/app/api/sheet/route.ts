import { NextRequest, NextResponse } from "next/server"
import {
  googleSheetsService,
  GoogleSheetsService,
} from "@/lib/google-sheets.service"

export async function POST(req: NextRequest) {
  try {
    const { sheetId } = await req.json()

    if (!sheetId) {
      return NextResponse.json(
        { message: "Missing sheetId parameter" },
        { status: 400 }
      )
    }

    const spreadsheet = await googleSheetsService.getSpreadsheet(sheetId)

    // Return direct format for backward compatibility
    return NextResponse.json(spreadsheet)
  } catch (err: any) {
    // Use centralized error handling but return old format
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

    // Provide helpful format suggestions for common errors
    const errorMessage = err.message ?? "Unknown error"
    const suggestion =
      GoogleSheetsService.generateFormatSuggestion(errorMessage)

    return NextResponse.json(
      {
        message: errorMessage,
        suggestion: suggestion,
        type: "FORMAT_ERROR",
      },
      { status: 400 }
    )
  }
}
