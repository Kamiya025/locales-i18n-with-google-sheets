"use client"

import Card from "../card"

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
    emerald: "border-emerald-200/30 text-emerald-600",
    blue: "border-blue-200/30 text-blue-600",
    amber: "border-amber-200/30 text-amber-600",
    purple: "border-purple-200/30 text-purple-600",
    indigo: "border-indigo-200/30 text-indigo-600",
    rose: "border-rose-200/30 text-rose-600",
  }

  return (
    <Card
      variant="glass"
      size="md"
      className={`border ${colorClasses[color].split(" ")[0]}`}
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

        <div className="text-2xl font-bold text-slate-700">
          {loading ? (
            <div className="w-16 h-8 bg-slate-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>

        {subtitle && (
          <div className="text-sm text-slate-500 truncate">{subtitle}</div>
        )}
      </div>
    </Card>
  )
}
