"use client"

import { useState } from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"

interface NamespaceOption {
  value: string
  label: string
}

interface NamespaceSelectorProps {
  value: string
  onChange: (value: string) => void
  options: NamespaceOption[]
  className?: string
}

export default function NamespaceSelector({
  value,
  onChange,
  options,
  className = "",
}: NamespaceSelectorProps) {
  const selectedOption =
    options.find((option) => option.value === value) || options[0]

  return (
    <div className={`relative ${className}`}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 border border-blue-200/40 rounded-xl backdrop-blur-lg shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-500 ease-out">
          {/* Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <ListboxButton className="relative w-full bg-transparent pl-12 pr-12 py-3.5 outline-none text-slate-700 cursor-pointer hover:text-blue-600 transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-left">
            <span className="block truncate font-medium">
              {selectedOption?.label}
            </span>
          </ListboxButton>

          {/* Chevron */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
            <svg
              className="w-5 h-5 text-slate-500 ui-open:rotate-180 ui-open:text-blue-500 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95 translate-y-1"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-1"
        >
          <ListboxOptions className="absolute z-[60] mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-500/20 focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-700 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50/50"
                  }`
                }
                value={option.value}
              >
                {({ selected, active }) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 ${
                          active ? "text-blue-500" : "text-slate-400"
                        } transition-colors`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    {selected && (
                      <svg
                        className="w-4 h-4 text-blue-600 ml-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  )
}
