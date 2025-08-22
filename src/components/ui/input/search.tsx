import { useState, useEffect } from "react"

interface InputWithHistoryProps {
  value: string // controlled value
  onChange: (value: string) => void // controlled onChange
  storageKey: string // key trong localStorage
  suggestions?: string[] // gợi ý tĩnh ban đầu
  placeholder?: string
  maxItems?: number // số lượng tối đa trong history (default 10)
  labelBTN?: string // label cho nút lưu
  hint?: string
}

export default function InputWithHistory({
  value,
  onChange,
  storageKey,
  suggestions = [],
  placeholder = "Nhập hoặc chọn...",
  maxItems = 10,
  labelBTN = "Lưu",
  hint,
}: InputWithHistoryProps) {
  const [history, setHistory] = useState<string[]>([])

  // Load history khi component mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setHistory(JSON.parse(saved))
  }, [storageKey])

  // Lưu history vào localStorage
  const saveHistory = (newHistory: string[]) => {
    localStorage.setItem(storageKey, JSON.stringify(newHistory))
    setHistory(newHistory)
  }

  // Lưu item hiện tại vào history
  const handleSave = () => {
    if (!value.trim()) return

    // Xóa trùng
    const filtered = history.filter((item) => item !== value)

    // Thêm vào đầu list và giới hạn số lượng
    const newHistory = [value, ...filtered].slice(0, maxItems)

    saveHistory(newHistory)
  }

  // Bấm Enter để lưu
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <input
          list={`${storageKey}-list`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <datalist id={`${storageKey}-list`} className="hidden">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
          {history.map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {labelBTN}
        </button>

        {history.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Lịch sử:</h3>
            <ul className="list-disc ml-5">
              {history.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="text-red-500">{hint}</p>
    </>
  )
}
