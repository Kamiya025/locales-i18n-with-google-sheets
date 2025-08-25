"use client"

import { useCallback, useRef } from "react"

/**
 * Custom hook to debounce a callback function
 * Prevents rapid successive calls to the same function
 */
export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef<T>(callback)

  // Update callback ref when callback changes
  callbackRef.current = callback

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  ) as T

  return debouncedCallback
}

/**
 * Custom hook for debouncing async functions with loading state
 * Useful for API calls that need debouncing
 */
export const useDebounceAsyncCallback = <
  T extends (...args: any[]) => Promise<any>
>(
  asyncCallback: T,
  delay: number = 300
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef<T>(asyncCallback)
  const isExecutingRef = useRef<boolean>(false)

  // Update callback ref when callback changes
  callbackRef.current = asyncCallback

  const debouncedAsyncCallback = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
      // If already executing, ignore new calls
      if (isExecutingRef.current) return

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      return new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            isExecutingRef.current = true
            const result = await callbackRef.current(...args)
            resolve(result)
          } catch (error) {
            reject(error)
          } finally {
            isExecutingRef.current = false
          }
        }, delay)
      })
    },
    [delay]
  ) as T

  return {
    debouncedCallback: debouncedAsyncCallback,
    isExecuting: isExecutingRef.current,
  }
}
