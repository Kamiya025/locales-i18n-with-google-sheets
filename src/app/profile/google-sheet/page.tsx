"use client"

import SubtleAuthButton from "@/components/auth/SubtleAuthButton"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ProjectDiscovery from "@/components/profile/ProjectDiscovery"

export default function GoogleSheetDiscoveryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-700 bg-slate-50">
      {/* =========== IMMERSIVE BACKGROUND =========== */}
      <div className="fixed inset-0 -z-10 bg-white">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-[100%] bg-blue-50/60 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-[100%] bg-indigo-50/50 blur-[100px]" />
      </div>

      {/* =========== FIXED TOP NAV =========== */}
      <nav className="sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-xl bg-white/60 border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm p-1.5 group-hover:scale-105 transition-all duration-300 border border-slate-200/50">
                 <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-800 tracking-tight text-base uppercase">
                 Translator<span className="text-blue-600 ml-1">Tool</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <SubtleAuthButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <header className="mb-10 text-center space-y-3" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
             Google Drive Explorer
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Khám phá Google Sheets</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Tìm kiếm và chọn bất kỳ tệp Spreadsheet nào từ Drive của bạn để bắt đầu dịch hoặc cập nhật nội dung.
          </p>
        </header>

        <div style={{ animation: 'fadeUp 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <ProjectDiscovery />
        </div>

        <div className="mt-12 p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200 overflow-hidden relative group" style={{ animation: 'fadeUp 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
           <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                 <h3 className="text-xl font-bold">Không tìm thấy file?</h3>
                 <p className="text-blue-100 text-sm font-medium">Đảm bảo file của bạn có định dạng Google Sheets và tài khoản đã được cấp quyền truy cập Drive.</p>
              </div>
              <Link 
                href="https://drive.google.com" 
                target="_blank"
                className="whitespace-nowrap px-8 py-3 rounded-2xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
              >
                Mở Google Drive
              </Link>
           </div>
        </div>
      </main>

      <footer className="w-full py-10 text-center border-t border-slate-200 bg-white mt-auto">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2026 Translator Tool • Drive Integration</p>
      </footer>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
