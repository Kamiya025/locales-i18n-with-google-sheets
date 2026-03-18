"use client"

import GetLinkGoogleSheets from "@/components/form"
import SubtleAuthButton from "@/components/auth/SubtleAuthButton"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/providers/I18nProvider"

interface HeaderProps {
  isHeader?: boolean
}

export default function Header({ isHeader = true }: HeaderProps) {
  const pathname = usePathname()
  const { locale, setLocale, t } = useTranslation()
  const isDetailPath = pathname.startsWith("/sheet/")
  const isProfilePath = pathname.startsWith("/profile")
  const isHomePage = pathname === "/"

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full">
      {/* Immersive backdrop with refined border */}
      <div className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300 relative group/header">
        {/* Subtle accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity" />

        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3.5 h-16 sm:h-20">
          {/* 1. Brand Identity */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group/logo">
              <div className="relative w-10 h-10 rounded-2xl bg-white shadow-sm p-1.5 group-hover/logo:scale-105 group-hover/logo:shadow-md group-hover/logo:border-blue-200 transition-all duration-500 border border-slate-200/60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                <Image
                  src="/icon.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 tracking-tighter text-lg leading-none uppercase">
                  Translator<span className="text-blue-600">Tool</span>
                </span>
              </div>
            </Link>

            {/* Navigation Links - Desktop Only */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink
                href="/"
                active={pathname === "/"}
                label={t("home.header.home")}
              />
              <NavLink
                href="/profile"
                active={isProfilePath}
                label={t("home.header.projects")}
              />
            </nav>
          </div>

          {/* 2. Dynamic Search/Input Area */}
          {!isDetailPath && !isHomePage && (
            <div className="hidden md:flex flex-1 max-w-lg mx-12">
              <GetLinkGoogleSheets isHeader={true} />
            </div>
          )}

          {/* 3. Essential Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
              <button
                onClick={() => setLocale("vi")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                  locale === "vi"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                  locale === "en"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                EN
              </button>
            </div>

            {/* Action Group */}
            <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-slate-200/60 h-8">
              <TooltipButton icon={<GithubIcon />} label={t("home.header.docs")} />
              <TooltipButton icon={<HelpIcon />} label={t("home.header.support")} />
            </div>

            {/* User Profile / Auth */}
            <div className="pl-2">
              <SubtleAuthButton />
            </div>
          </div>
        </div>

        {/* Global Progress Line (optional, but looks premium) */}
        <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </header>
  )
}

function NavLink({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  )
}

function TooltipButton({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all group relative">
      {icon}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-[10px] text-white rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </span>
    </button>
  )
}

function GithubIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
