// app/page.tsx
"use client"

import { useFetchSheet } from "@/hooks/useFetchSheet"
import { useHistory } from "@/hooks/useHistory"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import SpreadsheetViewer from "../detail/view"

export default function HomePage() {
  const storageKey = "sheet-url-history"
  const [url, setUrl] = useState("")
  const { data: response, setResponse } = useSpreadsheet()
  const { history, save, clear } = useHistory(storageKey, 10)
  const fetchSheet = useFetchSheet((data, url) => {
    setResponse(data)
    save(url)
  })
  const isHeader = Boolean(response)

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-amber-300">
      <div
        className={
          isHeader
            ? "w-full h-20 bg-white shadow-md flex items-center justify-between px-6"
            : "h-fit flex flex-col items-center justify-between md:justify-center bg-white shadow-xl rounded-2xl p-12 w-full max-w-2xl"
        }
      >
        <h1
          className={
            isHeader
              ? "hidden md:block text-2xl font-bold text-gray-800"
              : "text-2xl font-bold text-gray-800 mb-4"
          }
        >
          Google Sheet Translation Manager
        </h1>
        <div>
          <div className="flex gap-2">
            <input
              list={`${storageKey}-list`}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link Google Sheet vào đây..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={() => fetchSheet.mutate(url)}
              disabled={fetchSheet.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {fetchSheet.isPending
                ? "Đang tải..."
                : isHeader
                ? "Get"
                : "Lấy dữ liệu"}
            </button>
            <datalist id={`${storageKey}-list`}>
              {history.map((h) => (
                <option key={h} value={h} />
              ))}
            </datalist>
          </div>
          {fetchSheet.isError && (
            <span className="text-red-500 text-xs">
              {(fetchSheet.error as Error).message}
            </span>
          )}
        </div>
      </div>
      <SpreadsheetViewer />
    </div>
  )
}
