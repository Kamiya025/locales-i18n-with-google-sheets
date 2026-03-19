"use client"

import { useAddLanguage } from "@/hooks/useAddLanguage"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState, useEffect, useRef as useAddRef } from "react"
import Button from "../button"
import { Dialog } from "../dialog"
import Input from "../input"

interface AddLanguageModalProps {
  isOpen: boolean
  onClose: () => void
}

import { useTranslation } from "@/providers/I18nProvider"

export default function AddLanguageModal({
  isOpen,
  onClose,
}: AddLanguageModalProps) {
  const { t } = useTranslation()
  const [languageName, setLanguageName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { data, setResponse, listLocales } = useSpreadsheet()
  const inputRef = useAddRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const addLanguageMutation = useAddLanguage((updatedData) => {
    setResponse(updatedData)
    setLanguageName("")
    setError(null)
    onClose()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = languageName.trim()
    if (!trimmedName) {
      return
    }

    if (!data?.id) {
      setError(t("detail.addLanguage.errorNoSpreadsheet"))
      return
    }

    // Client-side validation: check if exists
    const exists = listLocales.some(
      (l) => l.toLowerCase() === trimmedName.toLowerCase()
    )
    if (exists) {
      setError(t("detail.addLanguage.errorAlreadyExists"))
      return
    }

    addLanguageMutation.mutate({
      spreadsheetId: data.id,
      languageName: trimmedName,
    })
  }

  const handleClose = () => {
    if (!addLanguageMutation.isPending) {
      setLanguageName("")
      setError(null)
      onClose()
    }
  }

  const quickLanguages = [
    { label: "English", value: "English" },
    { label: "Tiếng Việt", value: "Vietnamese" },
    { label: "日本語", value: "Japanese" },
    { label: "한국어", value: "Korean" },
    { label: "Français", value: "French" },
    { label: "Deutsch", value: "German" },
  ]

  const handleQuickAdd = (val: string) => {
    setLanguageName(val)
    setError(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const footer = (
    <div className="flex gap-3 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={addLanguageMutation.isPending}
        className="flex-1 rounded-2xl py-4"
      >
        {t("detail.addLanguage.cancelButton")}
      </Button>
      <Button
        type="submit"
        form="add-language-form"
        variant="gradient"
        disabled={!languageName.trim() || addLanguageMutation.isPending}
        loading={addLanguageMutation.isPending}
        className="flex-1 rounded-2xl py-4"
        icon={
          !addLanguageMutation.isPending ? (
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          ) : undefined
        }
      >
        {t("detail.addLanguage.addLanguageButton")}
      </Button>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t("detail.addLanguage.title")}
      subtitle={t("detail.addLanguage.subtitle")}
      icon="🌍"
      iconColor="emerald"
      size="sm"
      footer={footer}
      showCloseButton={true}
    >
      <form id="add-language-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Visual Header */}
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/20">
             <span className="text-3xl">🌍</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[200px]">
            {t("detail.addLanguage.hint")}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="language-name"
              className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1"
            >
              {t("detail.addLanguage.label")}
            </label>
            <Input
              id="language-name"
              ref={inputRef}
              type="text"
              value={languageName}
              onChange={(e) => {
                setLanguageName(e.target.value)
                if (error) setError(null)
              }}
              placeholder={t("detail.addLanguage.placeholder")}
              disabled={addLanguageMutation.isPending}
              error={!!error}
              className="rounded-2xl border-2 py-4"
              autoComplete="off"
            />
            {error && (
              <p className="text-xs text-red-500 mt-2 font-bold animate-shake flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Quick Selection */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Gợi ý nhanh
            </span>
            <div className="flex flex-wrap gap-2">
              {quickLanguages.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => handleQuickAdd(lang.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    languageName === lang.value
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  )
}
