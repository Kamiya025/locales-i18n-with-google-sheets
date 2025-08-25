import { NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.spreadsheetId || !body.sheetTitle || !body.fixType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: spreadsheetId, sheetTitle, fixType",
        },
        { status: 400 }
      )
    }

    const { spreadsheetId, sheetTitle, fixType } = body

    // Apply the specific fix
    switch (fixType) {
      case "no_headers":
        await googleSheetsService.autoFixNoHeaders(spreadsheetId, sheetTitle)
        break
      case "missing_key":
        await googleSheetsService.autoFixMissingKeyColumn(
          spreadsheetId,
          sheetTitle
        )
        break
      case "duplicate_keys":
        await googleSheetsService.autoFixDuplicateKeys(
          spreadsheetId,
          sheetTitle
        )
        break
      case "empty_keys":
        await googleSheetsService.autoFixEmptyKeys(spreadsheetId, sheetTitle)
        break
      case "no_languages":
        await googleSheetsService.autoFixNoLanguageColumns(
          spreadsheetId,
          sheetTitle
        )
        break
      default:
        return NextResponse.json(
          { success: false, error: `Unknown fix type: ${fixType}` },
          { status: 400 }
        )
    }

    // Return updated spreadsheet data
    const updatedSpreadsheet = await googleSheetsService.getSpreadsheet(
      spreadsheetId
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
