import { useTranslation } from "@/providers/I18nProvider"
import ExcelPanel from "./ExcelPanel"

export default function ExcelCard() {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col gap-5 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_24px_48px_rgba(16,185,129,0.08),0_0_0_1px_rgba(255,255,255,0.5)] p-7 overflow-hidden">
      {/* Top shine */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      {/* Green accent blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
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
            <h3 className="text-lg font-bold text-slate-800">{t("home.cards.excel.title")}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200/60">
              Offline
            </span>
          </div>
          <p className="text-sm text-slate-500">{t("home.cards.excel.desc")}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

      {/* Features */}
      <ul className="flex flex-col gap-2">
        {(t("home.cards.excel.features") as unknown as string[]).map((text) => (
          <li key={text} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-2.5 h-2.5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {text}
          </li>
        ))}
      </ul>

      {/* Drop Zone */}
      <ExcelPanel />
    </div>
  )
}
