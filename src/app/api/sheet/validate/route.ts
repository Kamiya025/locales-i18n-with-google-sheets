import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { googleSheetsService } from "@/lib/google-sheets.service"
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

    // Use same logic as main sheet endpoint - user auth first
    const session = await getServerSession(authOptions)
    let validation
    let authType = "service_account"

    try {
      if (session?.accessToken) {
        const userService = GoogleSheetsUserService.withUserToken(
          session.accessToken
        )
        validation = await userService.getSpreadsheetValidation(sheetId)
        authType = "user"
      } else {
        validation = await googleSheetsService.getSpreadsheetValidation(sheetId)
        authType = "service_account"
      }
    } catch (primaryError: any) {
      if (authType === "user" && primaryError.response?.status === 403) {
        try {
          validation = await googleSheetsService.getSpreadsheetValidation(
            sheetId
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
