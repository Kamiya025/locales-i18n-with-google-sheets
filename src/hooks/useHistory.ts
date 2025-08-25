import { useState, useEffect, useCallback } from "react"

// Helper function to check localStorage availability and space
const checkLocalStorageAvailable = () => {
  try {
    const test = "test"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    console.warn("localStorage is not available:", error)
    return false
  }
}

const getLocalStorageSize = () => {
  try {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  } catch (error) {
    console.debug("Failed to calculate localStorage size:", error)
    return 0
  }
}

export interface HistoryItem {
  id: string
  url: string
  title?: string
  createdAt: number
  lastAccessed: number
  isFavorite: boolean
  accessCount: number
}

export function useHistory(key: string, maxItems: number = 10) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // load từ localStorage khi mount
  useEffect(() => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.debug("Loading history from localStorage:", parsed)

        // Migration: nếu history cũ là array string, convert thành HistoryItem[]
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          typeof parsed[0] === "string"
        ) {
          console.debug("Migrating old string array history to new format")
          const migrated = parsed.map((url: string, index: number) => ({
            id: `migrated-${index}-${Date.now()}`,
            url,
            title: "Google Sheet", // Simple fallback for migration
            createdAt: Date.now() - index * 24 * 60 * 60 * 1000, // fake timestamps
            lastAccessed: Date.now() - index * 24 * 60 * 60 * 1000,
            isFavorite: false,
            accessCount: 1,
          }))
          setHistory(migrated)
          localStorage.setItem(key, JSON.stringify(migrated))
          console.debug("Migration completed:", migrated)
        } else if (Array.isArray(parsed)) {
          // Validate structure để đảm bảo parsed items có đúng format
          const validItems = parsed.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.url === "string"
          )
          setHistory(validItems)
          console.debug("Loaded valid history items:", validItems.length)
        }
      } catch (error) {
        console.error("Failed to parse history:", error)
        setHistory([])
        // Clear corrupted data
        localStorage.removeItem(key)
      }
    } else {
      console.debug("No saved history found")
    }
  }, [key])

  // Extract title from Google Sheets URL
  const extractTitleFromUrl = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes("docs.google.com")) {
        return "Google Sheet"
      }
      return "Spreadsheet"
    } catch {
      return "Unknown Sheet"
    }
  }, [])

  // hàm lưu 1 item với metadata
  const save = useCallback(
    (url: string, title?: string) => {
      if (!url.trim()) {
        console.debug("History save skipped: empty URL")
        return
      }

      console.debug("Saving to history:", { url, title })

      const now = Date.now()
      const existingIndex = history.findIndex((item) => item.url === url)

      let newHistory: HistoryItem[]

      if (existingIndex >= 0) {
        // Update existing item
        const existing = history[existingIndex]
        const updated = {
          ...existing,
          title: title ?? existing.title,
          lastAccessed: now,
          accessCount: existing.accessCount + 1,
        }
        // Move to front
        newHistory = [
          updated,
          ...history.filter((_, index) => index !== existingIndex),
        ]
        console.debug("Updated existing history item:", updated)
      } else {
        // Create new item
        const newItem: HistoryItem = {
          id: `sheet-${now}`,
          url,
          title: title ?? extractTitleFromUrl(url),
          createdAt: now,
          lastAccessed: now,
          isFavorite: false,
          accessCount: 1,
        }
        newHistory = [newItem, ...history]
        console.debug("Created new history item:", newItem)
      }

      // Keep only maxItems
      newHistory = newHistory.slice(0, maxItems)

      if (!checkLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot save history")
        return
      }

      try {
        const historyData = JSON.stringify(newHistory)
        console.debug(
          "Attempting to save history data size:",
          historyData.length,
          "chars"
        )
        console.debug(
          "Current localStorage size:",
          getLocalStorageSize(),
          "chars"
        )

        localStorage.setItem(key, historyData)
        setHistory(newHistory)
        console.debug(
          "History saved successfully, total items:",
          newHistory.length
        )
      } catch (error) {
        console.error("Failed to save history:", error)

        // If quota exceeded, try to save only recent items
        if (error instanceof Error && error.name === "QuotaExceededError") {
          console.warn(
            "Storage quota exceeded, trying to save only recent 5 items"
          )
          try {
            const reducedHistory = newHistory.slice(0, 5)
            localStorage.setItem(key, JSON.stringify(reducedHistory))
            setHistory(reducedHistory)
            console.debug("Reduced history saved successfully")
          } catch (retryError) {
            console.error("Failed to save even reduced history:", retryError)
          }
        }
      }
    },
    [history, key, maxItems, extractTitleFromUrl]
  )

  // Toggle favorite
  const toggleFavorite = useCallback(
    (id: string) => {
      const newHistory = history.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
      localStorage.setItem(key, JSON.stringify(newHistory))
      setHistory(newHistory)
    },
    [history, key]
  )

  // Remove single item
  const remove = useCallback(
    (id: string) => {
      const newHistory = history.filter((item) => item.id !== id)
      localStorage.setItem(key, JSON.stringify(newHistory))
      setHistory(newHistory)
    },
    [history, key]
  )

  // Clear all
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setHistory([])
      console.debug("History cleared successfully")
    } catch (error) {
      console.error("Failed to clear history:", error)
      // Still clear in-memory state even if localStorage fails
      setHistory([])
    }
  }, [key])

  // Get favorites
  const favorites = history.filter((item) => item.isFavorite)

  // Get recent (non-favorites sorted by lastAccessed)
  const recent = history
    .filter((item) => !item.isFavorite)
    .sort((a, b) => b.lastAccessed - a.lastAccessed)

  // Debug function (can be removed in production)
  const debugHistory = useCallback(() => {
    console.group("History Debug Info")
    console.log("Total items:", history.length)
    console.log("Favorites:", favorites.length)
    console.log("Recent:", recent.length)
    console.log("localStorage key:", key)
    console.log("localStorage size:", getLocalStorageSize(), "chars")
    console.log("localStorage available:", checkLocalStorageAvailable())

    const stored = localStorage.getItem(key)
    if (stored) {
      console.log("Stored data size:", stored.length, "chars")
      try {
        const parsed = JSON.parse(stored)
        console.log(
          "Stored items count:",
          Array.isArray(parsed) ? parsed.length : "Not array"
        )
      } catch (error) {
        console.log("Failed to parse stored data:", error)
      }
    } else {
      console.log("No data in localStorage")
    }
    console.groupEnd()
  }, [history, favorites, recent, key])

  return {
    items: history,
    favorites,
    recent,
    save,
    toggleFavorite,
    remove,
    clear,
    debugHistory, // For debugging purposes
  }
}
