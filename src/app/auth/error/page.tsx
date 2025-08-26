"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import Link from "next/link"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return {
          title: "Quyền truy cập bị từ chối",
          description:
            "Bạn đã từ chối cấp quyền truy cập. Vui lòng thử lại và chấp nhận quyền truy cập Google Sheets.",
        }
      case "OAuthSignin":
      case "OAuthCallback":
        return {
          title: "Lỗi OAuth",
          description:
            "Có lỗi xảy ra trong quá trình đăng nhập với Google. Vui lòng thử lại.",
        }
      case "Configuration":
        return {
          title: "Lỗi cấu hình",
          description:
            "Ứng dụng chưa được cấu hình đúng. Vui lòng liên hệ quản trị viên.",
        }
      default:
        return {
          title: "Lỗi đăng nhập",
          description: "Có lỗi không xác định xảy ra. Vui lòng thử lại sau.",
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="text-red-500">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {errorInfo.title}
            </h1>
            <p className="mt-2 text-gray-600">{errorInfo.description}</p>
            {error && (
              <p className="mt-2 text-sm text-gray-400">Mã lỗi: {error}</p>
            )}
          </div>

          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Thử đăng nhập lại
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Về trang chủ
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            <p>Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
