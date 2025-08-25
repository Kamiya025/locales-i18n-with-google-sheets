"use client"

import { HistoryItem } from "@/hooks/useHistory"

interface FavoriteQuickAccessProps {
  favorites: HistoryItem[]
  onSelect: (url: string, title?: string) => void
  maxItems?: number
}

export default function FavoriteQuickAccess({
  favorites,
  onSelect,
  maxItems = 4,
}: FavoriteQuickAccessProps) {
  if (favorites.length === 0) return null

  const displayFavorites = favorites.slice(0, maxItems)

  return (
    <div className="space-y-2 relative z-[60]">
      <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
        <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center shadow-sm">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <span className="font-semibold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
          Yêu thích
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayFavorites.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.url, item.title)}
            className="group flex items-center gap-3 p-3 bg-gradient-to-br hover:from-gr from-white/95 via-yellow-50/90 to-orange-50/85 backdrop-blur-lg border border-yellow-200/40 rounded-xl hover:border-yellow-300/60 hover:shadow-lg hover:shadow-yellow-500/15 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 text-left relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-amber-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-lg flex items-center justify-center shadow-sm relative z-10">
              <svg
                className="w-4 h-4 text-yellow-600"
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
            <div className="flex-1 min-w-0 relative z-10">
              <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900 transition-colors duration-200">
                {item.title || "Chưa đặt tên"}
              </h4>
              <p className="text-xs text-slate-600 truncate font-medium">
                {item.accessCount > 1 && (
                  <span className="text-yellow-600 font-semibold">
                    {item.accessCount}x
                  </span>
                )}
                {item.accessCount > 1 && (
                  <span className="text-slate-400 mx-1">•</span>
                )}
                <span>Đã truy cập</span>
              </p>
            </div>

            {/* Star indicator */}
            <div className="flex-shrink-0 relative z-10">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {favorites.length > maxItems && (
        <p className="text-xs text-slate-500 text-center font-medium mt-3 italic">
          và {favorites.length - maxItems} yêu thích khác...
        </p>
      )}
    </div>
  )
}
