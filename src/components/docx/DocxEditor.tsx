"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/ui/header"
import { DocxProject, DocxSegment } from "@/util/docx"
import { customToast } from "../ui/toast"
import RichEditorSegment from "./RichEditorSegment"

export default function DocxEditor() {
  const router = useRouter()
  const [project, setProject] = useState<DocxProject | null>(null)
  const [segments, setSegments] = useState<DocxSegment[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const rawData = sessionStorage.getItem("temp_docx_data")
    if (!rawData) {
      router.push("/")
      return
    }
    try {
      const parsed = JSON.parse(rawData) as DocxProject
      setProject(parsed)
      setSegments(parsed.segments)
    } catch (err) {
      console.error(err)
      router.push("/")
    }
  }, [router])

  const handleUpdateTranslation = (id: string, value: string) => {
    setSegments((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, translation: value } : seg))
    )
  }

  const handleSave = () => {
    if (!project) return
    const updatedProject = { ...project, segments }
    sessionStorage.setItem("temp_docx_data", JSON.stringify(updatedProject))
    customToast.success("Đã lưu tạm thời!")
  }

  const translatedCount = segments.filter((s) => s.translation.trim().length > 0).length
  const progress = segments.length > 0 ? (translatedCount / segments.length) * 100 : 0

  const filteredSegments = segments.filter(
    (s) =>
      s.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.translation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!project) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      {/* TOOLBAR */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               {project.fileName}
             </h1>
             <div className="flex items-center gap-4 mt-1">
               <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
               </div>
               <span className="text-[10px] font-black uppercase text-slate-400">
                 {translatedCount} / {segments.length} đoạn đã dịch ({Math.round(progress)}%)
               </span>
             </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
               <input 
                 type="text"
                 placeholder="Tìm kiếm nội dung..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
               />
               <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
             <button 
               onClick={handleSave}
               className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
             >
               Lưu tiến độ
             </button>
          </div>
        </div>
      </div>

      {/* EDITOR CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-48 pb-20">
        <div className="space-y-6">
          {filteredSegments.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Không tìm thấy nội dung nào.</p>
            </div>
          ) : (
            filteredSegments.map((seg, idx) => (
              <div 
                key={seg.id} 
                className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
                style={{ animation: `fadeUp 0.5s ${Math.min(idx * 0.05, 1)}s ease both` }}
              >
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Đoạn #{idx + 1}</span>
                   {seg.translation.trim().length > 0 && (
                     <span className="w-2 h-2 rounded-full bg-emerald-500" />
                   )}
                </div>
                
                {/* Original Text */}
                <div className="text-slate-700 text-sm leading-relaxed font-medium bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
                  {seg.original}
                </div>

                {/* Translation Input */}
                <RichEditorSegment
                  value={seg.translation}
                  onChange={(val) => handleUpdateTranslation(seg.id, val)}
                  placeholder="Nhập bản dịch tại đây..."
                />
              </div>
            ))
          )}
        </div>
      </main>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <p className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">
             Dữ liệu được lưu tạm trong trình duyệt.
           </p>
           <button 
             onClick={() => customToast.error("Chức năng xuất file .docx đang được phát triển")}
             className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10 ml-auto"
           >
             Xuất file kết quả
           </button>
        </div>
      </div>
    </div>
  )
}
