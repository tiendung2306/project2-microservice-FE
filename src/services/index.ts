import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost'
const API_GATEWAY_PORT = import.meta.env.VITE_API_GATEWAY_PORT || '3005'

// Enum cho các service paths
export enum ServicePath {
  USER = '/user',
  AUTH = '/auth',
  TASK = '/task',
  NOTIFICATION = '/notification',
  DASHBOARD = '/dashboard'
}

// Factory function để tạo axios instance với path tương ứng
export const createAxiosInstance = (path: ServicePath) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}:${API_GATEWAY_PORT}${path}`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Nếu lỗi 401 và chưa thử refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Gọi API refresh token
          const { refreshToken } = await import('./auth/authService')
          await refreshToken()

          // Cập nhật token mới vào header
          const newToken = localStorage.getItem('accessToken')
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          // Thử lại request ban đầu
          return instance(originalRequest)
        } catch (refreshError) {
          // Nếu refresh token thất bại, logout và chuyển về trang login
          const userStore = useUserStore()
          userStore.logout()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}

export const userServiceAxiosInstance = createAxiosInstance(ServicePath.USER)
export const authServiceAxiosInstance = createAxiosInstance(ServicePath.AUTH)
export const taskServiceAxiosInstance = createAxiosInstance(ServicePath.TASK)
export const notificationServiceAxiosInstance = createAxiosInstance(ServicePath.NOTIFICATION)
export const dashboardServiceAxiosInstance = createAxiosInstance(ServicePath.DASHBOARD)
export default userServiceAxiosInstance