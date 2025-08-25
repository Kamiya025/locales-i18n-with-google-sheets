"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-8 right-12 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-12 left-1/3 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="glass-effect border-t border-white/20 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section - Personal Brand */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-6">
              {/* Avatar with glow effect */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white tracking-wide">
                    QH
                  </span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-indigo-400/30 to-pink-600/30 rounded-3xl blur animate-pulse"></div>
              </div>

              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Quang Hưng
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  <span className="text-slate-400">aka</span>{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">
                    Kamiya
                  </span>
                </p>
              </div>
            </div>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
              <span className="font-semibold text-slate-700">
                Frontend Developer
              </span>{" "}
              passionate about crafting stunning user interfaces and exceptional
              user experiences. Specialized in{" "}
              <span className="text-indigo-600 font-medium">React</span>,
              <span className="text-blue-600 font-medium"> Next.js</span>, and
              modern frontend technologies.
            </p>

            {/* Frontend Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 text-cyan-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                ⚛️ React 19
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-blue-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                🚀 Next.js 15
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-violet-500/10 to-violet-600/10 border border-violet-500/20 text-violet-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                📱 TypeScript
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 text-emerald-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                🎨 Tailwind CSS
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-pink-600/10 border border-pink-500/20 text-pink-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                ✨ UI/UX Design
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 text-orange-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                ⚡ Headless UI
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Project Showcase */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </span>
                Featured Project: Translation Manager
              </h3>

              <div className="glass-effect rounded-2xl p-6 border border-white/20 group hover:border-indigo-300/30 transition-all duration-300">
                <p className="text-slate-600 leading-relaxed mb-4">
                  A modern translation management tool that streamlines the
                  process of managing multilingual content through Google Sheets
                  integration. Built with cutting-edge technologies for optimal
                  performance and user experience.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Google Sheets API
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Real-time Sync
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Modern UI/UX
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    Glass Morphism
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Live & Active
                  </span>
                  <span>v1.0.0</span>
                  <span>• Made with ❤️ in Vietnam</span>
                </div>
              </div>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </span>
                Let's Connect
              </h3>

              <div className="space-y-4">
                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/kamiya-quang-hung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg"
                    title="GitHub @kamiya-quang-hung"
                  >
                    <svg
                      className="w-6 h-6 z-10 relative"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  <a
                    href="https://linkedin.com/in/quang-hung-kamiya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg"
                    title="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6 z-10 relative"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  <a
                    href="mailto:quanghung.kamiya@gmail.com"
                    className="group relative overflow-hidden w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg"
                    title="Email: quanghung.kamiya@gmail.com"
                  >
                    <svg
                      className="w-6 h-6 z-10 relative"
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
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  <a
                    href="https://t.me/kamiya_quanghung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg"
                    title="Telegram"
                  >
                    <svg
                      className="w-6 h-6 z-10 relative"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.776 8.384c-.136.568-.472.712-.952.44l-2.64-1.944-1.272 1.224c-.144.144-.264.264-.544.264l.192-2.72 4.952-4.472c.216-.192-.048-.304-.336-.112L8.96 12.688l-2.696-.848c-.584-.184-.6-.584.128-.864l10.544-4.056c.488-.176.912.112.736.848z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-sky-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>

                {/* Fun Tip Box */}
                <div className="glass-effect rounded-xl p-4 border border-white/20 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Pro Tips
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>
                      • Press{" "}
                      <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">
                        Ctrl+K
                      </kbd>{" "}
                      for quick history
                    </li>
                    <li>• Use datalist autocomplete for URLs</li>
                    <li>• Enjoy the glass morphism design! ✨</li>
                  </ul>
                </div>

                {/* Status Indicator */}
                <div className="glass-effect rounded-xl p-4 border border-white/20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></span>
                      <span className="text-sm font-medium text-emerald-700">
                        Available for projects
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">GMT+7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Signature */}
          <div className="border-t border-white/20 pt-6">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 text-sm text-slate-600 mb-2">
                <span>© {currentYear}</span>
                <span className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Quang Hưng (Kamiya)
                </span>
                <span>•</span>
                <span>Crafted with passion & precision</span>
                <span className="text-red-500 animate-pulse">❤️</span>
              </div>
              <p className="text-xs text-slate-500">
                Building the future, one line of code at a time ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
