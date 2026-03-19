import { useTranslation } from "@/providers/I18nProvider"

interface DetailSidebarProps {
  stats: {
    percent: number
    completed: number
    total: number
  }
  namespaceOptions: {
    value: string
    label: string
  }[]
  selectedNamespace: string
  setSelectedNamespace: (val: string) => void
}

export function DetailSidebar({
  stats,
  namespaceOptions,
  selectedNamespace,
  setSelectedNamespace,
}: DetailSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col border-r border-white/20 bg-white/20 backdrop-blur-md p-6 space-y-8 overflow-y-auto">
      {/* Section: Status */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
          {t("detail.sidebar.overallProgress")}
        </label>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.percent}%</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              LIVE
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-1000"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>
              {stats.completed} {t("detail.sidebar.completed")}
            </span>
            <span>
              {stats.total} {t("detail.sidebar.total")}
            </span>
          </div>
        </div>
      </div>

      {/* Section: Quick Access */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
          {t("detail.sidebar.quickAccess")}
        </label>
        <div className="flex flex-col gap-1">
          {namespaceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedNamespace(opt.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
                selectedNamespace === opt.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  selectedNamespace === opt.value ? "bg-white" : "bg-slate-300"
                }`}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Actions */}
      <div className="pt-4 mt-auto">
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1">
            {t("detail.sidebar.proTip")}
          </p>
          <p className="text-[10px] font-medium leading-relaxed opacity-80">
            {t("detail.sidebar.fKeyTip")}
          </p>
        </div>
      </div>
    </aside>
  )
}
