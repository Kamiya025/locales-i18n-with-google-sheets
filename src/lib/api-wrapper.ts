import { NextRequest, NextResponse } from "next/server"

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
