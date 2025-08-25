import toast from "react-hot-toast"

export { default as CustomToaster } from "./CustomToaster"

export const customToast = {
  success: (message: string) => {
    return toast.success(message)
  },

  error: (message: string) => {
    return toast.error(message)
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toast.promise(promise, msgs)
  },

  custom: (message: string, options?: any) => {
    return toast.custom(message, options)
  },

  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId)
  },
}
