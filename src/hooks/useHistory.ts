import { useState, useEffect, useCallback } from "react"

export function useHistory(key: string, maxItems: number = 10) {
  const [history, setHistory] = useState<string[]>([])

  // load từ localStorage khi mount
  useEffect(() => {
    const saved = localStorage.getItem(key)
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // hàm lưu 1 item
  const save = useCallback(
    (item: string) => {
      if (!item.trim()) return
      if (history.some((e) => e === item)) return
      // bỏ trùng nếu đã có
      const filtered = history.filter((h) => h !== item)
      // thêm vào đầu
      const newHistory = [item, ...filtered].slice(0, maxItems)
      localStorage.setItem(key, JSON.stringify(newHistory))
      setHistory(newHistory)
    },
    [history, key, maxItems]
  )

  // clear toàn bộ history
  const clear = useCallback(() => {
    localStorage.removeItem(key)
    setHistory([])
  }, [key])

  return { history, save, clear }
}
