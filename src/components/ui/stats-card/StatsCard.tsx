"use client"

import Card from "../card"
import { Transition } from "@headlessui/react"

interface StatsCardProps {
  title: string
  value: string | number
  color?: "emerald" | "blue" | "amber" | "purple" | "indigo" | "rose"
  icon?: React.ReactNode
  subtitle?: string
  loading?: boolean
}

export default function StatsCard({
  title,
  value,
  color = "blue",
  icon,
  subtitle,
  loading = false,
}: Readonly<StatsCardProps>) {
  const colorClasses = {
    emerald: "border-emerald-200/30 text-emerald-700",
    blue: "border-blue-200/30 text-blue-700",
    amber: "border-amber-200/30 text-amber-700",
    purple: "border-purple-200/30 text-purple-700",
    indigo: "border-indigo-200/30 text-indigo-700",
    rose: "border-rose-200/30 text-rose-700",
  }

  return (
    <Card
      variant="glass"
      size="md"
      className={`border ${
        colorClasses[color].split(" ")[0]
      } hover:bg-slate-300 cursor-pointer shadow-lg`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`${colorClasses[color].split(" ")[1]} w-5 h-5`}>
              {icon}
            </div>
          )}
          <div
            className={`${
              colorClasses[color].split(" ")[1]
            } font-semibold text-sm`}
          >
            {title}
            {loading && <span className="ml-2 text-xs">...</span>}
          </div>
        </div>

        <div className="text-2xl font-bold text-slate-800 relative">
          <Transition
            show={!loading}
            enter="transition-all duration-300 ease-out"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition-all duration-200 ease-in"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <div className="min-h-[2rem] flex items-center">{value}</div>
          </Transition>

          <Transition
            show={loading}
            enter="transition-all duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-300 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-16 h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse" />
            </div>
          </Transition>
        </div>

        {subtitle && (
          <div className="text-sm text-slate-600 truncate font-medium">
            {subtitle}
          </div>
        )}
      </div>
    </Card>
  )
}
