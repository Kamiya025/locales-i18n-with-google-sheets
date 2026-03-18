"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import vi from "@/locales/vi.json"
import en from "@/locales/en.json"

type Locale = "vi" | "en"
type Translations = typeof vi

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Locale, any> = { vi, en }

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi")

  useEffect(() => {
    const savedLocale = localStorage.getItem("app-locale") as Locale
    if (savedLocale && (savedLocale === "vi" || savedLocale === "en")) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("app-locale", newLocale)
    document.documentElement.lang = newLocale
  }

  // Simple dot notation getter
  const t = (path: string): string => {
    const keys = path.split(".")
    let current = translations[locale]
    for (const key of keys) {
      if (current[key] === undefined) return path
      current = current[key]
    }
    return current as string
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}
