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
    if (error.response?.status === 403) {
      const data = error.response.data

      if (data.needsAuth) {
        // Cần đăng nhập
        setAuthError({
          message: data.message,
          needsAuth: true,
          authType: data.authType,
        })
        setShowAuthModal(true)
        return true // Đã xử lý error
      } else {
        // Đã đăng nhập nhưng không có quyền
        customToast.error(
          `🔒 ${data.message || "Bạn không có quyền truy cập file này."}`
        )
        return true // Đã xử lý error
      }
    }

    return false // Chưa xử lý error, để caller xử lý tiếp
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
    setAuthError(null)
  }

  const onAuthSuccess = () => {
    closeAuthModal()
    customToast.success("Đăng nhập thành công! Đang thử lại...")

    // Auto-retry the failed request
    if (onRetry) {
      setTimeout(() => {
        onRetry()
      }, 500) // Small delay to let session update
    } else {
      // Fallback: reload page
      window.location.reload()
    }
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
