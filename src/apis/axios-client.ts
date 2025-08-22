// import i18n from '@/i18n'

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"

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
axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // Do something before request is sent
    // config.headers['lang'] = i18n.language
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosClient.interceptors.response.use(function (response: AxiosResponse) {
  return response.data
})

export default axiosClient
