"use client"

import { useState, useCallback, useMemo } from "react"
import { useBatchAutoFix, useOptimizedAutoFix } from "@/hooks/useBatchAutoFix"
import { useDebounceCallback } from "@/hooks/useDebounceCallback"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
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

interface AutoFixDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly spreadsheetId: string
  readonly validationIssues: ValidationIssue[]
}

export default function AutoFixDialog({
  isOpen,
  onClose,
  spreadsheetId,
  validationIssues,
}: AutoFixDialogProps) {
  const [fixingItems, setFixingItems] = useState<Set<string>>(new Set())
  const { setResponse } = useSpreadsheet()

  // Use optimized hooks for better performance
  const batchAutoFixMutation = useBatchAutoFix((updatedData, results) => {
    setResponse(updatedData)

    // Show detailed results if there were failures
    if (results.summary.failed > 0) {
      console.warn(
        "Some fixes failed:",
        results.results.filter((r) => !r.success)
      )
    }

    onClose()
  })

  const singleAutoFixMutation = useOptimizedAutoFix((updatedData) => {
    setResponse(updatedData)
  })

  const handleFixInternal = useCallback(
    async (sheetTitle: string, fixType: string, fixKey: string) => {
      setFixingItems((prev) => new Set(prev).add(fixKey))

      try {
        await singleAutoFixMutation.mutateAsync({
          spreadsheetId,
          sheetTitle,
          fixType,
        })
      } finally {
        setFixingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(fixKey)
          return newSet
        })
      }
    },
    [singleAutoFixMutation, spreadsheetId]
  )

  // Debounced version to prevent spam clicks
  const handleFix = useDebounceCallback(handleFixInternal, 500)

  const handleFixAllInternal = useCallback(async () => {
    // Collect all fixes to process in batch
    const allFixes: Array<{ sheetTitle: string; fixType: string }> = []
    const allFixKeys: string[] = []

    for (const issue of validationIssues) {
      for (const fix of issue.fixes) {
        const fixKey = `${issue.sheetTitle}-${fix.type}`
        if (!fixingItems.has(fixKey)) {
          allFixes.push({ sheetTitle: issue.sheetTitle, fixType: fix.type })
          allFixKeys.push(fixKey)
        }
      }
    }

    if (allFixes.length === 0) return

    // Set all as fixing
    setFixingItems((prev) => {
      const newSet = new Set(prev)
      allFixKeys.forEach((key) => newSet.add(key))
      return newSet
    })

    try {
      // Process all fixes in parallel via batch API
      await batchAutoFixMutation.mutateAsync({
        spreadsheetId,
        fixes: allFixes,
      })
    } finally {
      // Clear all fixing states
      setFixingItems((prev) => {
        const newSet = new Set(prev)
        allFixKeys.forEach((key) => newSet.delete(key))
        return newSet
      })
    }
  }, [validationIssues, fixingItems, batchAutoFixMutation, spreadsheetId])

  // Debounced version to prevent spam clicks
  const handleFixAll = useDebounceCallback(handleFixAllInternal, 1000)

  // Memoize expensive calculations
  const totalFixes = useMemo(
    () => validationIssues.reduce((sum, issue) => sum + issue.fixes.length, 0),
    [validationIssues]
  )

  // Optimize loading state checks
  const isAnyFixing = useMemo(
    () =>
      fixingItems.size > 0 ||
      batchAutoFixMutation.isPending ||
      singleAutoFixMutation.isPending,
    [
      fixingItems.size,
      batchAutoFixMutation.isPending,
      singleAutoFixMutation.isPending,
    ]
  )

  const footer = (
    <div className="flex justify-between items-center">
      <Button variant="outline" onClick={onClose}>
        Đóng
      </Button>

      <div className="flex gap-3">
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
          Mở Google Sheets
        </Button>
        <Button
          variant="gradient"
          onClick={handleFixAll}
          disabled={isAnyFixing}
          loading={isAnyFixing}
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        >
          Sửa Tất Cả ({totalFixes})
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Auto-Fix Google Sheets Format"
      subtitle="Tự động sửa lỗi format trong Google Sheets"
      icon="🔧"
      iconColor="emerald"
      size="xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="glass-effect border border-amber-200/30 rounded-lg p-5 backdrop-blur-md soft-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 soft-shadow">
              <svg
                className="w-5 h-5 text-white"
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
              <h3 className="font-semibold text-slate-800 text-lg mb-2">
                Phát hiện {totalFixes} vấn đề format cần sửa
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Nhấn <span className="font-medium text-slate-700">"Sửa"</span>{" "}
                để tự động khắc phục từng vấn đề hoặc{" "}
                <span className="font-medium text-slate-700">"Sửa Tất Cả"</span>{" "}
                để xử lý một lượt.
              </p>
            </div>
          </div>
        </div>

        {/* Issues by Sheet */}
        <div className="space-y-4">
          {validationIssues.map((issue) => (
            <div
              key={issue.sheetTitle}
              className="glass-effect border border-slate-200/30 rounded-lg p-5 backdrop-blur-sm soft-shadow"
            >
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-3">
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
              </h4>

              {/* Errors */}
              {issue.errors.length > 0 && (
                <div className="mb-5">
                  <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 text-xs">⚠</span>
                    </div>
                    Lỗi được tìm thấy:
                  </h5>
                  <div className="space-y-2">
                    {issue.errors.map((error) => (
                      <div
                        key={error}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 leading-relaxed">
                          {error}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fixes */}
              {issue.fixes.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 text-xs">✓</span>
                    </div>
                    Sửa chữa tự động:
                  </h5>
                  <div className="space-y-3">
                    {issue.fixes.map((fix) => {
                      const fixKey = `${issue.sheetTitle}-${fix.type}`
                      const isFixing = fixingItems.has(fixKey)

                      return (
                        <div
                          key={fixKey}
                          className="glass-effect border border-emerald-200/30 rounded-lg p-4 backdrop-blur-sm hover:border-emerald-300/40 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <h6 className="font-medium text-slate-800 mb-1">
                                {fix.title}
                              </h6>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {fix.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="gradient"
                              onClick={() =>
                                handleFix(issue.sheetTitle, fix.type, fixKey)
                              }
                              disabled={isFixing || isAnyFixing}
                              loading={isFixing}
                              className="flex-shrink-0"
                            >
                              {isFixing ? "Đang sửa..." : fix.action}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
