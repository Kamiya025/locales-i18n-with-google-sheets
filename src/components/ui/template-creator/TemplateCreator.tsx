"use client"

import { useState } from "react"
import Button from "../button"
import { Dialog } from "../dialog"

interface TemplateCreatorProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

import { useTranslation } from "@/providers/I18nProvider"

export default function TemplateCreator({
  isOpen,
  onClose,
}: Readonly<TemplateCreatorProps>) {
  const { t } = useTranslation()
  const [languages, setLanguages] = useState(["English", "Vietnamese"])
  const [newLanguage, setNewLanguage] = useState("")

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()])
      setNewLanguage("")
    }
  }

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang))
  }

  const createTemplate = () => {
    // Create Google Sheets with predefined structure
    const templateUrl = "https://docs.google.com/spreadsheets/create"

    // Instructions for manual setup (since we can't auto-create with exact formatting)
    const instructions = `
${t("detail.templateCreator.instructions.title")}

${t("detail.templateCreator.instructions.step1").replace("{url}", templateUrl)}

${t("detail.templateCreator.instructions.step2")}
   - A1: KEY
   ${languages
     .map((lang, index) => `   - ${String.fromCharCode(66 + index)}1: ${lang}`)
     .join("\n")}

${t("detail.templateCreator.instructions.step3")}
   ${t("detail.templateCreator.instructions.step3_sub1")}
   ${t("detail.templateCreator.instructions.step3_sub2")}
   ${t("detail.templateCreator.instructions.step3_sub3")}
   ${t("detail.templateCreator.instructions.step3_sub4")}

${t("detail.templateCreator.instructions.step4")}
   - A2: hello
   - B2: Hello  
   - C2: Xin chào
   
${t("detail.templateCreator.instructions.step5")}
    `.trim()

    // Copy instructions to clipboard
    navigator.clipboard.writeText(instructions)

    // Open Google Sheets in new tab
    window.open(templateUrl, "_blank")

    // Show success message
    alert(t("detail.templateCreator.copySuccess"))

    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        {t("detail.templateCreator.cancelButton")}
      </Button>
      <Button
        variant="gradient"
        onClick={createTemplate}
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
        {t("detail.templateCreator.createButton")}
      </Button>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t("detail.templateCreator.title")}
      subtitle={t("detail.templateCreator.subtitle")}
      icon="🎨"
      iconColor="blue"
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            {t("detail.templateCreator.previewTitle")}
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-blue-500 text-white px-3 py-2 border border-slate-300 text-center font-bold">
                    KEY
                  </th>
                  {languages.map((lang) => (
                    <th
                      key={lang}
                      className="bg-blue-500 text-white px-3 py-2 border border-slate-300 text-center font-bold"
                    >
                      {lang}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">
                    hello
                  </td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">
                    Hello
                  </td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">
                    Xin chào
                  </td>
                  {languages.slice(2).map((lang) => (
                    <td
                      key={`hello-${lang}`}
                      className="px-3 py-2 border border-slate-300 text-slate-600"
                    >
                      ...
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">
                    goodbye
                  </td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">
                    Goodbye
                  </td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">
                    Tạm biệt
                  </td>
                  {languages.slice(2).map((lang) => (
                    <td
                      key={`goodbye-${lang}`}
                      className="px-3 py-2 border border-slate-300 text-slate-600"
                    >
                      ...
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Language Manager */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            {t("detail.templateCreator.langManagerTitle")}
          </h3>

          <div className="space-y-3">
            {/* Add Language */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder={t("detail.templateCreator.placeholderNewLang")}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => e.key === "Enter" && addLanguage()}
              />
              <Button onClick={addLanguage} variant="outline" size="sm">
                {t("detail.templateCreator.addButton")}
              </Button>
            </div>

            {/* Language List */}
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <div
                  key={lang}
                  className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200"
                >
                  <span className="text-sm font-medium">{lang}</span>
                  {index > 0 && ( // Can't remove KEY column
                    <button
                      onClick={() => removeLanguage(lang)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
