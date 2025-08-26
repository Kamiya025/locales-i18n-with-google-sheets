import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { googleSheetsService } from "@/lib/google-sheets.service"
import { GoogleSheetsUserService } from "@/lib/google-sheets-user.service"

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

    // Dual authentication: ưu tiên user auth, fallback service account
    const session = await getServerSession(authOptions)
    let authType = "service_account"
    let service = googleSheetsService

    if (session?.accessToken) {
      service = GoogleSheetsUserService.withUserToken(session.accessToken)
      authType = "user"
    }

    try {
      // Apply the specific fix
      switch (fixType) {
        case "no_headers":
          await service.autoFixNoHeaders(spreadsheetId, sheetTitle)
          break
        case "missing_key":
          await service.autoFixMissingKeyColumn(spreadsheetId, sheetTitle)
          break
        case "duplicate_keys":
          await service.autoFixDuplicateKeys(spreadsheetId, sheetTitle)
          break
        case "empty_keys":
          await service.autoFixEmptyKeys(spreadsheetId, sheetTitle)
          break
        case "no_languages":
          await service.autoFixNoLanguageColumns(spreadsheetId, sheetTitle)
          break
        default:
          return NextResponse.json(
            { success: false, error: `Unknown fix type: ${fixType}` },
            { status: 400 }
          )
      }
    } catch (primaryError: any) {
      // Nếu user auth fail, thử fallback service account
      if (authType === "user" && primaryError.response?.status === 403) {
        try {
          // Retry with service account
          switch (fixType) {
            case "no_headers":
              await googleSheetsService.autoFixNoHeaders(
                spreadsheetId,
                sheetTitle
              )
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
              await googleSheetsService.autoFixEmptyKeys(
                spreadsheetId,
                sheetTitle
              )
              break
            case "no_languages":
              await googleSheetsService.autoFixNoLanguageColumns(
                spreadsheetId,
                sheetTitle
              )
              break
          }
          authType = "service_account_fallback"
        } catch (fallbackError: any) {
          // Cả hai đều fail, throw error gốc
          throw primaryError
        }
      } else {
        throw primaryError
      }
    }

    // Return updated spreadsheet data
    const updatedSpreadsheet = await (authType.includes("service_account")
      ? googleSheetsService.getSpreadsheet(spreadsheetId)
      : service.getSpreadsheet(spreadsheetId))
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
