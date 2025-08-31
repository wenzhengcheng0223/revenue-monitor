import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    // 初始化认证状态
    async initAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        try {
          await this.getProfile()
        } catch (error) {
          console.warn('Token 可能已过期，清除认证状态:', error)
          this.logout()
        }
      }
    },

    async login(credentials) {
      try {
        const response = await authApi.login(credentials)
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        localStorage.setItem('token', response.token)
        return response
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await authApi.register(userData)
        return response
      } catch (error) {
        throw error
      }
    },

    async getProfile() {
      try {
        const response = await authApi.getProfile()
        this.user = response.user
        this.isAuthenticated = true
        return response
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    }
  }
})