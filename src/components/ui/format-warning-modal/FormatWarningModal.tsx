"use client"

import Button from "../button"
import { Dialog } from "../dialog"

interface ValidationIssue {
  sheetTitle: string
  errors: string[]
  fixes: Array<{
    type:
      | "missing_key"
      | "duplicate_keys"
      | "empty_keys"
      | "no_languages"
      | "no_headers"
    title: string
    description: string
    action: string
  }>
}

interface FormatWarningModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly spreadsheetId: string
  readonly validationIssues: ValidationIssue[]
  readonly onViewAndFix: () => void
  readonly onAutoFixAll: () => void
  readonly isAutoFixing?: boolean
}

export default function FormatWarningModal({
  isOpen,
  onClose,
  spreadsheetId,
  validationIssues,
  onViewAndFix,
  onAutoFixAll,
  isAutoFixing = false,
}: FormatWarningModalProps) {
  const totalIssues = validationIssues.reduce(
    (sum, issue) => sum + issue.errors.length,
    0
  )
  const totalFixes = validationIssues.reduce(
    (sum, issue) => sum + issue.fixes.length,
    0
  )

  const footer = (
    <div className="flex justify-between items-center">
      <Button variant="outline" onClick={onClose}>
        Hủy
      </Button>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            window.open(
              `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
              "_blank"
            )
          }
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          }
        >
          Mở Sheets
        </Button>

        <Button
          variant="outline"
          onClick={onViewAndFix}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
        >
          Xem & Sửa ({totalFixes})
        </Button>

        <Button
          variant="gradient"
          onClick={onAutoFixAll}
          disabled={isAutoFixing}
          loading={isAutoFixing}
          icon={
            !isAutoFixing ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ) : undefined
          }
        >
          {isAutoFixing ? "Đang sửa..." : `Tự động sửa(${totalFixes})`}
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Google Sheets Format Warning"
      subtitle="Phát hiện vấn đề format cần được sửa"
      icon="⚠️"
      iconColor="amber"
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Warning Summary */}
        <div className="glass-effect border border-amber-200/30 rounded-lg p-6 backdrop-blur-md soft-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 soft-shadow">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-xl mb-3">
                Phát hiện vấn đề format trong Google Sheets
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Google Sheets của bạn có{" "}
                <span className="font-semibold text-amber-600">
                  {totalIssues} vấn đề format
                </span>{" "}
                cần được sửa để có thể sử dụng với ứng dụng translation này.
              </p>
              <div className="glass-effect border border-emerald-200/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs">💡</span>
                  </div>
                  <span>
                    <span className="font-medium">Đừng lo!</span> Chúng tôi có
                    thể tự động sửa{" "}
                    <span className="font-semibold text-emerald-600">
                      {totalFixes} vấn đề
                    </span>{" "}
                    này cho bạn.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues by Sheet */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span>Chi tiết vấn đề theo sheet:</span>
          </h4>

          {validationIssues.map((issue) => (
            <div
              key={issue.sheetTitle}
              className="glass-effect border border-slate-200/30 rounded-lg p-5 backdrop-blur-sm soft-shadow"
            >
              <h5 className="font-medium text-slate-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span>
                  Sheet:{" "}
                  <span className="text-blue-600">"{issue.sheetTitle}"</span>
                </span>
              </h5>

              {/* Errors */}
              <div className="space-y-3 mb-4">
                {issue.errors.map((error) => (
                  <div key={error} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs">⚠</span>
                    </div>
                    <span className="text-slate-600 leading-relaxed">
                      {error}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fixable Count */}
              {issue.fixes.length > 0 && (
                <div className="glass-effect border border-emerald-200/30 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-slate-700">
                      <span className="font-semibold text-emerald-600">
                        {issue.fixes.length} vấn đề
                      </span>{" "}
                      có thể tự động sửa
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Confirmation Message */}
        <div className="glass-effect border border-blue-200/30 rounded-lg p-5 backdrop-blur-sm soft-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">🤔</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 mb-4 text-lg">
                Bạn muốn chúng tôi làm gì?
              </h4>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>
                    <span className="font-medium text-slate-700">Hủy:</span>{" "}
                    Đóng và không thay đổi gì
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>
                    <span className="font-medium text-slate-700">
                      Xem & Sửa:
                    </span>{" "}
                    Xem chi tiết và chọn từng vấn đề cần sửa
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <span>
                    <span className="font-medium text-slate-700">
                      Tự động sửa tất cả:
                    </span>{" "}
                    Sửa tất cả vấn đề ngay lập tức
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
