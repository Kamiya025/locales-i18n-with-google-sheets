import { NextRequest, NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets.service"

interface FixRequest {
  sheetTitle: string
  fixType: string
}

interface BatchAutoFixRequest {
  spreadsheetId: string
  fixes: FixRequest[]
}

export async function POST(req: NextRequest) {
  try {
    const body: BatchAutoFixRequest = await req.json()

    if (!body.spreadsheetId || !body.fixes || !Array.isArray(body.fixes)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: spreadsheetId, fixes array",
        },
        { status: 400 }
      )
    }

    const { spreadsheetId, fixes } = body
    const results: Array<{
      success: boolean
      fixType: string
      sheetTitle: string
      error?: string
    }> = []

    // Process fixes in parallel for better performance
    const fixPromises = fixes.map(async (fix) => {
      try {
        await applyFix(spreadsheetId, fix.sheetTitle, fix.fixType)
        return {
          success: true,
          fixType: fix.fixType,
          sheetTitle: fix.sheetTitle,
        }
      } catch (error: any) {
        return {
          success: false,
          fixType: fix.fixType,
          sheetTitle: fix.sheetTitle,
          error: error.message || "Unknown error occurred",
        }
      }
    })

    const fixResults = await Promise.allSettled(fixPromises)

    // Process results
    fixResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        results.push(result.value)
      } else {
        results.push({
          success: false,
          fixType: fixes[index].fixType,
          sheetTitle: fixes[index].sheetTitle,
          error: result.reason?.message || "Fix failed",
        })
      }
    })

    // Return updated spreadsheet data and fix results
    const updatedSpreadsheet = await googleSheetsService.getSpreadsheet(
      spreadsheetId
    )

    return NextResponse.json({
      success: true,
      data: updatedSpreadsheet,
      results,
      summary: {
        total: fixes.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      },
    })
  } catch (err: any) {
    if (err.response?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Chúng tôi không có quyền chỉnh sửa file của bạn,\n vui lòng thêm quyền truy cập cho email: " +
            process.env.GOOGLE_CLIENT_EMAIL,
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message ?? "Unknown error occurred during batch fix",
      },
      { status: 500 }
    )
  }
}

async function applyFix(
  spreadsheetId: string,
  sheetTitle: string,
  fixType: string
) {
  switch (fixType) {
    case "no_headers":
      return await googleSheetsService.autoFixNoHeaders(
        spreadsheetId,
        sheetTitle
      )
    case "missing_key":
      return await googleSheetsService.autoFixMissingKeyColumn(
        spreadsheetId,
        sheetTitle
      )
    case "duplicate_keys":
      return await googleSheetsService.autoFixDuplicateKeys(
        spreadsheetId,
        sheetTitle
      )
    case "empty_keys":
      return await googleSheetsService.autoFixEmptyKeys(
        spreadsheetId,
        sheetTitle
      )
    case "no_languages":
      return await googleSheetsService.autoFixNoLanguageColumns(
        spreadsheetId,
        sheetTitle
      )
    default:
      throw new Error(`Unknown fix type: ${fixType}`)
  }
}
