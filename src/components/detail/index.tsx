"use client"

import { useGlobalSpreadsheetFilter } from "@/hooks/useGlobalSpreadsheetFilter"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import Switch from "../ui/switch/Switch"
import { SpreadsheetItemViewer } from "./sheet"

export default function SpreadsheetViewer() {
  const { data, listLocales } = useSpreadsheet()
  const { filtered, search, setSearch, setShowOnlyMissing, showOnlyMissing } =
    useGlobalSpreadsheetFilter(data)
  if (!data) return null
  return (
    <div className="w-full flex flex-col items-center flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="container flex flex-col gap-5">
        <div className="flex flex-col gap-3 rounded-xl shadow-md p-4 bg-white">
          <div>
            <h1 className=" text-2xl font-bold">{data.title}</h1>

            <div className="flex flex-wrap gap-4 text-xs">
              <p>Tổng số namespace: {data.sheets.length ?? 0}</p>
              <p>
                Tổng từ khóa:{" "}
                {data.sheets.reduce((sum, sheet) => sum + sheet.rows.length, 0)}
              </p>
              <p>
                Chưa hoàn thiện:{" "}
                {data.sheets.reduce((sum, sheet) => {
                  return (
                    sum +
                    sheet.rows.filter((row) =>
                      Object.values(row.data).some((v) => !v?.trim())
                    ).length
                  )
                }, 0)}
              </p>
              <p>
                Các ngôn ngữ: {listLocales.join(", ") || "Chưa có ngôn ngữ nào"}
              </p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Tìm trong tất cả sheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex justify-between items-center">
            <Switch
              color="blue"
              defaultChecked={showOnlyMissing}
              onChange={() => setShowOnlyMissing(!showOnlyMissing)}
              label="Thiếu bản dịch"
            />
          </div>
        </div>
        {filtered?.sheets.map((sheet) => (
          <SpreadsheetItemViewer key={sheet.sheetId} sheet={sheet} />
        ))}
      </div>
    </div>
  )
}
