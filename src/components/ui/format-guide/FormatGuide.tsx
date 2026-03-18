"use client"

import { useState } from "react"
import Button from "../button"
import { Dialog } from "../dialog"
import TemplateCreator from "../template-creator"
import { useTranslation } from "@/providers/I18nProvider"

export default function FormatGuide() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [showTemplateCreator, setShowTemplateCreator] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {t("detail.formatGuide.trigger")}
      </button>
    )
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        {t("detail.formatGuide.close")}
      </Button>
      <Button
        variant="gradient"
        onClick={() => {
          setShowTemplateCreator(true)
          setIsOpen(false)
        }}
        icon={
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      >
        {t("detail.formatGuide.createTemplate")}
      </Button>
    </div>
  )

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("detail.formatGuide.title")}
        subtitle={t("detail.formatGuide.subtitle")}
        icon="📋"
        iconColor="blue"
        size="xl"
        footer={footer}
      >
        <div className="space-y-6">
          {/* Required Format */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              {t("detail.formatGuide.requiredFormat")}
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <pre className="text-sm text-green-800 font-mono overflow-x-auto">
                {`| KEY     | English   | Vietnamese  | French      |
|---------|-----------|-------------|-------------|
| hello   | Hello     | Xin chào    | Bonjour     |
| goodbye | Goodbye   | Tạm biệt    | Au revoir   |
| thanks  | Thank you | Cảm ơn      | Merci       |`}
              </pre>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <p>
                <strong>{t("detail.formatGuide.rulesTitle")}</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  {t("detail.formatGuide.ruleKeyColumn")}{" "}
                  <code className="bg-slate-100 px-1 rounded">KEY</code> hoặc{" "}
                  <code className="bg-slate-100 px-1 rounded">key</code>
                </li>
                <li>{t("detail.formatGuide.ruleUnique")}</li>
                <li>{t("detail.formatGuide.ruleNotEmpty")}</li>
                <li>{t("detail.formatGuide.ruleLocales")}</li>
                <li>{t("detail.formatGuide.ruleAtLeastOne")}</li>
              </ul>
            </div>
          </div>

          {/* Common Errors */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              {t("detail.formatGuide.commonErrors")}
            </h3>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  {t("detail.formatGuide.errorMissingKey")}
                </h4>
                <pre className="text-sm text-red-700 font-mono">
                  {`| English | Vietnamese |  ← ❌ Không có column KEY
|---------|------------|
| Hello   | Xin chào   |`}
                </pre>
                <p className="text-sm text-red-600 mt-2">
                  <strong>{t("detail.formatGuide.errorMissingKeyFix")}</strong>
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  {t("detail.formatGuide.errorDuplicateKey")}
                </h4>
                <pre className="text-sm text-red-700 font-mono">
                  {`| KEY   | English | Vietnamese |
|-------|---------|------------|
| hello | Hello   | Xin chào   |
| hello | Hi      | Chào       |  ← ❌ Trùng key "hello"`}
                </pre>
                <p className="text-sm text-red-600 mt-2">
                  <strong>{t("detail.formatGuide.errorDuplicateKeyFix")}</strong>
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  {t("detail.formatGuide.errorEmptyKey")}
                </h4>
                <pre className="text-sm text-red-700 font-mono">
                  {`| KEY   | English | Vietnamese |
|-------|---------|------------|
| hello | Hello   | Xin chào   |
|       | Goodbye | Tạm biệt   |  ← ❌ KEY trống`}
                </pre>
                <p className="text-sm text-red-600 mt-2">
                  <strong>{t("detail.formatGuide.errorEmptyKeyFix")}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              {t("detail.formatGuide.proTips")}
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="text-sm text-blue-800 space-y-2">
                <li>{t("detail.formatGuide.tipNaming")}</li>
                <li>{t("detail.formatGuide.tipEmptyTranslation")}</li>
                <li>{t("detail.formatGuide.tipConvention")}</li>
                <li>{t("detail.formatGuide.tipHeaders")}</li>
              </ul>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Template Creator */}
      <TemplateCreator
        isOpen={showTemplateCreator}
        onClose={() => setShowTemplateCreator(false)}
      />
    </>
  )
}
