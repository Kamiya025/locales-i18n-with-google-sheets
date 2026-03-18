import { useTranslation } from "@/providers/I18nProvider"
import DocxPanel from "./DocxPanel"

export default function DocxCard() {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col gap-5 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_24px_48px_rgba(245,158,11,0.08),0_0_0_1px_rgba(255,255,255,0.5)] p-7 overflow-hidden">
      {/* Top shine */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      {/* Amber accent blob */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">
              {t("home.cards.docx.title")}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold border border-amber-200/60">
              {t("common.tag_new")}
            </span>
          </div>
          <p className="text-sm text-slate-500">{t("home.cards.docx.desc")}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

      {/* Panel content */}
      <DocxPanel />
    </div>
  )
}
