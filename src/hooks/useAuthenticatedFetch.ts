"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { customToast } from "@/components/ui/toast"

interface AuthError {
  message: string
  needsAuth: boolean
  authType: "user" | "service_account" | "none"
}

export const useAuthenticatedFetch = (onRetry?: () => void) => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const { data: session, status } = useSession()

  // Kiểm tra nếu session có lỗi refresh token, tự động hiển thị auth modal
  React.useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      setAuthError({
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        needsAuth: true,
        authType: "user",
      })
      setShowAuthModal(true)
    }
  }, [session?.error])

  const handleAuthError = (error: any) => {
    console.log("🔐 handleAuthError called with:", error)

    if (error.response?.status === 403) {
      const data = error.response.data || {}
      console.log("🔐 403 error data:", data)

      // Always show auth modal for 403 errors, regardless of needsAuth flag
      setAuthError({
        message:
          data.message ||
          "Bạn không có quyền truy cập file này. Vui lòng đăng nhập để tiếp tục.",
        needsAuth: data.needsAuth !== false, // Default to true unless explicitly false
        authType: data.authType || "none",
      })
      setShowAuthModal(true)
      console.log("🔐 Auth modal should be visible now")
      return true // Đã xử lý error
    }

    return false // Chưa xử lý error, để caller xử lý tiếp
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
    setAuthError(null)
  }

  const onAuthSuccess = () => {
    closeAuthModal()
    customToast.success("Đăng nhập thành công!")

    // Auto-retry the failed request only if onRetry is provided
    if (onRetry) {
      setTimeout(() => {
        onRetry()
      }, 500) // Small delay to let session update
    }
    // Removed auto-reload - let user decide to refresh manually if needed
  }

  return {
    session,
    sessionStatus: status,
    showAuthModal,
    authError,
    handleAuthError,
    closeAuthModal,
    onAuthSuccess,
    isAuthenticated: !!session,
  }
}
