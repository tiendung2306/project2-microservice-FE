import type { User } from '@/types/user'
// import axiosInstance from '..'
import { authServiceAxiosInstance } from '@/services'
import { useUserStore } from '@/stores/userStore'
import type { Token } from '@/types/token'
export const login = async (email: string, password: string) => {
  try {
    const response = await authServiceAxiosInstance.post('/api/auth/login', {
      email,
      password,
    })
    console.log(response.data)

    if (response.status === 200) {
      const user: User = response.data;
      const token: Token = {
        accessToken: response.data.token,
        refreshToken: response.data.refresh_token
      }

      const userStore = useUserStore()
      userStore.setUser(user)
      userStore.setToken(token)
      console.log(user, token)
      return user
    }

  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const register = async (username: string, email: string, password: string, confirmPassword: string) => {
  try {
    const response = await authServiceAxiosInstance.post('/api/auth/register', {
      username,
      email,
      password,
    })
    if (response.status === 201) {
      return response.data
    }
    else {
      throw new Error(response.data.error)
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await authServiceAxiosInstance.post('/api/auth/refresh-token', {
      refreshToken
    })

    if (response.status === 200) {
      const token: Token = { accessToken: response.data.token, refreshToken: response.data.refresh_token }
      const userStore = useUserStore()
      userStore.setToken(token)
      return token
    }
  } catch (error) {
    console.error('Refresh token error:', error)
    throw error
  }
}