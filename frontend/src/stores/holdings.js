import { defineStore } from 'pinia'
import { holdingsApi } from '@/api'

export const useHoldingStore = defineStore('holdings', {
  state: () => ({
    holdings: [],
    loading: false,
    error: null
  }),

  getters: {
    totalValue: (state) => {
      return state.holdings.reduce((sum, h) => sum + Number(h.marketValue || 0), 0)
    },
    totalCost: (state) => {
      return state.holdings.reduce((sum, h) => sum + Number(h.costPrice * h.quantity), 0)
    },
    totalProfit: (state) => {
      return state.holdings.reduce((sum, h) => sum + Number(h.profit || 0), 0)
    },
    totalProfitRate: (state) => {
      const cost = state.holdings.reduce((sum, h) => sum + Number(h.costPrice * h.quantity), 0)
      const profit = state.holdings.reduce((sum, h) => sum + Number(h.profit || 0), 0)
      return cost > 0 ? (profit / cost * 100) : 0
    },
    groupedHoldings: (state) => {
      const groups = {}
      state.holdings.forEach(h => {
        const group = h.group || '未分组'
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(h)
      })
      return groups
    }
  },

  actions: {
    async fetchHoldings() {
      this.loading = true
      try {
        const response = await holdingsApi.getHoldings()
        this.holdings = response.holdings
        this.error = null
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addHolding(data) {
      try {
        const response = await holdingsApi.addHolding(data)
        this.holdings.unshift(response.holding)
        return response
      } catch (error) {
        throw error
      }
    },

    async updateHolding(id, data) {
      try {
        const response = await holdingsApi.updateHolding(id, data)
        const index = this.holdings.findIndex(h => h.id === id)
        if (index !== -1) {
          this.holdings[index] = response.holding
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async deleteHolding(id) {
      try {
        await holdingsApi.deleteHolding(id)
        this.holdings = this.holdings.filter(h => h.id !== id)
      } catch (error) {
        throw error
      }
    },

    async importHoldings(data) {
      try {
        const response = await holdingsApi.importHoldings(data)
        await this.fetchHoldings() // 重新获取所有持仓
        return response
      } catch (error) {
        throw error
      }
    }
  }
})