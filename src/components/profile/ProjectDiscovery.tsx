"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { debounce } from "lodash" 

interface DriveFile {
  id: string
  name: string
  modifiedTime: string
  iconLink?: string
  webViewLink?: string
}

export default function ProjectDiscovery() {
  const { data: session } = useSession()
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageTokens, setPageTokens] = useState<(string | null)[]>([null])
  const [hasNextPage, setHasNextPage] = useState(false)

  const fetchDriveFiles = async (search: string, page: number, customTokens?: (string | null)[]) => {
    try {
      setLoading(true)
      setError(null)

      const activeTokens = customTokens ?? pageTokens
      const token = activeTokens[page - 1]
      
      let url = `/api/google/drive/sheets?search=${encodeURIComponent(search)}`
      if (token) {
        url += `&pageToken=${token}`
      }
      
      const res = await fetch(url)
      if (!res.ok) {
        if(res.status === 401) throw new Error("Vui lòng đăng nhập để xem danh sách.")
        throw new Error("Không thể tải danh sách tệp từ Google Drive")
      }
      const data = await res.json()
      
      setFiles(data.files)
      
      // Update page tokens for the NEXT page
      setPageTokens(prev => {
        const resetTokens = customTokens ?? prev
        const newTokens = [...resetTokens]
        if (data.nextPageToken) {
          newTokens[page] = data.nextPageToken
        }
        return newTokens
      })
      
      setHasNextPage(!!data.nextPageToken)
      setCurrentPage(page)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search function
  const debouncedFetch = useCallback(
    debounce((nextValue: string) => {
      const freshTokens = [null]
      setPageTokens(freshTokens)
      fetchDriveFiles(nextValue, 1, freshTokens)
    }, 500),
    []
  )

  useEffect(() => {
    if (session) {
      fetchDriveFiles(searchTerm, 1)
    }
  }, [session])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedFetch(value)
  }

  const goToPage = (page: number) => {
    if (page < 1 || loading) return
    if (page > currentPage && !hasNextPage) return
    fetchDriveFiles(searchTerm, page)
  }

  const renderPagination = () => {
    if (loading && currentPage === 1) return null
    if (files.length === 0 && !error) return null

    return (
      <div className="pt-10 flex items-center justify-center gap-3">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
          title="Trang trước"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {/* First Page Link */}
          {currentPage > 2 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-500 font-black text-xs hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center"
              >
                1
              </button>
              {currentPage > 3 && <span className="text-slate-300 font-black text-xs px-1">···</span>}
            </>
          )}

          {/* Previous Page Number */}
          {currentPage > 1 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-500 font-black text-xs hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center"
            >
              {currentPage - 1}
            </button>
          )}

          {/* Current Page Indicator */}
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xl shadow-blue-200 ring-4 ring-blue-50 z-10">
            {currentPage}
          </div>

          {/* Next Page Number */}
          {hasNextPage && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-500 font-black text-xs hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center"
            >
              {currentPage + 1}
            </button>
          )}

          {/* More Pages Ellipsis */}
          {hasNextPage && pageTokens[currentPage + 1] && (
             <span className="text-slate-300 font-black text-xs px-1">···</span>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNextPage || loading}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
          title="Trang sau"
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
      {/* Search Header */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Tìm kiếm Spreadsheet theo tên..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => { setSearchTerm(""); const t = [null]; setPageTokens(t); fetchDriveFiles("", 1, t); }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 w-full bg-white animate-pulse rounded-2xl border border-slate-200/40 shadow-sm" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-sm font-medium flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-bold">{error}</p>
          <button 
             onClick={() => fetchDriveFiles(searchTerm, 1)}
             className="px-6 py-2 bg-white border border-red-200 rounded-xl text-red-600 font-bold text-xs uppercase hover:bg-red-50 transition-colors"
          >
             Thử lại
          </button>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-24 px-6 rounded-3xl bg-white border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <h3 className="text-slate-800 font-black text-lg mb-1">Không tìm thấy kết quả</h3>
          <p className="text-slate-400 font-bold text-sm">Thử với từ khóa khác hoặc dán ID Spreadsheet để tìm kiếm.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {files.map((file, idx) => (
              <Link
                key={`${file.id}-${idx}`}
                href={`/sheet/${file.id}`}
                className="group relative flex items-center justify-between p-6 rounded-2xl bg-white hover:bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                style={{ animation: `fadeUp 0.6s ${idx % 20 * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-500 shadow-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase">
                      {file.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(file.modifiedTime).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] text-slate-400 font-mono opacity-60">ID: {file.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 shadow-sm bg-slate-50/50">
                      <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {renderPagination()}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
