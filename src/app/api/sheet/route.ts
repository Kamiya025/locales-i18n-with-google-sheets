import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import {
  googleSheetsService,
  GoogleSheetsService,
} from "@/lib/google-sheets.service"
import { GoogleSheetsUserService } from "@/lib/google-sheets-user.service"

export async function POST(req: NextRequest) {
  try {
    const { sheetId } = await req.json()

    if (!sheetId) {
      return NextResponse.json(
        { message: "Missing sheetId parameter" },
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
        spreadsheet = await userService.getSpreadsheet(sheetId)
        authType = "user"
      } else {
        // Fallback to service account (thấp priority)
        spreadsheet = await googleSheetsService.getSpreadsheet(sheetId)
        authType = "service_account"
      }
    } catch (primaryError: any) {
      // Nếu user auth fail, thử fallback service account
      if (authType === "user" && primaryError.response?.status === 403) {
        try {
          spreadsheet = await googleSheetsService.getSpreadsheet(sheetId)
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
      ...spreadsheet,
      _metadata: {
        authType,
        userAuthenticated: !!session,
      },
    })
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
        // Chưa đăng nhập, có thể đăng nhập hoặc thêm quyền service account
        return NextResponse.json(
          {
            message:
              "Không có quyền truy cập file. Vui lòng đăng nhập bằng tài khoản Google hoặc thêm quyền cho email: " +
              process.env.GOOGLE_CLIENT_EMAIL,
            needsAuth: true,
            authType: "none",
          },
          { status: 403 }
        )
      }
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
