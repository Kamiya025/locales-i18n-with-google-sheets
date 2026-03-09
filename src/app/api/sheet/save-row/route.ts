import { NextRequest, NextResponse } from "next/server"
import { SpreadsheetUpdateRowRequest } from "@/models"
import { executeWithDualAuth, handleDualAuthError } from "@/lib/api-wrapper"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpreadsheetUpdateRowRequest

    if (
      !body.spreadsheetId ||
      !body.sheetId ||
      !body.row?.rowNumber ||
      !body.row?.data
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { spreadsheetId, sheetId, row } = body

    // Execute with dual authentication logic
    await executeWithDualAuth(
      async (service) => {
        await service.updateRow(
          spreadsheetId,
          sheetId,
          row.rowNumber,
          row.data
        )
      }
    )

    // Return simple success response for backward compatibility
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return handleDualAuthError(err)
  }
}
