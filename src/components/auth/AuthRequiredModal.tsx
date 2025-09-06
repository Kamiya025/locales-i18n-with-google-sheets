"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Dialog } from "@/components/ui/dialog"
import Button from "@/components/ui/button"

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
  onSuccess?: () => void
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  message = "Để truy cập file này, bạn cần đăng nhập bằng tài khoản Google.",
  onSuccess,
}: AuthRequiredModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.href,
      })

      if (result?.ok) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="File Google Sheets bị hạn chế"
      icon={
        <div className="mx-auto w-full h-full bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-purple-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-300/30">
          <svg
            className="w-10 h-10 text-blue-600 drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      }
      size="sm"
    >
      {/* Header */}
      <div className="text-center space-y-3 p-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">
          File Google Sheets bị hạn chế
        </h2>
        <p className="text-slate-600 leading-relaxed">
          {message ||
            "File này chỉ có thể truy cập bằng tài khoản Google của bạn."}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/60 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-semibold text-blue-900">
                Tại sao cần đăng nhập?
              </h3>
              <ul className="text-sm text-blue-800 leading-relaxed space-y-1">
                <li>• File này có quyền riêng tư/hạn chế</li>
                <li>• Cần xác thực bằng tài khoản Google của bạn</li>
                <li>• Sau khi đăng nhập, bạn có thể truy cập ngay</li>
                <li>• Chúng tôi chỉ đọc dữ liệu, không thay đổi file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0 space-y-3">
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          variant="primary"
          className="w-full bg-slate-800 hover:bg-slate-900 text-white transition-colors duration-200"
          loading={isLoading}
        >
          {isLoading ? (
            "Đang đăng nhập..."
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Đăng nhập bằng Google</span>
            </div>
          )}
        </Button>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          disabled={isLoading}
        >
          Hủy
        </Button>

        <div className="text-center text-xs text-slate-500 pt-2">
          <p className="leading-relaxed">
            🔒 Ứng dụng sẽ chỉ đọc Google Sheets, không thay đổi hay lưu trữ dữ
            liệu cá nhân.
          </p>
        </div>
      </div>
    </Dialog>
  )
}
