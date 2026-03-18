"use client"

import { useMemo } from "react"

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/Kamiya025",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      color: "bg-slate-800",
      hoverColor: "hover:bg-slate-700",
    },
    {
      name: "Email",
      href: "mailto:hawk01525@gmail.com",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  ]

  const techStack = [
    { label: "React 19", color: "from-cyan-500/10 to-blue-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    { label: "Next.js 15", color: "from-slate-500/10 to-slate-900/10", text: "text-slate-700 dark:text-slate-300" },
    { label: "TypeScript", color: "from-blue-500/10 to-indigo-500/10", text: "text-blue-600 dark:text-blue-400" },
    { label: "Tailwind CSS", color: "from-emerald-500/10 to-teal-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  ]

  return (
    <footer className="w-full relative overflow-hidden border-t border-blue-200/40 dark:border-blue-900/30">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Container */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl relative z-10">
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Column 1: Brand & Bio */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-black text-white tracking-widest leading-none">
                    QH
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Quang Hưng
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    aka <span className="text-emerald-600 dark:text-emerald-400">Kamiya</span>
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                A passionate <span className="text-blue-600 dark:text-blue-400 font-semibold">Frontend Developer</span> dedicated to crafting exceptional digital experiences with modern technologies and luxury UI/UX design.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 ${social.color} ${social.hoverColor} text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg shadow-black/10`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Highlights */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-blue-600"></span>
                Projects & Tools
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://locales-brown.vercel.app" target="_blank" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-blue-600 transition-all"></span>
                    Translator Tool v1.2.0
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Kamiya025/locales-i18n-with-google-sheets" target="_blank" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-blue-600 transition-all"></span>
                    Open Source Locale Hub
                  </a>
                </li>
                <li>
                  <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    Currently building...
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Professional Stack */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-emerald-600"></span>
                Tech Mastery
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech.label}
                    className={`px-3 py-1 bg-gradient-to-br ${tech.color} border border-white/40 dark:border-white/5 ${tech.text} rounded-lg text-xs font-bold backdrop-blur-sm shadow-sm hover:scale-105 transition-transform cursor-default`}
                  >
                    {tech.label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                 <div className="flex -space-x-2">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                     </div>
                   ))}
                 </div>
                 <p className="text-xs text-slate-500 font-medium italic">
                    Trusted by developers worldwide
                 </p>
              </div>
            </div>

            {/* Column 4: Newsletter or Status */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-purple-600"></span>
                Quick Connect
              </h4>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/20">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  Have a vision? Let's bring it to life with modern code.
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Available for freelance</span>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                   Start a Conversation
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                © {currentYear} <span className="text-slate-900 dark:text-slate-100 font-bold">Quang Hưng (Kamiya)</span>. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 flex items-center gap-1">
                Made with <svg className="w-3 h-3 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402" /></svg> in Vietnam
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a href="/privacy-policy" className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                Privacy
              </a>
              <a href="/terms-of-service" className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                Terms
              </a>
              <a href="https://github.com/Kamiya025" target="_blank" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline decoration-emerald-500/30 underline-offset-4 uppercase tracking-widest">
                Open Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
