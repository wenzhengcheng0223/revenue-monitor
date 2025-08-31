import api from './request'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me')
}

export const holdingsApi = {
  getHoldings: () => api.get('/holdings'),
  getHolding: (id) => api.get(`/holdings/${id}`),
  addHolding: (data) => api.post('/holdings', data),
  updateHolding: (id, data) => api.put(`/holdings/${id}`, data),
  deleteHolding: (id) => api.delete(`/holdings/${id}`),
  importHoldings: (data) => api.post('/holdings/import', data)
}

export const analysisApi = {
  getOverview: (params) => api.get('/analysis/overview', { params }),
  getTrend: (holdingId, params) => api.get(`/analysis/trend/${holdingId}`, { params }),
  getRanking: (params) => api.get('/analysis/ranking', { params }),
  generateReport: (data) => api.post('/analysis/report', data)
}

export const stockApi = {
  getStockInfo: (code) => api.get(`/stock-data/info/${code}`),
  getRealtimeData: (codes) => api.get(`/stock-data/realtime/${codes}`),
  getHistoricalData: (code, startDate, endDate) => api.get(`/stock-data/history/${code}`, { params: { startDate, endDate } }),
  batchGetStockInfo: (codes) => api.post('/stock-data/batch-info', { codes }),
  refreshPrices: () => api.post('/stock-data/refresh-prices'),
  getTradingStatus: () => api.get('/stock-data/trading-status')
}