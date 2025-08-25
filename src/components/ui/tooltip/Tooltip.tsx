"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { Fragment, ReactNode } from "react"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: "top" | "bottom" | "left" | "right"
  className?: string
  contentClassName?: string
  trigger?: "hover" | "click"
  disabled?: boolean
}

export default function Tooltip({
  content,
  children,
  placement = "top",
  className = "",
  contentClassName = "",
  trigger = "hover",
  disabled = false,
}: TooltipProps) {
  if (disabled) {
    return <>{children}</>
  }

  const getPlacementClasses = () => {
    switch (placement) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2"
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2"
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2"
    }
  }

  const getArrowClasses = () => {
    switch (placement) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800"
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800"
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800"
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800"
      default:
        return "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800"
    }
  }

  if (trigger === "click") {
    return (
      <Popover className={`relative inline-block ${className}`}>
        {({ open }) => (
          <>
            <PopoverButton
              as="div"
              className={`cursor-pointer transition-colors duration-200 ${
                open ? "text-indigo-600" : ""
              }`}
            >
              {children}
            </PopoverButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel
                className={`absolute z-[55] ${getPlacementClasses()}`}
              >
                {({ close }) => (
                  <div
                    className={`relative bg-slate-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs ${contentClassName}`}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => close()}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-200"
                      aria-label="Đóng"
                    >
                      ×
                    </button>
                    {content}
                    {/* Arrow */}
                    <div
                      className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
                    />
                  </div>
                )}
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    )
  }

  // Hover trigger (default)
  return (
    <div className={`relative inline-block group ${className}`}>
      {children}
      <div
        className={`absolute z-[55] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 ${getPlacementClasses()}`}
      >
        <div
          className={`relative bg-slate-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs whitespace-nowrap ${contentClassName}`}
        >
          {content}
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`} />
        </div>
      </div>
    </div>
  )
}
