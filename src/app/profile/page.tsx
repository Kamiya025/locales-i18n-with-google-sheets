"use client"

import SubtleAuthButton from "@/components/auth/SubtleAuthButton"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import { useCloudHistory } from "@/hooks/useCloudHistory"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { cloudProjects } = useCloudHistory()
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
          <p className="text-slate-500 font-medium animate-pulse">Đang tải hồ sơ...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-700">
      {/* =========== LUXURY BACKGROUND =========== */}
      <div className="fixed inset-0 -z-10 bg-slate-50">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-[100%] bg-blue-100/40 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-[100%] bg-indigo-100/30 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-[100%] bg-purple-100/20 blur-[130px]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0055ff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
        />
      </div>

      {/* =========== MINIMAL NAVIGATION =========== */}
      <nav className="sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-md bg-white/30 border-b border-white/40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-lg shadow-blue-500/10 p-1.5 group-hover:scale-110 transition-transform duration-300 border border-slate-100/50">
               <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-slate-800 tracking-tighter text-lg">Translator<span className="text-blue-600 underline decoration-blue-500/30 decoration-4 ml-1">Tool</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <SubtleAuthButton />
          </div>
        </div>
      </nav>

      {/* =========== HERO PROFILE SECTION =========== */}
      <header className="relative w-full pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8" style={{ animation: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            {/* Avatar with Ring Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-40 h-40 rounded-[2.5rem] p-1.5 bg-white shadow-2xl border border-white/60">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full rounded-[2rem] object-cover" />
                ) : (
                  <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-5xl font-black">
                    {session?.user?.name?.charAt(0)}
                  </div>
                )}
                {/* Online Badge */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white shadow-lg" />
              </div>
            </div>

            {/* Identity Group */}
            <div className="flex-1 text-center md:text-left pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 border border-blue-200/50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                Active Member
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                {session?.user?.name}
              </h1>
              <p className="text-slate-500 font-medium text-lg mb-8 max-w-md">
                Đang quản lý <span className="text-blue-600 font-bold">{cloudProjects.length} dự án</span> lưu trữ trên bộ nhớ đám mây của Translator Tool.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button 
                   onClick={() => signOut({ callbackUrl: "/" })}
                   className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Đăng xuất tài khoản
                </button>
                <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block" />
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Google Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========== MAIN GRID =========== */}
      <section className="w-full px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Quick Stats Horizontal Board */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animation: 'fadeUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <MiniStat label="Storage" value="Cloud" icon="☁️" />
            <MiniStat label="Projects" value={cloudProjects.length.toString()} icon="📁" />
            <MiniStat label="Auth Type" value="OAuth 2.0" icon="🔑" />
            <MiniStat label="Region" value="VN" icon="🇻🇳" />
          </div>

          {/* Project List Label */}
          <div className="flex items-center gap-4 group" style={{ animation: 'fadeUp 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Dự án gần đây</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>

          {/* New Soft Project Cards */}
          <div className="grid grid-cols-1 gap-4" style={{ animation: 'fadeUp 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            {cloudProjects.length > 0 ? (
              cloudProjects.map((proj, idx) => (
                <ProjectCard key={proj._id} proj={proj} index={idx} />
              ))
            ) : (
              <div className="py-24 text-center rounded-[2.5rem] bg-white/40 border border-dashed border-slate-300">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <p className="text-slate-500 font-bold text-lg">Bạn chưa có dự án nào được lưu.</p>
                <Link href="/" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Bắt đầu ngay tại đây</Link>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========== CUSTOM STYLES =========== */}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px) scale(1.02); }
        }
      `}</style>
    </div>
  )
}

function MiniStat({ label, value, icon }: { label: string, value: string, icon: string }) {
  return (
    <div className="group p-4 rounded-3xl bg-white border border-white shadow-xl shadow-slate-200/40 hover:shadow-blue-500/10 transition-all duration-500">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">{label}</div>
      <div className="text-lg font-black text-slate-700">{value}</div>
    </div>
  )
}

function ProjectCard({ proj, index }: { proj: any, index: number }) {
  return (
    <Link
      href={`/sheet/${proj.spreadsheetId}`}
      className="group relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-sm border border-white shadow-2xl shadow-slate-200/50 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center gap-6 z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform group-hover:rotate-3 transition-transform">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{proj.title}</h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-tighter">Spreadsheet</span>
            <span className="text-slate-400 text-xs font-mono">{proj.spreadsheetId.slice(0, 15)}...</span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 md:mt-0 flex items-center gap-8 z-10 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-4 md:pt-0 border-slate-100">
        <div className="flex flex-col md:items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Last Accessed</span>
          <span className="text-sm font-bold text-slate-600">{new Date(proj.lastAccessedAt).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
          <svg className="w-6 h-6 transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
