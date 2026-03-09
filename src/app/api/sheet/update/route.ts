import { NextRequest, NextResponse } from "next/server"
import { SpreadsheetResponse } from "@/models"
import { executeWithDualAuth, handleDualAuthError } from "@/lib/api-wrapper"

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

    // Execute with dual authentication logic
    await executeWithDualAuth(
      async (service) => {
        await service.syncSpreadsheet(body)
      }
    )

    // Return simple success response for backward compatibility
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return handleDualAuthError(err)
  }
}
