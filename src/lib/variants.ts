import { cva } from "class-variance-authority"

// Progress bar variants based on completion status
export const progressBarVariants = cva(
  "h-full transition-all duration-1000 ease-out",
  {
    variants: {
      status: {
        completed: "bg-gradient-to-r from-green-400 to-green-600",
        warning: "bg-gradient-to-r from-yellow-300 to-yellow-500",
        error: "bg-gradient-to-r from-red-400 to-red-600",
        empty: "bg-gradient-to-r from-slate-600 to-slate-700",
        default: "bg-gradient-to-r from-slate-600 to-slate-700",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

// Status indicator dot variants
export const statusDotVariants = cva("w-2 h-2 rounded-full", {
  variants: {
    status: {
      completed: "bg-green-500",
      warning: "bg-yellow-400",
      error: "bg-red-400",
      empty: "bg-slate-300",
    },
  },
  defaultVariants: {
    status: "empty",
  },
})

// Status badge variants
export const statusBadgeVariants = cva(
  "text-xs font-medium px-2 py-0.5 rounded-full",
  {
    variants: {
      status: {
        completed: "text-green-700 bg-green-50",
        warning: "text-yellow-700 bg-yellow-50",
        error: "text-red-700 bg-red-50",
        empty: "text-slate-700 bg-slate-100",
      },
    },
    defaultVariants: {
      status: "empty",
    },
  }
)

// Status types
export type ProgressStatus = "completed" | "warning" | "error" | "empty"

// Helper function to determine status based on missing count
export const getProgressStatus = (
  missingCount: number,
  totalRows: number
): ProgressStatus => {
  if (totalRows === 0) return "empty"
  if (missingCount === 0) return "completed"
  if (missingCount < 3) return "warning"
  return "error"
}

// Button variants using CVA
export const buttonVariants = cva(
  [
    "font-medium rounded-xl transition-all duration-500 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "flex items-center justify-center gap-2 tracking-wide",
    "relative overflow-hidden font-semibold",
    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-xl before:pointer-events-none",
    "hover:scale-[1.03] hover:-translate-y-0.5",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 text-white",
          "shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-600/40",
          "border border-blue-300/20 hover:border-blue-200/30 backdrop-blur-lg",
        ],
        secondary: [
          "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white",
          "shadow-xl shadow-slate-500/25 hover:shadow-2xl hover:shadow-slate-600/35",
          "border border-slate-300/20 hover:border-slate-200/30 backdrop-blur-lg",
        ],
        glass: [
          "bg-white/80 backdrop-blur-xl border border-white/50 text-slate-800",
          "shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/50",
          "hover:bg-white/90 hover:border-white/70",
        ],
        gradient: [
          "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white",
          "shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-teal-500/40",
          "border border-emerald-300/20 hover:border-emerald-200/30 backdrop-blur-lg",
        ],
        outline: [
          "bg-white/60 backdrop-blur-xl border-2 border-slate-300 text-slate-700",
          "shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-slate-300/40",
          "hover:bg-white/80 hover:border-slate-400 hover:text-slate-900",
        ],
      },
      size: {
        sm: "px-4 py-2.5 text-sm min-h-[36px]",
        md: "px-6 py-3.5 text-base min-h-[44px]",
        lg: "px-8 py-4.5 text-lg min-h-[52px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)
