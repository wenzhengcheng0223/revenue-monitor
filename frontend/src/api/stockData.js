import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const stockDataApi = {
  // 手动刷新持仓价格
  async refreshPrices() {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${API_URL}/stock-data/refresh-prices`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response.data
  },

  // 获取实时价格
  async getRealtimePrices(codes) {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `${API_URL}/stock-data/realtime/${codes}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response.data
  },

  // 获取历史数据
  async getHistoricalData(code, startDate, endDate) {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `${API_URL}/stock-data/history/${code}`,
      {
        params: { startDate, endDate },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response.data
  },

  // 检查交易状态
  async getTradingStatus() {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `${API_URL}/stock-data/trading-status`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response.data
  },

  // 批量获取股票信息
  async getBatchInfo(codes) {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${API_URL}/stock-data/batch-info`,
      { codes },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response.data
  }
}

export default stockDataApi