import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { googleSheetsService } from "@/lib/google-sheets.service"
import { GoogleSheetsUserService } from "@/lib/google-sheets-user.service"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError extends Error {
  status?: number
  code?: string
}

export function createApiError(
  message: string,
  status: number = 500,
  code?: string
): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.code = code
  return error
}

export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error("API Error:", error)

  // Handle Google Sheets permission errors
  if (error.response?.status === 403) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Permission denied",
        message: `Chúng tôi không có quyền truy cập file của bạn,\nvui lòng thêm quyền truy cập cho email: ${process.env.GOOGLE_CLIENT_EMAIL}`,
      },
      { status: 403 }
    )
  }

  // Handle custom API errors
  if (error.status) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.code ?? "API_ERROR",
        message: error.message,
      },
      { status: error.status }
    )
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "VALIDATION_ERROR",
        message: error.message,
      },
      { status: 400 }
    )
  }

  // Generic error
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: "INTERNAL_ERROR",
      message: error.message ?? "Internal server error",
    },
    { status: 500 }
  )
}

export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
    message,
  })
}

export function withErrorHandling<T>(
  handler: (req: NextRequest) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (req: NextRequest): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      return await handler(req)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export function validateRequiredFields(data: any, fields: string[]): void {
  const missing = fields.filter((field) => !data[field])
  if (missing.length > 0) {
    throw createApiError(
      `Missing required fields: ${missing.join(", ")}`,
      400,
      "MISSING_FIELDS"
    )
  }
}

/**
 * Execute a Google Sheets action using Dual Authentication.
 * Prioritizes user authentication (via NextAuth). If it fails with 403,
 * falls back to the local service account authentication.
 */
export async function executeWithDualAuth<T>(
  action: (service: typeof googleSheetsService | typeof GoogleSheetsUserService.prototype, authType: string) => Promise<T>,
  preventFallback?: boolean
): Promise<{ result: T; authType: string }> {
  const session = await getServerSession(authOptions)
  let authType = "service_account"

  try {
    if (session?.accessToken) {
      const userService = GoogleSheetsUserService.withUserToken(session.accessToken)
      const result = await action(userService, "user")
      return { result, authType: "user" }
    } else {
      const result = await action(googleSheetsService, "service_account")
      return { result, authType: "service_account" }
    }
  } catch (primaryError: any) {
    // If user auth fails with 403, fallback to service account (unless disabled)
    if (session?.accessToken && primaryError.response?.status === 403 && !preventFallback) {
      try {
        const result = await action(googleSheetsService, "service_account_fallback")
        return { result, authType: "service_account_fallback" }
      } catch (fallbackError: any) {
        throw primaryError // Throw original error instead of fallback to avoid confusion
      }
    } else {
      throw primaryError
    }
  }
}

/**
 * Standardized error handling for Google Sheets API requests,
 * especially formatting 403 errors depending on user authentication status.
 */
export async function handleDualAuthError(err: any, custom403Message?: string) {
  if (err.response?.status === 403) {
    const session = await getServerSession(authOptions)

    if (session?.accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: custom403Message || "Bạn không có quyền chỉnh sửa file này. Vui lòng kiểm tra quyền chia sẻ.",
          needsAuth: false,
          authType: "user",
        },
        { status: 403 }
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          error: custom403Message || ("Không có quyền truy cập file. Vui lòng đăng nhập bằng tài khoản Google hoặc thêm quyền cho email: " + process.env.GOOGLE_CLIENT_EMAIL),
          needsAuth: true,
          authType: "none",
        },
        { status: 403 }
      )
    }
  }

  if (err.response?.status === 404) {
    return NextResponse.json(
      {
        success: false,
        error: "Không tìm thấy spreadsheet với ID này.",
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { success: false, error: err.message ?? "Unknown error" },
    { status: err.response?.status || 500 }
  )
}

