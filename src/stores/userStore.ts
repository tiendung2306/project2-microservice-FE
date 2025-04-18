import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => !!state.user && !!state.token,
  },
  actions: {
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user)) // Lưu vào localStorage
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token) // Lưu vào localStorage
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user') // Xóa khỏi localStorage
      localStorage.removeItem('token') // Xóa khỏi localStorage
    },
  },
})
