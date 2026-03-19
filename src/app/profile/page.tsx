"use client"

import SubtleAuthButton from "@/components/auth/SubtleAuthButton"
import { useSession, signOut, signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCloudHistory } from "@/hooks/useCloudHistory"
import ProjectDiscovery from "@/components/profile/ProjectDiscovery"
import Header from "@/components/ui/header"
import GeminiConfig from "@/components/profile/GeminiConfig"
import { useTranslation } from "@/providers/I18nProvider"


import ProjectCard from "@/components/ui/card/ProjectCard"


export default function ProfilePage() {
  const { t, locale } = useTranslation()
  const { data: session, status } = useSession()
  const { cloudProjects } = useCloudHistory()
  const [activeTab, setActiveTab] = useState<"recent" | "drive" | "settings">("recent")
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">{t("detail.profile.loading")}</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="relative flex flex-col w-full min-h-screen selection:bg-blue-500/20 selection:text-blue-700 bg-slate-50">
        {/* =========== IMMERSIVE BACKGROUND =========== */}
        <div className="fixed inset-0 -z-10 bg-white">
          <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-[100%] bg-blue-50/60 blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-[100%] bg-indigo-50/50 blur-[100px]" />
        </div>

        {/* =========== FIXED TOP NAV =========== */}
        <Header />

        {/* =========== GUIDANCE CONTENT =========== */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-20">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-2xl p-10 text-center animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 relative overflow-hidden group">
            {/* Subtle background flair */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            
             <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100/50 group-hover:scale-110 transition-transform duration-500">
               <div className="absolute inset-0 rounded-[2rem] bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
               <svg className="w-10 h-10 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
               </svg>
             </div>
             
             <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
               {t("detail.profile.unauthenticated.title")}
             </h1>
             <p className="text-slate-500 font-medium leading-relaxed mb-10 px-4">
               {t("detail.profile.unauthenticated.subtitle")}
             </p>
             
             <button 
               onClick={() => signIn("google")}
               className="group/btn relative w-full py-4.5 rounded-2xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98] transition-all overflow-hidden"
             >
               <div className="relative z-10 flex items-center justify-center gap-3">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.228 1.228-3.14 2.508-5.912 2.508-4.732 0-8.532-3.832-8.532-8.572s3.8-8.572 8.532-8.572c2.56 0 4.436.992 5.812 2.308l2.308-2.308c-2.032-1.944-4.804-3.412-8.12-3.412-6.528 0-11.972 5.3-11.972 11.984s5.444 11.984 11.972 11.984c3.528 0 6.136-1.168 8.164-3.28 2.088-2.088 2.744-4.992 2.744-7.392 0-.7-.064-1.352-.184-1.972h-10.748z"/></svg>
                 {t("detail.profile.unauthenticated.loginButton")}
               </div>
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
             </button>
             
             <div className="mt-8 flex items-center justify-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                 {t("detail.profile.unauthenticated.loginTip")}
               </p>
             </div>
          </div>
        </main>

        <footer className="w-full py-8 text-center border-t border-slate-200 bg-white mt-auto">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2026 Translator Tool • All Rights Reserved</p>
        </footer>
      </div>
    )
  }

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
                     <span>{t("detail.profile.totalProjects")}</span>
                     <span className="text-blue-600 font-black">{cloudProjects.length}</span>
                   </div>
                </div>

                <div className="w-full mt-4">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
                  >
                    {t("common.auth.logout")}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50 text-blue-800">
               <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">{t("detail.profile.infoTitle")}</div>
               <p className="text-xs font-medium leading-relaxed">{t("detail.profile.infoDesc")}</p>
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
                  {t("detail.profile.recentProjects")}
                  {activeTab === "recent" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab("drive")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === "drive" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {t("detail.profile.exploreDrive")}
                  {activeTab === "drive" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === "settings" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {t("detail.profile.aiSettings")}
                  {activeTab === "settings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                 {t("detail.profile.lastUpdated")}: {new Date().toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-US')}
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
                      <p className="text-slate-500 font-bold text-sm">{t("detail.profile.noProjectsSynced")}</p>
                      <Link href="/" className="text-sm text-blue-600 font-bold hover:underline mt-2 inline-block">{t("detail.profile.startTranslatingNow")}</Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === "drive" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-semibold leading-relaxed flex items-center gap-3 flex-1 mr-4">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                      {t("detail.profile.driveSearchTip")}
                    </div>
                    <Link 
                      href="/profile/google-sheet"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      {t("detail.profile.fullView")}
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
