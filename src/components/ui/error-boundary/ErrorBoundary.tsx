"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
          <Card className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center space-y-4 p-8 pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-200/50">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-800">
                  Có lỗi xảy ra
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  Ứng dụng gặp lỗi không mong muốn. Vui lòng thử làm mới trang hoặc liên hệ hỗ trợ.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-6">
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-100/60 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-sm font-semibold text-amber-900">Gợi ý khắc phục</h3>
                    <ul className="text-sm text-amber-800 leading-relaxed space-y-1">
                      <li>• Thử làm mới trang (F5)</li>
                      <li>• Kiểm tra kết nối mạng</li>
                      <li>• Xóa cache trình duyệt nếu cần</li>
                      <li>• Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Error details in development */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-xl">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Chi tiết lỗi (Development)</h3>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3 p-8 pt-0">
              <Button 
                onClick={this.handleReload}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới trang
              </Button>

              <Button 
                onClick={this.handleReset}
                variant="outline" 
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Thử lại
              </Button>

              <div className="text-center text-sm text-slate-500 pt-2">
                <p>Cần hỗ trợ? Liên hệ <span className="font-medium text-slate-700">hawk01525@gmail.com</span></p>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}
