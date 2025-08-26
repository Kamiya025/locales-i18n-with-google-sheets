// import i18n from '@/i18n'

import axios, { AxiosResponse } from "axios"

const axiosClient = axios.create({
  baseURL: "/api/",
  headers: {
    // 'Content-Type': 'application/json',
    // 'X-XSS-Protection': '1; mode=block',
    // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    // // 'Access-Control-Allow-Headers': '*',
    // 'Cache-Control': 'no-store, no-ca/che, must-revalidate, max-age=0',
  },
  timeout: !isNaN(Number(process.env.NEXT_PUBLIC_TIME_OUT_API))
    ? Number(process.env.NEXT_PUBLIC_TIME_OUT_API)
    : 60000,
})

// Add a request interceptor

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    const data = response.data

    // Check if response follows new ApiResponse format
    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      "data" in data
    ) {
      // For successful ApiResponse, return the data field directly
      // This maintains backward compatibility with existing frontend code
      if (data.success) {
        return data.data
      } else {
        // For failed ApiResponse, throw error with message
        const error = new Error(data.message ?? data.error ?? "API Error")
        error.name = data.error ?? "ApiError"
        throw error
      }
    }

    // Fallback to original behavior for non-ApiResponse format
    return data
  },
  function (error) {
    // Enhanced error handling for format validation errors
    if (error.response?.data) {
      const errorData = error.response.data

      // Handle format validation errors specially
      if (errorData.type === "FORMAT_ERROR" && errorData.suggestion) {
        const enhancedError = new Error(errorData.message)
        enhancedError.name = "FormatValidationError"
        ;(enhancedError as any).suggestion = errorData.suggestion
        ;(enhancedError as any).type = errorData.type
        throw enhancedError
      }

      // Handle 403 auth errors specially - preserve response data
      if (error.response?.status === 403 && errorData.needsAuth !== undefined) {
        // Keep original axios error with response data for auth handling
        throw error
      }

      // Handle regular errors
      if (errorData.message) {
        const regularError = new Error(errorData.message)
        regularError.name = errorData.error ?? "ApiError"
        throw regularError
      }
    }

    // Default error handling
    throw error
  }
)

export default axiosClient
