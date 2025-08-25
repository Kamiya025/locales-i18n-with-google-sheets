"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-blue-400/5 to-indigo-600/5 rounded-full blur-xl"></div>
        <div className="absolute top-4 right-8 w-12 h-12 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-lg"></div>
        <div className="absolute bottom-6 left-1/4 w-14 h-14 bg-gradient-to-br from-emerald-400/5 to-teal-600/5 rounded-full blur-xl"></div>
      </div>

      <div className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 backdrop-blur-xl border-t border-blue-200/40 shadow-lg shadow-blue-500/5 relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-lg font-bold text-white tracking-wide">
                    QH
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Quang Hưng
                  </h3>
                  <p className="text-sm text-slate-600">
                    <span className="text-slate-400">aka</span>{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-medium">
                      Kamiya
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700">
                  Frontend Developer
                </span>{" "}
                specializing in modern React, Next.js, and luxury UI/UX design.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="md:col-span-1">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md"></span>
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 text-cyan-700 rounded-full text-xs font-medium">
                  React 19
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-blue-700 rounded-full text-xs font-medium">
                  Next.js 15
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-violet-500/10 to-violet-600/10 border border-violet-500/20 text-violet-700 rounded-full text-xs font-medium">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 text-emerald-700 rounded-full text-xs font-medium">
                  Tailwind CSS
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 text-orange-700 rounded-full text-xs font-medium">
                  Headless UI
                </span>
              </div>
            </div>

            {/* Connect */}
            <div className="md:col-span-1">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md"></span>
                Connect
              </h4>
              <div className="flex gap-3 mb-4">
                <a
                  href="https://github.com/kamiya-quang-hung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
                  title="GitHub"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/quang-hung-kamiya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
                  title="LinkedIn"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="mailto:quanghung.kamiya@gmail.com"
                  className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
                  title="Email"
                >
                  <svg
                    className="w-4 h-4"
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
                </a>
                <a
                  href="https://t.me/kamiya_quanghung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
                  title="Telegram"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.776 8.384c-.136.568-.472.712-.952.44l-2.64-1.944-1.272 1.224c-.144.144-.264.264-.544.264l.192-2.72 4.952-4.472c.216-.192-.048-.304-.336-.112L8.96 12.688l-2.696-.848c-.584-.184-.6-.584.128-.864l10.544-4.056c.488-.176.912.112.736.848z" />
                  </svg>
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-sm"></span>
                Available for projects
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-200/30 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>© {currentYear}</span>
              <span className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quang Hưng (Kamiya)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Translation Manager v1.0.0</span>
              <span>•</span>
              <span>Made with</span>
              <svg
                className="w-3 h-3 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402" />
              </svg>
              <span>in Vietnam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
