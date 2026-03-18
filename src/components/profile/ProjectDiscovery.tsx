"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

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

  useEffect(() => {
    async function fetchDriveFiles() {
      try {
        setLoading(true)
        const res = await fetch("/api/google/drive/sheets")
        if (!res.ok) {
           if(res.status === 401) throw new Error("Vui lòng đăng nhập để xem danh sách.")
           throw new Error("Không thể tải danh sách tệp từ Google Drive")
        }
        const data = await res.json()
        setFiles(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchDriveFiles()
    }
  }, [session])

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-slate-100/50 animate-pulse rounded-2xl border border-slate-200/40" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-16 px-6 rounded-2xl bg-white border border-dashed border-slate-200">
        <p className="text-slate-400 font-bold text-sm">Không tìm thấy file Spreadsheet nào trên Drive của bạn.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {files.map((file, idx) => (
        <Link
          key={file.id}
          href={`/sheet/${file.id}`}
          className="group flex items-center justify-between p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-300"
          style={{ animation: `fadeUp 0.5s ${idx * 0.05}s ease both` }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Cập nhật {new Date(file.modifiedTime).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
             </svg>
          </div>
        </Link>
      ))}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
