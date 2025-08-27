"use client"

import { useEffect } from "react"
import { useHistory } from "@/hooks/useHistory"

/**
 * Hook để cập nhật history với title sau khi load data thành công
 */
export const useUpdateHistory = (url: string | null, title: string | null) => {
  const { save } = useHistory("sheet-url-history", 15)

  useEffect(() => {
    if (url && title) {
      // Method save đã có logic update title cho existing URL
      save(url, title)
    }
  }, [url, title, save])
}
