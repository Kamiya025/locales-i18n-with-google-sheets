import { SpreadsheetItem } from "@/models"
import { RowItemViewer } from "./row"

export function SpreadsheetItemViewer(props: { sheet: SpreadsheetItem }) {
  const { sheet } = props

  return (
    <div
      key={sheet.sheetId}
      className="rounded-2xl border shadow-2xl bg-white space-y-4 overflow-hidden transition-transform "
    >
      <h2 className="w-full px-3 py-4 border-b border-gray-500 uppercase text-2xl font-extrabold bg-blue-800 text-white">
        {sheet.title}
      </h2>
      <div className="gap-8 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sheet.rows.map((row, i) => (
          <RowItemViewer key={row.key} row={row} sheetId={sheet.sheetId} />
        ))}
      </div>
    </div>
  )
}
