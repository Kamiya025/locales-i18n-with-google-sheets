import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { googleSheetsService } from "@/lib/google-sheets.service"
import { GoogleSheetsUserService } from "@/lib/google-sheets-user.service"

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

export async function POST(req: NextRequest) {
  try {
    const { sheetId, sheetUrl } = await req.json()

    // Accept either sheetId or sheetUrl
    const inputValue = sheetId || sheetUrl
    if (!inputValue) {
      return NextResponse.json(
        { message: "Missing sheetId or sheetUrl parameter" },
        { status: 400 }
      )
    }

    // Extract spreadsheet ID from URL or validate ID
    const spreadsheetId = extractSpreadsheetId(decodeURIComponent(inputValue))
    if (!spreadsheetId) {
      return NextResponse.json(
        { message: "Invalid spreadsheet ID or URL format" },
        { status: 400 }
      )
    }

    // Use same logic as main sheet endpoint - user auth first
    const session = await getServerSession(authOptions)
    let validation
    let authType = "service_account"

    try {
      if (session?.accessToken) {
        const userService = GoogleSheetsUserService.withUserToken(
          session.accessToken
        )
        validation = await userService.getSpreadsheetValidation(spreadsheetId)
        authType = "user"
      } else {
        validation = await googleSheetsService.getSpreadsheetValidation(
          spreadsheetId
        )
        authType = "service_account"
      }
    } catch (primaryError: any) {
      if (authType === "user" && primaryError.response?.status === 403) {
        try {
          validation = await googleSheetsService.getSpreadsheetValidation(
            spreadsheetId
          )
          authType = "service_account_fallback"
        } catch (fallbackError: any) {
          throw primaryError
        }
      } else {
        throw primaryError
      }
    }

    return NextResponse.json(validation)
  } catch (err: any) {
    if (err.response?.status === 403) {
      const session = await getServerSession(authOptions)

      if (session?.accessToken) {
        // User đã đăng nhập nhưng không có quyền
        return NextResponse.json(
          {
            message:
              "Bạn không có quyền truy cập file này. Vui lòng kiểm tra quyền chia sẻ.",
            needsAuth: false,
            authType: "user",
          },
          { status: 403 }
        )
      } else {
        // Chưa đăng nhập, gợi ý đăng nhập
        const response = {
          message:
            "Không có quyền truy cập file. Vui lòng đăng nhập bằng tài khoản Google hoặc thêm quyền cho email: " +
            process.env.GOOGLE_CLIENT_EMAIL,
          needsAuth: true,
          authType: "none",
        }
        return NextResponse.json(response, { status: 403 })
      }
    }

    return NextResponse.json(
      { message: err.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
