"use client"

import { useFetchSheet } from "@/hooks/useFetchSheet"
import { useHistory } from "@/hooks/useHistory"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"

export default function GetLinkGoogleSheets() {
  const storageKey = "sheet-url-history"
  const [url, setUrl] = useState("")
  const { setResponse } = useSpreadsheet()
  const { history, save } = useHistory(storageKey, 10)
  const fetchSheet = useFetchSheet((data, url) => {
    setResponse(data)
    save(url)
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        fetchSheet.mutate(url)
      }}
      className="w-full"
    >
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
          type="submit"
          disabled={fetchSheet.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {fetchSheet.isPending ? (
            "Đang tải..."
          ) : (
            <>
              <span className="md:block hidden">Lấy dữ liệu</span>
              <span className="md:hidden block">Get</span>
            </>
          )}
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
    </form>
  )
}
