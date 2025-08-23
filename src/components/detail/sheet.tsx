import { SpreadsheetItem } from "@/models"
import { RowItemViewer } from "./row"
import { useState } from "react"
import { RowNewItemViewer } from "../form/add-row"
import { useSpreadsheet } from "@/providers/preadsheetProvider"

export function SpreadsheetItemViewer(props: { sheet: SpreadsheetItem }) {
  const { sheet } = props
  const { setResponse } = useSpreadsheet()
  const [open, setOpen] = useState(false)
  const [newTranslate, setNewTranslate] = useState(false)
  return (
    <div
      key={sheet.sheetId}
      className={`${
        open ? "rounded-2xl space-y-4" : "rounded-lg"
      } shadow-2xl bg-white overflow-hidden transition-transform`}
    >
      <h2
        onClick={() => setOpen(!open)}
        className={`w-full px-3 flex justify-between items-center border-gray-500 
                    uppercase text-md font-extrabold 
                    cursor-pointer select-none transform transition-all tracking-wider
                    ${
                      open
                        ? "py-3 bg-blue-800 hover:bg-blue-500 text-white border-b"
                        : "py-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
      >
        {sheet.title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 ${open ? "rotate-180" : ""} transition-transform`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </h2>
      {open && (
        <div className="w-full border-gray-300 px-3 text-sm text-gray-600">
          {!newTranslate && (
            <div className="flex justify-end">
              <button
                onClick={() => setNewTranslate(true)}
                className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                Thêm từ khóa
              </button>
            </div>
          )}
          <div className="gap-8 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {newTranslate && (
              <RowNewItemViewer
                sheetId={sheet.sheetId}
                lastIndexRow={sheet.rows.length}
                onSaveSuccess={(data) => {
                  setResponse(data)
                  setNewTranslate(false)
                }}
              />
            )}
            {sheet.rows.map((row, i) => (
              <RowItemViewer key={row.key} row={row} sheetId={sheet.sheetId} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
