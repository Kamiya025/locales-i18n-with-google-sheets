// app/page.tsx
"use client"

import { useFetchSheet } from "@/hooks/useFetchSheet"
import { useHistory } from "@/hooks/useHistory"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import SpreadsheetViewer from "../detail"
import GetLinkGoogleSheets from "../form"

export default function HomePage() {
  const storageKey = "sheet-url-history"
  const [url, setUrl] = useState("")
  const { data: response, setResponse } = useSpreadsheet()
  const { history, save } = useHistory(storageKey, 10)
  const fetchSheet = useFetchSheet((data, url) => {
    setResponse(data)
    save(url)
  })
  const isHeader = Boolean(response)

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-gray-200">
      <div
        className={
          isHeader
            ? "w-full h-20 bg-white shadow-md flex items-center justify-between px-6"
            : "h-80 flex flex-col items-center justify-between md:justify-center bg-white shadow-xl rounded-2xl p-12 w-full max-w-2xl"
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
        <div
          className={!isHeader ? "grow flex justify-center items-center" : ""}
        >
          <GetLinkGoogleSheets />
        </div>
      </div>
      <SpreadsheetViewer />
    </div>
  )
}
