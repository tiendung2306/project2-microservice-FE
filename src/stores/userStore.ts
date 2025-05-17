import type { Token } from '@/types/token'
import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),
  getters: {
    getUser: (state) => state.user,
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
    isLoggedIn: (state) => !!state.user && !!state.accessToken,
  },
  actions: {
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user)) // Lưu vào localStorage
    },
    setToken(token: Token) {
      this.accessToken = token.accessToken
      this.refreshToken = token.refreshToken
      localStorage.setItem('accessToken', token.accessToken) // Lưu vào localStorage
      localStorage.setItem('refreshToken', token.refreshToken) // Lưu vào localStorage
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken) // Lưu vào localStorage
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken) // Lưu vào localStorage
    },
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('user') // Xóa khỏi localStorage
      localStorage.removeItem('accessToken') // Xóa khỏi localStorage
      localStorage.removeItem('refreshToken') // Xóa khỏi localStorage
    },
  },
})
