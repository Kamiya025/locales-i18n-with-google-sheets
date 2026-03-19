"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react"
import { ChevronDownIcon, LogoutIcon, GoogleIcon } from "@/components/ui/icons"
import { Fragment } from "react"
import Button from "@/components/ui/button"
import { useTranslation } from "@/providers/I18nProvider"

export default function SubtleAuthButton() {
  const { data: session, status } = useSession()
  const { locale, setLocale, t } = useTranslation()

  if (status === "loading") {
    return (
      <div className="opacity-60">
        <div className="animate-pulse w-16 h-8 bg-white/30 backdrop-blur-lg rounded-lg border border-blue-200/30"></div>
      </div>
    )
  }

  if (status === "authenticated" && session) {
    return (
      <Menu as="div" className="relative">
        <MenuButton className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-full p-1 group">
          <div className="relative">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full border-2 border-white/60 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}

            <div
              className={`w-8 h-8 rounded-full border-2 border-white/60 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold hover:scale-105 transition-transform duration-200 ${
                session.user?.image ? "hidden" : ""
              }`}
            >
              {session.user?.name?.charAt(0).toUpperCase() ||
                session.user?.email?.charAt(0).toUpperCase() ||
                "👤"}
            </div>

            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border border-blue-200/40 flex items-center justify-center group-data-[open]:scale-110 transition-transform duration-200"
            >
              <ChevronDownIcon
                className="w-2 h-2 text-slate-600 group-data-[open]:rotate-180 transition-transform duration-200"
              />
            </div>
          </div>
        </MenuButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 top-full mt-2 w-56 origin-top-right bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/90 backdrop-blur-xl border border-blue-200/40 rounded-xl shadow-xl shadow-blue-500/20 focus:outline-none z-50">
            <div className="py-2">
              <div className="px-4 py-3 border-b border-blue-200/30">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-10 h-10 rounded-full border-2 border-white/60"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-white/60 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() ||
                          session.user?.email?.charAt(0).toUpperCase() ||
                          "👤"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => (window.location.href = "/profile")}
                      className={`${
                        focus ? "bg-blue-50/80 text-slate-900" : "text-slate-700"
                      } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200`}
                    >
                      <svg
                        className="mr-3 h-4 w-4 text-slate-500 group-hover:text-slate-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {t("common.auth.profile")}
                    </button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() =>
                        (window.location.href = "/profile/google-sheet")
                      }
                      className={`${
                        focus ? "bg-blue-50/80 text-slate-900" : "text-slate-700"
                      } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200`}
                    >
                      <svg
                        className="mr-3 h-4 w-4 text-slate-500 group-hover:text-slate-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      {t("common.auth.searchDrive")}
                    </button>
                  )}
                </MenuItem>

                <div className="border-t border-blue-200/30 my-1"></div>

                <div className="px-4 py-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {t("common.auth.interfaceLanguage")}
                  </p>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setLocale("vi")}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                        locale === "vi"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      TIẾNG VIỆT
                    </button>
                    <button
                      onClick={() => setLocale("en")}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                        locale === "en"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      ENGLISH
                    </button>
                  </div>
                </div>

                <div className="border-t border-blue-200/30 my-1"></div>

                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className={`${
                        focus ? "bg-blue-50/80 text-slate-900" : "text-slate-700"
                      } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200`}
                    >
                      <LogoutIcon className="mr-3 h-4 w-4 text-slate-500 group-hover:text-slate-700" />
                      {t("common.auth.logout")}
                    </button>
                  )}
                </MenuItem>
              </div>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    )
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center h-8 px-3 py-1.5 rounded-xl border border-blue-200/40 bg-white/70 backdrop-blur-xl text-slate-700 hover:bg-white/90 hover:border-blue-300/60 transition-all duration-300 group shadow-sm">
        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mr-2 group-hover:bg-blue-50 transition-colors">
          <svg className="w-3 h-3 text-slate-400 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest mr-1 transition-colors group-hover:text-blue-600">{t("common.auth.login")}</span>
        <ChevronDownIcon className="w-3 h-3 text-slate-400 transition-transform duration-300 group-data-[open]:rotate-180" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 top-full mt-2 w-56 origin-top-right bg-gradient-to-br from-white via-slate-50 to-blue-50 backdrop-blur-xl border border-blue-200/40 rounded-xl shadow-xl shadow-blue-500/20 focus:outline-none z-50">
          <div className="py-2">
            <div className="px-3 py-2">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className={`${
                      focus ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-700 border border-slate-200"
                    } flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200`}
                  >
                    <GoogleIcon className={`w-3.5 h-3.5 ${focus ? 'text-white' : ''}`} />
                    {t("common.auth.loginWithGoogle")}
                  </button>
                )}
              </MenuItem>
            </div>

            <div className="border-t border-blue-200/20 my-1"></div>

            <div className="px-4 py-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t("common.auth.language")}</p>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setLocale("vi")}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    locale === "vi"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  TIẾNG VIỆT
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    locale === "en"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  ENGLISH
                </button>
              </div>
            </div>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
