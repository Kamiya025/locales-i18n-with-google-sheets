"use client"

import { HistoryItem } from "@/hooks/useHistory"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"
import { useState } from "react"

// Configure dayjs
dayjs.extend(relativeTime)
dayjs.locale("vi")

interface HistoryPanelProps {
  items: HistoryItem[]
  favorites: HistoryItem[]
  recent: HistoryItem[]
  onSelect: (url: string, title?: string) => void
  onToggleFavorite: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  isOpen: boolean
  onClose: () => void
}

export default function HistoryPanel({
  items,
  favorites,
  recent,
  onSelect,
  onToggleFavorite,
  onRemove,
  onClear,
  isOpen,
  onClose,
}: HistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = (activeTab === "favorites" ? favorites : recent).filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (timestamp: number) => {
    try {
      return dayjs(timestamp).fromNow()
    } catch {
      return "Không rõ thời gian"
    }
  }

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + "..."
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] md:hidden"
        onClick={onClose}
        aria-label="Đóng lịch sử"
      />

      {/* Panel */}
      <div className="fixed md:absolute top-full left-0 right-0 md:right-auto md:w-96 bg-white/95 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl z-[200] mt-2 max-h-[32rem] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-800">Lịch sử</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onClear}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                title="Xóa tất cả"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-all text-sm"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100/50 rounded-lg p-1 mt-3">
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "recent"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Gần đây ({recent.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "favorites"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Yêu thích ({favorites.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <svg
                className="w-12 h-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">
                {(() => {
                  if (searchQuery) return "Không tìm thấy kết quả"
                  return `Chưa có ${
                    activeTab === "favorites" ? "yêu thích" : "lịch sử"
                  } nào`
                })()}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer w-full text-left relative"
                  onClick={() => onSelect(item.url, item.title)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Mở ${item.title ?? "Unnamed Sheet"}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelect(item.url, item.title)
                    }
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-slate-800 truncate">
                        {item.title || "Unnamed Sheet"}
                      </h4>
                      {item.accessCount > 1 && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {item.accessCount}x
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {truncateUrl(item.url)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatTime(item.lastAccessed)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(item.id)
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isFavorite
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-slate-400 hover:text-yellow-500"
                      }`}
                      title={
                        item.isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill={item.isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(item.id)
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg"
                      title="Xóa"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
