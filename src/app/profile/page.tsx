"use client"

import SubtleAuthButton from "@/components/auth/SubtleAuthButton"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCloudHistory } from "@/hooks/useCloudHistory"
import ProjectDiscovery from "@/components/profile/ProjectDiscovery"
import Header from "@/components/ui/header"
import GeminiConfig from "@/components/profile/GeminiConfig"


import ProjectCard from "@/components/ui/card/ProjectCard"


export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { cloudProjects } = useCloudHistory()
  const [activeTab, setActiveTab] = useState<"recent" | "drive" | "settings">("recent")
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
          <p className="text-slate-500 font-medium animate-pulse text-sm">Đang tải hồ sơ...</p>
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
      <Header />


      {/* =========== DASHBOARD LAYOUT =========== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 pt-24 sm:pt-32">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ---- LEFT SIDEBAR: PROFILE SUMMARY ---- */}
          <aside className="lg:col-span-3 space-y-6" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden group">
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="relative w-24 h-24 rounded-2xl p-0.5 bg-slate-100 shadow-inner overflow-hidden">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-3xl font-black">{session?.user?.name?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-1">{session?.user?.name}</h2>
                <p className="text-slate-400 font-medium text-xs tracking-wide mb-6 truncate w-full px-2">{session?.user?.email}</p>

                <div className="w-full py-4 border-t border-slate-100">
                   <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                     <span>Total Projects</span>
                     <span className="text-blue-600 font-black">{cloudProjects.length}</span>
                   </div>
                </div>

                <div className="w-full mt-4">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50 text-blue-800">
               <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Info</div>
               <p className="text-xs font-medium leading-relaxed">Sử dụng Translator Tool để quản lý các bản dịch từ Google Sheets của bạn một cách nhanh chóng.</p>
            </div>
          </aside>

          {/* ---- RIGHT CONTENT: PROJECT TABS ---- */}
          <div className="lg:col-span-9 flex flex-col gap-6" style={{ animation: 'fadeUp 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            
            {/* Elegant Tab Navigation */}
            <div className="flex items-center justify-between border-b border-slate-200">
              <div className="inline-flex items-center gap-8">
                <button 
                  onClick={() => setActiveTab("recent")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === "recent" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Dự án đã mở
                  {activeTab === "recent" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab("drive")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === "drive" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Khám phá Drive
                  {activeTab === "drive" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === "settings" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Cài đặt AI
                  {activeTab === "settings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                 Last updated: {new Date().toLocaleTimeString('vi-VN')}
              </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="space-y-4">
              {activeTab === "recent" && (
                <>
                  {cloudProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {cloudProjects.map((proj, idx) => (
                        <ProjectCard key={proj._id} proj={proj} index={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center rounded-2xl bg-white border border-dashed border-slate-200">
                      <p className="text-slate-500 font-bold text-sm">Chưa có dự án nào được đồng bộ.</p>
                      <Link href="/" className="text-sm text-blue-600 font-bold hover:underline mt-2 inline-block">Bắt đầu dịch ngay</Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === "drive" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-semibold leading-relaxed flex items-center gap-3 flex-1 mr-4">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                      Tìm kiếm và mở các tệp Google Sheets từ Drive của bạn.
                    </div>
                    <Link 
                      href="/profile/google-sheet"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Bản xem đầy đủ
                    </Link>
                  </div>
                  <ProjectDiscovery />
                </div>
              )}

              {activeTab === "settings" && (
                <div style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                  <GeminiConfig />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center border-t border-slate-200 bg-white mt-auto">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2026 Translator Tool • All Rights Reserved</p>
      </footer>

    </div>
  )
}
