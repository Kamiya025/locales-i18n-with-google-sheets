import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { googleSheetsService } from "@/lib/google-sheets.service"
import { GoogleSheetsUserService } from "@/lib/google-sheets-user.service"
import { SpreadsheetUpdateRowRequest } from "@/models"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpreadsheetUpdateRowRequest

    if (
      !body.spreadsheetId ||
      !body.sheetId ||
      !body.row?.key ||
      !body.row?.data
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { spreadsheetId, sheetId, row } = body

    // Dual authentication: ưu tiên user auth, fallback service account
    const session = await getServerSession(authOptions)
    let authType = "service_account"
    let updatedSpreadsheet

    try {
      // Try user auth FIRST
      if (session?.accessToken) {
        const userService = GoogleSheetsUserService.withUserToken(
          session.accessToken
        )
        updatedSpreadsheet = await userService.addRowToSheet(
          spreadsheetId,
          sheetId,
          {
            key: row.key,
            data: row.data,
          }
        )
        authType = "user"
      } else {
        // Fallback to service account
        updatedSpreadsheet = await googleSheetsService.addRowToSheet(
          spreadsheetId,
          sheetId,
          {
            key: row.key,
            data: row.data,
          }
        )
        authType = "service_account"
      }
    } catch (primaryError: any) {
      // Nếu user auth fail, thử fallback service account
      if (authType === "user" && primaryError.response?.status === 403) {
        try {
          updatedSpreadsheet = await googleSheetsService.addRowToSheet(
            spreadsheetId,
            sheetId,
            {
              key: row.key,
              data: row.data,
            }
          )
          authType = "service_account_fallback"
        } catch (fallbackError: any) {
          // Cả hai đều fail, throw error gốc
          throw primaryError
        }
      } else {
        throw primaryError
      }
    }

    // Return direct format for backward compatibility
    return NextResponse.json(updatedSpreadsheet)
  } catch (err: any) {
    if (err.response?.status === 403) {
      const session = await getServerSession(authOptions)

      if (session?.accessToken) {
        // User đã đăng nhập nhưng không có quyền
        return NextResponse.json(
          {
            success: false,
            error:
              "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ.",
            needsAuth: false,
            authType: "user",
          },
          { status: 403 }
        )
      } else {
        // Chưa đăng nhập
        return NextResponse.json(
          {
            success: false,
            error:
              "Không có quyền truy cập file. Vui lòng đăng nhập bằng tài khoản Google hoặc thêm quyền cho email: " +
              process.env.GOOGLE_CLIENT_EMAIL,
            needsAuth: true,
            authType: "none",
          },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
