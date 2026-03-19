"use client"

import { useSession, signOut, signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  // Stats for the dashboard
  const stats = useMemo(() => [
    { 
      label: t("detail.profile.stats.projects") || "Projects", 
      value: cloudProjects.length, 
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "bg-blue-50"
    },
    { 
      label: t("detail.profile.stats.lastActivity") || "Last Activity", 
      value: cloudProjects.length > 0 
        ? new Date(Math.max(...cloudProjects.map(p => new Date(p.lastAccessedAt).getTime()))).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')
        : "N/A", 
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-emerald-50"
    },
    { 
      label: t("detail.profile.stats.accountType") || "Account Status", 
      value: session?.user ? "Premium" : "Free", 
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "bg-purple-50"
    }
  ], [cloudProjects, session, t, locale])

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
        {/* =========== FIXED TOP NAV =========== */}
        <Header />

        {/* =========== GUIDANCE CONTENT =========== */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-20">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 text-center relative overflow-hidden group">
             <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-blue-100/50">
               <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
               className="group relative w-full py-4.5 rounded-2xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
             >
               <div className="flex items-center justify-center gap-3">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.228 1.228-3.14 2.508-5.912 2.508-4.732 0-8.532-3.832-8.532-8.572s3.8-8.572 8.532-8.572c2.56 0 4.436.992 5.812 2.308l2.308-2.308c-2.032-1.944-4.804-3.412-8.12-3.412-6.528 0-11.972 5.3-11.972 11.984s5.444 11.984 11.972 11.984c3.528 0 6.136-1.168 8.164-3.28 2.088-2.088 2.744-4.992 2.744-7.392 0-.7-.064-1.352-.184-1.972h-10.748z"/></svg>
                 {t("detail.profile.unauthenticated.loginButton")}
               </div>
             </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-slate-50/50">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative">
        {/* Floating Background Flair */}
        <div className="absolute top-40 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000 pointer-events-none" />

        {/* Dashboard Hero Banner */}
        <div className="relative w-full h-[320px] rounded-[3.5rem] overflow-hidden mb-12 group shadow-2xl border border-white/20">
           <img 
             src="/images/profile/banner.png" 
             alt="Dashboard Banner" 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out brightness-[0.9] contrast-[1.1] saturate-[1.1]"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
           <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                   {t("detail.profile.welcomeTitle")?.replace("{name}", session?.user?.name || "") || `Hi, ${session?.user?.name}`}
                </h1>
                <p className="text-white/80 font-medium text-lg max-w-lg">
                   {t("detail.profile.welcomeSubtitle") || "Transform your spreadsheets into global products with our AI translation hub."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all cursor-default">
                   <div className="flex items-center gap-2">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                     </span>
                     Active Project Session
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-5 group hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5">{stat.label}</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Dashboard Panel */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden relative">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {/* Segmented Control Tabs */}
              <div className="px-8 pt-8 pb-0 border-b border-slate-100 bg-slate-50/30">
                <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
                  <button 
                    onClick={() => setActiveTab("recent")}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "recent" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {t("detail.profile.recentProjects")}
                  </button>
                  <button 
                    onClick={() => setActiveTab("drive")}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "drive" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {t("detail.profile.exploreDrive")}
                  </button>
                  <button 
                    onClick={() => setActiveTab("settings")}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "settings" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {t("detail.profile.aiSettings")}
                  </button>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="p-8 min-h-[500px]">
                {activeTab === "recent" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        {t("detail.profile.recentProjects")}
                      </h3>
                      
                      {/* View Switcher */}
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                          onClick={() => setViewMode("grid")}
                          className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                          title="Grid View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => setViewMode("list")}
                          className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                          title="List View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {cloudProjects.length > 0 ? (
                      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
                        {cloudProjects.map((proj, idx) => (
                          <ProjectCard key={proj._id} proj={proj} index={idx} viewMode={viewMode} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 flex flex-col items-center">
                        <div className="w-56 h-56 mb-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                           <img 
                             src="/images/profile/empty.png" 
                             alt="No Projects Illustration" 
                             className="w-full h-full object-contain drop-shadow-2xl"
                           />
                        </div>
                        <p className="text-slate-500 font-bold text-sm mb-6 max-w-xs">{t("detail.profile.noProjectsSynced")}</p>
                        <Link href="/" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/30 active:scale-95">
                          {t("detail.profile.startTranslatingNow")}
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "drive" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[2rem] bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border border-blue-100/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                             <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM16 10a1 1 0 011 1h1a1 1 0 110-2h-1a1 1 0 01-1 1z" /></svg>
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 tracking-tight">{t("detail.profile.exploreDrive")}</h4>
                            <p className="text-xs font-medium text-slate-500">{t("detail.profile.driveSearchTip")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* View Switcher */}
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button 
                              onClick={() => setViewMode("grid")}
                              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                              title="Grid View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => setViewMode("list")}
                              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                              title="List View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                            </button>
                          </div>
                          
                          <Link 
                            href="/profile/google-sheet"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-center"
                          >
                            {t("detail.profile.fullView")}
                          </Link>
                        </div>
                     </div>
                     <ProjectDiscovery viewMode={viewMode} />
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <GeminiConfig />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 text-center bg-white border-t border-slate-100">
         <div className="container mx-auto px-6">
            <div className="w-12 h-[2px] bg-slate-100 mx-auto mb-8" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
              © 2026 Translator Tool • Powered by Google AI
            </p>
            <div className="flex justify-center gap-8">
              <Link href="/privacy-policy" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">{t("common.footer.privacy")}</Link>
              <Link href="/terms-of-service" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">{t("common.footer.terms")}</Link>
            </div>
         </div>
      </footer>
    </div>
  )
}
