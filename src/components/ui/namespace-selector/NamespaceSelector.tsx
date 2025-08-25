"use client"

import { useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
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
        <div className="relative">
          <Listbox.Button className="relative w-full bg-transparent pl-12 pr-10 py-3 outline-none text-slate-700 cursor-pointer hover:text-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-left">
            <span className="block truncate">{selectedOption?.label}</span>

            {/* Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
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

            {/* Chevron */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400 ui-open:rotate-180 transition-transform duration-200"
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
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg glass-effect border border-white/30 backdrop-blur-md shadow-lg focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-4 py-3 transition-colors ${
                      active
                        ? "bg-indigo-50/80 text-indigo-700"
                        : "text-slate-700"
                    }`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <div className="flex items-center justify-between">
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <svg
                          className="w-5 h-5 text-indigo-600"
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
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
