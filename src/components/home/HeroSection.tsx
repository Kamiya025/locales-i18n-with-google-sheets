import { useTranslation } from "@/providers/I18nProvider"

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-12 pt-16 text-center w-full max-w-6xl mx-auto">
      {/* High-Impact Hero Illustration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] -z-10 opacity-40 blur-2xl pointer-events-none overflow-hidden">
         <img 
           src="/images/home/hero.png" 
           alt="Hero Background" 
           className="w-full h-full object-cover animate-pulse duration-[8000ms]"
         />
      </div>

      <div
        className="mb-3 space-y-4"
        style={{ animation: "fadeUp .5s .08s ease both" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
          <div className="w-5 h-5 rounded-md bg-white p-0.5 shadow-sm">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {t("common.appTitle")}
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
          {t("home.hero.title_prefix")}{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              {t("home.hero.title_highlight")}
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-[4px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 opacity-60" />
          </span>
        </h1>
        <h2 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mt-1">
          {t("home.hero.subtitle")}
        </h2>
      </div>
      <p
        className="max-w-xl mx-auto text-slate-500 text-sm md:text-lg font-medium mb-12 leading-relaxed"
        style={{ animation: "fadeUp .5s .16s ease both" }}
      >
        {t("home.hero.description")}
      </p>
    </div>
  )
}
