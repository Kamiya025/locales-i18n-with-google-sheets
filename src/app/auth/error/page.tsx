"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import Link from "next/link"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorInfo = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return {
          title: "Quyền truy cập bị từ chối",
          description:
            "Bạn đã từ chối cấp quyền truy cập. Vui lòng thử lại và chấp nhận quyền truy cập Google Sheets để tiếp tục sử dụng dịch vụ.",
          icon: "access-denied",
          suggestion: "Hãy đảm bảo chấp nhận tất cả quyền cần thiết khi đăng nhập lại.",
        }
      case "OAuthSignin":
      case "OAuthCallback":
        return {
          title: "Lỗi OAuth",
          description:
            "Có lỗi xảy ra trong quá trình đăng nhập với Google. Điều này có thể do kết nối mạng hoặc cấu hình OAuth.",
          icon: "oauth-error",
          suggestion: "Thử đăng nhập lại sau vài phút hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục.",
        }
      case "Configuration":
        return {
          title: "Lỗi cấu hình",
          description:
            "Ứng dụng chưa được cấu hình đúng. Đây là lỗi từ phía hệ thống.",
          icon: "config-error",
          suggestion: "Vui lòng liên hệ quản trị viên để khắc phục vấn đề này.",
        }
      default:
        return {
          title: "Lỗi đăng nhập",
          description: "Có lỗi không xác định xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.",
          icon: "general-error",
          suggestion: "Kiểm tra kết nối mạng và thử lại sau vài phút.",
        }
    }
  }

  const getErrorIcon = (iconType: string) => {
    switch (iconType) {
      case "access-denied":
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636A9 9 0 005.636 18.364m12.728-12.728A9 9 0 015.636 18.364" />
          </svg>
        )
      case "oauth-error":
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        )
      case "config-error":
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )
    }
  }

  const errorInfo = getErrorInfo(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
      <Card className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center space-y-4 p-8 pb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-200/50">
            {getErrorIcon(errorInfo.icon)}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {errorInfo.title}
            </h1>
            <p className="text-slate-600 leading-relaxed">
              {errorInfo.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-6">
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/60 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-semibold text-blue-900">Gợi ý</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {errorInfo.suggestion}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Mã lỗi: {error}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-3 p-8 pt-0">
          <Link href="/auth/signin" className="block">
            <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Thử đăng nhập lại
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </Button>
          </Link>

          <div className="text-center text-sm text-slate-500 pt-2">
            <p>Cần hỗ trợ? Liên hệ <span className="font-medium text-slate-700">hawk01525@gmail.com</span></p>
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
