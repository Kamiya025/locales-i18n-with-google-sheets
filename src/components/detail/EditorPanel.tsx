import SearchCombobox from "../ui/search-combobox"
import LanguageFilter from "../ui/language-filter"
import { SpreadsheetItemViewer } from "./sheet"
import { SpreadsheetResponse } from "@/models"
import { useTranslation } from "@/providers/I18nProvider"

interface DetailEditorPanelProps {
  search: string
  setSearch: (val: string) => void
  searchSuggestions: string[]
  isSearching: boolean
  showOnlyMissing: boolean
  setShowOnlyMissing: (val: boolean) => void
  filtered: SpreadsheetResponse | null
}

export function DetailEditorPanel({
  search,
  setSearch,
  searchSuggestions,
  isSearching,
  showOnlyMissing,
  setShowOnlyMissing,
  filtered,
}: DetailEditorPanelProps) {
  const { t } = useTranslation()

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Floating Filter Bar */}
      <div className="sticky top-0 z-20 px-6 py-3 bg-white/60 backdrop-blur-xl border-b border-slate-200/40 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full overflow-visible">
          <SearchCombobox
            value={search}
            onChange={setSearch}
            placeholder={t("detail.filters.searchPlaceholder")}
            suggestions={searchSuggestions}
            isLoading={isSearching}
            className="!rounded-2xl !bg-white/80 !border-slate-200/60 focus:!ring-blue-100 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-1 rounded-xl bg-slate-100/50 flex items-center gap-1 shadow-inner border border-slate-200/20">
            <button
              onClick={() => setShowOnlyMissing(false)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                !showOnlyMissing ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t("detail.filters.all")}
            </button>
            <button
              onClick={() => setShowOnlyMissing(true)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                showOnlyMissing ? "bg-white text-amber-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t("detail.filters.untranslated")}
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
          <LanguageFilter />
        </div>
      </div>

      {/* Keys Container */}
      <div
        className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar transition-opacity duration-300 ${
          isSearching ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Sheet Lists */}
        {filtered?.sheets?.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-32 text-center space-y-6"
            style={{
              animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                {t("detail.emptyState.noResults")}
              </h3>
              <p className="text-slate-500 font-medium">{t("detail.emptyState.adjustFilter")}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-20">
            {filtered?.sheets?.map((sheet, index) =>
              sheet ? (
                <div
                  key={sheet.sheetId}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SpreadsheetItemViewer sheet={sheet} />
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </main>
  )
}
