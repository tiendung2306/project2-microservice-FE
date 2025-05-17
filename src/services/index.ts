import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost'

// Enum cho các service
export enum ServicePort {
  USER = import.meta.env.VITE_API_USER_SERVICE_PORT || '3000',
  AUTH = import.meta.env.VITE_API_AUTH_SERVICE_PORT || '3001',
  TASK = import.meta.env.VITE_API_TASK_SERVICE_PORT || '3002',
  NOTIFICATION = import.meta.env.VITE_API_NOTIFICATION_SERVICE_PORT || '3003'
}

// Factory function để tạo axios instance với port tương ứng
export const createAxiosInstance = (port: ServicePort) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}:${port}`,
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

export const userServiceAxiosInstance = createAxiosInstance(ServicePort.USER)
export const authServiceAxiosInstance = createAxiosInstance(ServicePort.AUTH)
export const taskServiceAxiosInstance = createAxiosInstance(ServicePort.TASK)
export const notificationServiceAxiosInstance = createAxiosInstance(ServicePort.NOTIFICATION)

export default userServiceAxiosInstance