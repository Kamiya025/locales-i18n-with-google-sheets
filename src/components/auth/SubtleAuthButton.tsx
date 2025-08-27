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
                  <ChevronDownIcon
                    className={`w-2 h-2 text-slate-600 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
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
                          <LogoutIcon className="mr-3 h-4 w-4 text-slate-500 group-hover:text-slate-700" />
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
      <GoogleIcon className="w-3.5 h-3.5 mr-2 transition-transform duration-300 group-hover:scale-110" />
      Đăng nhập
    </Button>
  )
}
