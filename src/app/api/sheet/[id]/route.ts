import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { googleSheetsService } from "@/lib/google-sheets.service"
import { GoogleSheetsUserService } from "@/lib/google-sheets-user.service"
import { authOptions } from "@/lib/auth"

/**
 * Extract spreadsheet ID từ Google Sheets URL hoặc trả về input nếu đã là ID
 */
function extractSpreadsheetId(input: string): string | null {
  // Nếu input chứa URL Google Sheets, extract ID
  if (input.includes("docs.google.com/spreadsheets")) {
    const match = input.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match?.[1] || null
  }

  // Nếu không phải URL, kiểm tra xem có phải là ID hợp lệ không
  const idPattern = /^[a-zA-Z0-9-_]+$/
  if (idPattern.test(input) && input.length > 10) {
    return input
  }

  return null
}

/**
 * GET /api/sheet/[id] - Lấy thông tin spreadsheet theo ID hoặc URL
 * Hỗ trợ:
 * - /api/sheet/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
 * - /api/sheet/https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url)
    const urlParam = searchParams.get("url") // Cho phép truyền URL qua query param

    // Await params trước khi sử dụng (Next.js 15 requirement)
    const resolvedParams = await params

    // Ưu tiên URL từ query param, nếu không có thì dùng params.id
    const inputValue = urlParam || resolvedParams.id

    if (!inputValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing spreadsheet ID or URL parameter",
        },
        { status: 400 }
      )
    }

    // Extract spreadsheet ID từ URL hoặc validate ID
    const spreadsheetId = extractSpreadsheetId(decodeURIComponent(inputValue))

    if (!spreadsheetId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid spreadsheet ID or URL format",
        },
        { status: 400 }
      )
    }

    // Ưu tiên user auth trước, service account sau (fallback)
    let spreadsheet
    let authType = "service_account"
    const session = await getServerSession(authOptions)

    try {
      // Try user auth FIRST (cao priority)
      if (session?.accessToken) {
        const userService = GoogleSheetsUserService.withUserToken(
          session.accessToken
        )
        spreadsheet = await userService.getSpreadsheet(spreadsheetId)
        authType = "user"
      } else {
        // Fallback to service account (thấp priority)
        spreadsheet = await googleSheetsService.getSpreadsheet(spreadsheetId)
        authType = "service_account"
      }
    } catch (primaryError: any) {
      // Nếu user auth fail, thử fallback service account
      if (authType === "user" && primaryError.response?.status === 403) {
        try {
          spreadsheet = await googleSheetsService.getSpreadsheet(spreadsheetId)
          authType = "service_account_fallback"
        } catch (fallbackError: any) {
          // Cả hai đều fail, throw error gốc
          throw primaryError
        }
      } else {
        throw primaryError
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...spreadsheet,
        _metadata: {
          authType,
          userAuthenticated: !!session,
        },
      },
    })
  } catch (err: any) {
    console.error("Error fetching spreadsheet:", err)

    if (err.response?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Không có quyền truy cập spreadsheet này. Vui lòng đăng nhập hoặc kiểm tra quyền.",
          needsAuth: !err.response?.data?.userAuthenticated,
          authType: err.response?.data?.authType || "none",
        },
        { status: 403 }
      )
    }

    if (err.response?.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy spreadsheet với ID này.",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi khi tải spreadsheet.",
      },
      { status: 500 }
    )
  }
}
