"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { debounce } from "lodash" 
import { useQuery } from "@tanstack/react-query"

interface DriveFile {
  id: string
  name: string
  modifiedTime: string
  iconLink?: string
  webViewLink?: string
}

interface ProjectDiscoveryProps {
  viewMode?: "grid" | "list"
}

export default function ProjectDiscovery({ viewMode = "grid" }: ProjectDiscoveryProps) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageTokens, setPageTokens] = useState<(string | null)[]>([null])

  // React Query for Drive Files
  const { 
    data, 
    isLoading, 
    isPlaceholderData,
    error,
    refetch 
  } = useQuery({
    queryKey: ['drive-files', searchTerm, currentPage, pageTokens[currentPage - 1]],
    queryFn: async () => {
      const token = pageTokens[currentPage - 1]
      let url = `/api/google/drive/sheets?search=${encodeURIComponent(searchTerm)}`
      if (token) {
        url += `&pageToken=${token}`
      }
      
      const res = await fetch(url)
      if (!res.ok) {
        if(res.status === 401) throw new Error("Vui lòng đăng nhập để xem danh sách.")
        throw new Error("Không thể tải danh sách tệp từ Google Drive")
      }
      return res.json()
    },
    enabled: !!session,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData,
  })

  // Extract files and next token from data
  const files: DriveFile[] = data?.files || []
  const hasNextPage = !!data?.nextPageToken

  // Update page tokens when data arrives
  useMemo(() => {
    if (data?.nextPageToken && !pageTokens[currentPage]) {
      setPageTokens(prev => {
        const next = [...prev]
        next[currentPage] = data.nextPageToken
        return next
      })
    }
  }, [data, currentPage, pageTokens])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)
      setCurrentPage(1)
      setPageTokens([null])
    }, 500),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const goToPage = (page: number) => {
    if (page < 1 || isLoading) return
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (isLoading && currentPage === 1 && !data) return null
    if (files.length === 0 && !error) return null

    return (
      <div className="pt-10 flex items-center justify-center gap-3">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xl shadow-blue-200 ring-4 ring-blue-50 z-10">
            {currentPage}
          </div>
          {hasNextPage && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={isLoading}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-500 font-black text-xs hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center"
            >
              {currentPage + 1}
            </button>
          )}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Tìm kiếm Spreadsheet theo tên..."
          defaultValue={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {isLoading && !data ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`${viewMode === "grid" ? "h-48" : "h-24"} w-full bg-white animate-pulse rounded-2xl border border-slate-200/40 shadow-sm`} />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-sm font-medium flex flex-col items-center gap-4 text-center">
          <p className="font-bold">{(error as Error).message}</p>
          <button 
             onClick={() => refetch()}
             className="px-6 py-2 bg-white border border-red-200 rounded-xl text-red-600 font-bold text-xs uppercase hover:bg-red-50 transition-colors"
          >
             Thử lại
          </button>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-24 px-6 rounded-3xl bg-white border border-dashed border-slate-200">
          <h3 className="text-slate-800 font-black text-lg mb-1">Không tìm thấy kết quả</h3>
        </div>
      ) : (
        <div className={`space-y-4 ${isPlaceholderData ? "opacity-50 pointer-events-none" : ""}`}>
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
            {files.map((file, idx) => (
              <Link
                key={`${file.id}-${idx}`}
                href={`/sheet/${file.id}`}
                className={`group relative flex items-center justify-between rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-500 overflow-hidden ${viewMode === "grid" ? "flex-col p-6 items-start gap-6" : "p-4 items-center"}`}
              >
                <div className={`flex items-center gap-5 ${viewMode === "grid" ? "w-full" : "flex-1 min-w-0"}`}>
                  <div className={`${viewMode === "grid" ? "w-14 h-14" : "w-10 h-10"} rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm flex-shrink-0`}>
                    <svg className={viewMode === "grid" ? "w-7 h-7" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className={`font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase truncate ${viewMode === "grid" ? "text-base" : "text-sm"}`}>
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                      {new Date(file.modifiedTime).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className={`${viewMode === "grid" ? "w-10 h-10" : "w-8 h-8"} rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 shadow-sm bg-slate-50/50 flex-shrink-0`}>
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          {renderPagination()}
        </div>
      )}
    </div>
  )
}
