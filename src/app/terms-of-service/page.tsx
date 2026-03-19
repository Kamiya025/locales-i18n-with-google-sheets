"use client"

import Link from "next/link"
import { useTranslation } from "@/providers/I18nProvider"
import { useEffect } from "react"

export default function TermsOfServicePage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t("detail.terms.title")} | Translator Tool`
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
            {t("detail.terms.backHome")}
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t("detail.terms.title")}
          </h1>
          <p className="text-slate-500 mb-10 font-medium pb-8 border-b border-slate-100">
            {t("detail.terms.lastUpdated")}
          </p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.intro.title")}
              </h2>
              <p>{t("detail.terms.sections.intro.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.service.title")}
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.service.core")}
              </h3>
              <p>{t("detail.terms.sections.service.core_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.service.scope")}
              </h3>
              <p>{t("detail.terms.sections.service.scope_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.account.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.account.requirement")}
              </h3>
              <p>{t("detail.terms.sections.account.requirement_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.account.access")}
              </h3>
              <p>{t("detail.terms.sections.account.access_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.account.security")}
              </h3>
              <p>{t("detail.terms.sections.account.security_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.rights_responsibility.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.rights_responsibility.use")}
              </h3>
              <p>{t("detail.terms.sections.rights_responsibility.use_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.rights_responsibility.responsibility")}
              </h3>
              <p>{t("detail.terms.sections.rights_responsibility.responsibility_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.intellectual.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.intellectual.our")}
              </h3>
              <p>{t("detail.terms.sections.intellectual.our_desc")}</p>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                {t("detail.terms.sections.intellectual.user")}
              </h3>
              <p>{t("detail.terms.sections.intellectual.user_desc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.disclaimer.title")}
              </h2>
              <p>{t("detail.terms.sections.disclaimer.content")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t("detail.terms.sections.contact.title")}
              </h2>
              <p className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                {t("detail.terms.sections.contact.content")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
