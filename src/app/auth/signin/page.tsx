"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì redirect về home
    getSession().then((session) => {
      if (session) {
        router.push("/")
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      console.error("Lỗi đăng nhập:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ocean-gradient px-4">
      {/* Background Ocean Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full filter blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/15 rounded-full filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/10 rounded-full filter blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Card
        className="w-full max-w-lg relative z-10 animate-fade-in-up"
        variant="glass"
        size="lg"
        shadow="lg"
        hover={false}
      >
        <div className="text-center space-y-8">
          {/* Header with Logo */}
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-purple-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-300/30 mb-6">
              <span className="text-3xl">🌊</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 drop-shadow-sm">
              Đăng nhập vào ứng dụng
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
              Đăng nhập bằng tài khoản Google để truy cập Google Sheets của bạn
            </p>
          </div>

          {/* Features Card */}
          <div className="bg-white/40 backdrop-blur-sm border border-blue-200/30 p-5 rounded-xl text-sm text-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-xl"></div>
            <div className="relative">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-center">
                <span className="mr-2">✨</span>
                Tính năng nổi bật
              </h3>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">📊</span>
                  <span>Quản lý bản dịch</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">🔄</span>
                  <span>Đồng bộ realtime</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">🛡️</span>
                  <span>Bảo mật cao</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">⚡</span>
                  <span>Xử lý nhanh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="primary"
              size="lg"
              className="w-full group"
              loading={isLoading}
            >
              {isLoading ? (
                "Đang đăng nhập..."
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                  >
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
                  <span className="font-semibold">Đăng nhập bằng Google</span>
                </div>
              )}
            </Button>

            {/* Privacy Note */}
            <div className="text-xs text-slate-500 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-blue-200/20">
              <div className="space-y-2">
                <p className="flex items-center justify-center">
                  <span className="mr-2">🔒</span>
                  <span className="font-medium">Chính sách bảo mật</span>
                </p>
                <p className="leading-relaxed">
                  Ứng dụng sẽ chỉ đọc Google Sheets, không thay đổi hay lưu trữ
                  dữ liệu cá nhân.
                </p>
                <p className="leading-relaxed">
                  Bạn có thể thu hồi quyền truy cập bất cứ lúc nào trong cài đặt
                  Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
