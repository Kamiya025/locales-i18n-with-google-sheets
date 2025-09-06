"use client"

import sheetApi from "@/apis/sheet"
import { useQuery } from "@tanstack/react-query"

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

/**
 * Hook để auto-load spreadsheet data theo ID
 * Dùng cho providers và detail pages
 */
export const useSpreadsheetData = (
  spreadsheetId: string,
  options?: {
    aggressive?: boolean
    onValidationIssues?: (validationIssues: ValidationIssue[]) => void
    onAuthError?: (error: any) => boolean // Return true if error was handled
  }
) => {
  return useQuery({
    queryKey: [
      "spreadsheet",
      spreadsheetId,
      options?.aggressive ? "aggressive" : "normal",
    ],
    queryFn: async () => {
      console.log("🔄 useSpreadsheetData starting with options:", options)
      try {
        // First try to get data normally
        const result = await sheetApi.getAll(spreadsheetId, options)
        console.log("✅ Data loaded successfully:", result?.title)
        return result
      } catch (error: any) {
        // First, check if it's an auth error
        if (error?.response?.status === 403) {
          console.log("🔐 403 Auth error detected:", error?.response?.data)

          if (options?.onAuthError) {
            const handled = options.onAuthError(error)
            console.log("🔐 Auth error handled:", handled)

            if (handled) {
              // Return pending promise to prevent error page while auth modal is shown
              // This keeps the component in loading state instead of error state
              // The auth modal will overlay on top of the loading spinner
              console.log("🔐 Keeping query in loading state for auth flow")
              return new Promise(() => {}) // Never resolves - auth will trigger page reload
            }
          }
        }

        // Handle 400 validation errors directly without additional API calls
        if (error?.response?.status === 400) {
          console.log(
            "🔧 400 validation error detected:",
            error?.response?.data
          )

          // If we have validation issues in the error response, use them directly
          if (
            error?.response?.data?.validationIssues &&
            options?.onValidationIssues
          ) {
            console.log("🔧 Using validation issues from error response")
            options.onValidationIssues(error.response.data.validationIssues)
          } else if (options?.onValidationIssues) {
            // Create a generic validation issue if no specific data provided
            console.log("🔧 Creating generic validation issue")
            const genericIssue = {
              sheetTitle: "Spreadsheet",
              errors: [
                error?.response?.data?.message || "Format validation failed",
              ],
              fixes: [
                {
                  type: "no_headers" as const,
                  title: "Fix Format",
                  description: "Please check your spreadsheet format",
                  action: "Check headers and data structure",
                },
              ],
            }
            options.onValidationIssues([genericIssue])
          }

          // For 400 errors, throw immediately to stop loading and show auto-fix modal
          console.log("🚫 Throwing 400 error to stop loading")
          throw error
        }

        // Re-throw original error if can't handle
        throw error
      }
    },
    enabled: !!spreadsheetId, // Only run query if spreadsheetId exists
    staleTime: 10 * 60 * 1000, // 10 minutes - tăng để match với server cache
    gcTime: 15 * 60 * 1000, // 15 minutes - cache longer để tránh refetch
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if ((error as any)?.response?.status === 403) return false
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Không refetch khi component mount lại
    refetchOnReconnect: false, // Không refetch khi reconnect
  })
}
