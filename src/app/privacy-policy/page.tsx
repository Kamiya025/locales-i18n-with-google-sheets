"use client"

import Link from "next/link"
import { useTranslation } from "@/providers/I18nProvider"
import { useEffect } from "react"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t("detail.privacy.title")} | Translator Tool`
  }, [t])

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("detail.privacy.backHome")}
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t("detail.privacy.title")}
          </h1>
          <p className="text-slate-500 mb-10 font-medium pb-8 border-b border-slate-100">
            {t("detail.privacy.lastUpdated")}
          </p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.intro.title")}
              </h2>
              <p>{t("detail.privacy.sections.intro.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.collection.title")}
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.collection.google_account")}
              </h3>
              <p>{t("detail.privacy.sections.collection.google_account_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.collection.spreadsheet_data")}
              </h3>
              <p>{t("detail.privacy.sections.collection.spreadsheet_data_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.collection.usage_data")}
              </h3>
              <p>{t("detail.privacy.sections.collection.usage_data_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.usage.title")}
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.usage.core")}
              </h3>
              <p>{t("detail.privacy.sections.usage.core_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.usage.improvement")}
              </h3>
              <p>{t("detail.privacy.sections.usage.improvement_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.sharing.title")}
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.sharing.google")}
              </h3>
              <p>{t("detail.privacy.sections.sharing.google_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.sharing.commitment")}
              </h3>
              <p>{t("detail.privacy.sections.sharing.commitment_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.security.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.security.encryption")}
              </h3>
              <p>{t("detail.privacy.sections.security.encryption_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.security.access")}
              </h3>
              <p>{t("detail.privacy.sections.security.access_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.rights.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.rights.access")}
              </h3>
              <p>{t("detail.privacy.sections.rights.access_desc")}</p>
              
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.privacy.sections.rights.deletion")}
              </h3>
              <p>{t("detail.privacy.sections.rights.deletion_desc")}</p>
            </section>

            <section>
               <h2 className="text-2xl font-bold text-slate-900 mb-4">
                 {t("detail.privacy.sections.retention.title")}
               </h2>
               <p>{t("detail.privacy.sections.retention.duration_desc")}</p>
               <p className="mt-2">{t("detail.privacy.sections.retention.cleanup_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.privacy.sections.contact.title")}
              </h2>
              <p className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                {t("detail.privacy.sections.contact.content")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
