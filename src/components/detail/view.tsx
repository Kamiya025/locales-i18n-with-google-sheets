"use client"

import { useGlobalSpreadsheetFilter } from "@/hooks/useGlobalSpreadsheetFilter"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import Switch from "../ui/switch/Switch"
import { SpreadsheetItemViewer } from "./sheet"

export default function SpreadsheetViewer() {
  const { data, syncSheet } = useSpreadsheet()
  const { filtered, search, setSearch, setShowOnlyMissing, showOnlyMissing } =
    useGlobalSpreadsheetFilter(data)
  if (!data) return null
  return (
    <div className="w-full flex flex-col items-center flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="container flex flex-col gap-5">
        <div>
          <h1 className=" text-2xl font-bold">{data.title}</h1>
        </div>
        <div></div>
        <input
          type="text"
          placeholder="Tìm trong tất cả sheets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between items-center">
          <Switch
            color="blue"
            defaultChecked={showOnlyMissing}
            onChange={() => setShowOnlyMissing(!showOnlyMissing)}
            label="Thiếu bản dịch"
          />
        </div>
        {filtered?.sheets.map((sheet) => (
          <SpreadsheetItemViewer key={sheet.sheetId} sheet={sheet} />
        ))}
      </div>
    </div>
  )
}
