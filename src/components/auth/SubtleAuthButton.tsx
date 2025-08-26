"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"
import Button from "@/components/ui/button"

export default function SubtleAuthButton() {
  const { data: session, status } = useSession()

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
        {({ open }) => (
          <>
            {/* Avatar Button */}
            <MenuButton className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-full p-1">
              {/* Avatar - luôn hiển thị với fallback */}
              <div className="relative">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full border-2 border-white/60 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      // Fallback khi ảnh lỗi
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                ) : null}

                {/* Fallback Avatar */}
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white/60 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold hover:scale-105 transition-transform duration-200 ${
                    session.user?.image ? "hidden" : ""
                  }`}
                >
                  {session.user?.name?.charAt(0).toUpperCase() ||
                    session.user?.email?.charAt(0).toUpperCase() ||
                    "👤"}
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

                {/* Dropdown indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border border-blue-200/40 flex items-center justify-center transition-transform duration-200 ${
                    open ? "scale-110" : ""
                  }`}
                >
                  <svg
                    className={`w-2 h-2 text-slate-600 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </MenuButton>

            {/* Dropdown Menu */}
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
                  {/* User Info */}
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

                  {/* Menu Items */}
                  <div className="py-1">
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className={`${
                            focus
                              ? "bg-blue-50/80 text-slate-900"
                              : "text-slate-700"
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Đăng xuất
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </div>
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
    )
  }

  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      variant="glass"
      size="sm"
      className="text-xs px-3 py-1.5 h-8 backdrop-blur-xl bg-white/70 border border-blue-200/40 text-slate-700 hover:text-slate-900 hover:bg-white/80 hover:border-blue-300/50 opacity-90 hover:opacity-100 transition-all duration-300 group"
    >
      <svg
        className="w-3.5 h-3.5 mr-2 transition-transform duration-300 group-hover:scale-110"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Đăng nhập
    </Button>
  )
}
