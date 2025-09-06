"use client"

import { toast, Toaster, resolveValue } from "react-hot-toast"

// Custom Toast Component với glassmorphism style
const CustomToast = ({ t }: { t: any }) => {
  const isSuccess = t.type === "success"
  const isError = t.type === "error"
  const isLoading = t.type === "loading"

  const getIcon = () => {
    if (isSuccess) {
      return (
        <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      )
    }

    if (isError) {
      return (
        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      )
    }

    return (
      <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    )
  }

  const getBorderColor = () => {
    if (isSuccess) return "border-slate-200/60"
    if (isError) return "border-slate-300/60"
    if (isLoading) return "border-slate-200/50"
    return "border-slate-200/50"
  }

  const getBackgroundGradient = () => {
    if (isSuccess) return "from-slate-50/90 to-white/90"
    if (isError) return "from-slate-100/90 to-white/90"
    if (isLoading) return "from-slate-50/80 to-white/80"
    return "from-slate-50/80 to-white/80"
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${
          t.visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2"
        }
      `}
    >
      <div
        className={`
        backdrop-blur-md bg-gradient-to-r ${getBackgroundGradient()}
        border ${getBorderColor()} 
        rounded-lg p-4 flex items-center gap-3 
        shadow-lg soft-shadow min-w-[250px] max-w-[400px]
        transition-all duration-300
        hover:shadow-xl hover:backdrop-blur-lg
      `}
      >
        {getIcon()}

        <div className="flex-1 min-w-0">
          <div className="text-slate-800 font-medium text-sm leading-5">
            {resolveValue(t.message, t)}
          </div>
        </div>

        {/* Close button for non-loading toasts */}
        {!isLoading && (
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors duration-200 rounded-full hover:bg-slate-100/50"
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
  )
}

// Custom Toaster Component
export default function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          margin: 0,
        },
        success: {
          duration: 4000,
        },
        error: {
          duration: 6000,
        },
        loading: {
          duration: Infinity,
        },
      }}
    >
      {(t) => <CustomToast t={t} />}
    </Toaster>
  )
}
