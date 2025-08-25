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
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <svg
          className="w-4 h-4 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span className="font-medium">Yêu thích</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayFavorites.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.url, item.title)}
            className="group flex items-center gap-3 p-3 glass-effect border border-white/20 rounded-xl hover:border-yellow-300/40 hover:shadow-md transition-all duration-300 text-left backdrop-blur-sm"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
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
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-slate-900">
                {item.title || "Chưa đặt tên"}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {item.accessCount > 1 && `${item.accessCount}x • `}
                Đã truy cập
              </p>
            </div>

            {/* Star indicator */}
            <div className="flex-shrink-0">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {favorites.length > maxItems && (
        <p className="text-xs text-slate-400 text-center">
          và {favorites.length - maxItems} yêu thích khác...
        </p>
      )}
    </div>
  )
}
