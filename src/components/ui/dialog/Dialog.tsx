"use client"

import {
  Description,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { Fragment, ReactNode } from "react"
import Card from "../card"

interface DialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly subtitle?: string
  readonly icon?: ReactNode | string
  readonly iconColor?: "emerald" | "amber" | "blue" | "red" | "slate"
  readonly children: ReactNode
  readonly footer?: ReactNode
  readonly size?: "sm" | "md" | "lg" | "xl" | "full"
  readonly className?: string
  readonly showCloseButton?: boolean
  // preventBodyScroll handled automatically by Headless UI
  // confirmClose can be added later if needed
}

const iconColorClasses = {
  emerald: "from-emerald-400 to-emerald-600",
  amber: "from-amber-400 to-amber-600",
  blue: "from-blue-400 to-blue-600",
  red: "from-red-400 to-red-600",
  slate: "from-slate-400 to-slate-600",
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  full: "w-full h-full max-w-none max-h-none",
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconColor = "slate",
  children,
  footer,
  size = "lg",
  className = "",
  showCloseButton = true,
}: DialogProps) {
  const isFullscreen = size === "full"
  const sizeClass = isFullscreen
    ? "w-full h-full"
    : `w-full ${sizeClasses[size]} max-h-[90vh]`

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-[99999]" onClose={onClose}>
        {/* Backdrop with animation */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal content with animation */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel
                className={`${sizeClass} transform transition-all ${className}`}
              >
                {/* Clean Dialog Container */}
                <div className="bg-white/95 backdrop-blur-xl border border-blue-200/30 rounded-2xl shadow-xl shadow-blue-500/15 flex flex-col h-full overflow-hidden">
                  {/* Minimal Header */}
                  {(title || showCloseButton) && (
                    <div className="flex-shrink-0 px-6 py-4 border-b border-blue-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {icon && (
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconColorClasses[iconColor]} flex items-center justify-center`}
                            >
                              {typeof icon === "string" ? (
                                <span className="text-white text-sm font-semibold">
                                  {icon}
                                </span>
                              ) : (
                                icon
                              )}
                            </div>
                          )}
                          {title && (
                            <div>
                              <DialogTitle
                                as="h2"
                                className="text-lg font-semibold text-slate-800"
                              >
                                {title}
                              </DialogTitle>
                              {subtitle && (
                                <Description
                                  as="p"
                                  className="text-sm text-slate-600 mt-0.5"
                                >
                                  {subtitle}
                                </Description>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Clean Close Button */}
                        {showCloseButton && (
                          <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-colors duration-200"
                            aria-label="Đóng"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Clean Content */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {children}
                  </div>

                  {/* Minimal Footer */}
                  {footer && (
                    <div className="flex-shrink-0 px-6 py-4 border-t border-blue-100/50 bg-slate-50/30">
                      {footer}
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
