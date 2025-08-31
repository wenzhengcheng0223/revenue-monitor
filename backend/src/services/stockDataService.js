const axios = require('axios')
const { Holding, StockData, RevenueAnalysis } = require('../models')

class StockDataService {
  // 获取实时股价数据
  static async fetchRealtimeData(codes) {
    try {
      // 这里应该接入真实的股票数据API
      // 以下是模拟数据
      const mockData = {}
      codes.forEach(code => {
        const change = (Math.random() - 0.5) * 0.1 // -5% 到 +5%
        mockData[code] = {
          code,
          name: `股票${code}`,
          price: 10 + Math.random() * 100,
          changePercent: change,
          changeAmount: change * (10 + Math.random() * 100),
          volume: Math.floor(Math.random() * 1000000),
          timestamp: new Date()
        }
      })
      return mockData
    } catch (error) {
      console.error('获取实时数据失败:', error)
      throw error
    }
  }

  // 获取历史行情数据
  static async fetchHistoricalData(code, startDate, endDate) {
    try {
      // 这里应该接入真实的股票数据API
      // 以下是模拟数据
      const data = []
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0 || d.getDay() === 6) continue // 跳过周末
        
        const basePrice = 10 + Math.random() * 100
        const change = (Math.random() - 0.5) * 0.05
        
        data.push({
          code,
          date: new Date(d),
          open: basePrice,
          high: basePrice * (1 + Math.random() * 0.03),
          low: basePrice * (1 - Math.random() * 0.03),
          close: basePrice * (1 + change),
          volume: Math.floor(Math.random() * 1000000),
          amount: basePrice * Math.floor(Math.random() * 1000000),
          changePercent: change * 100,
          changeAmount: basePrice * change
        })
      }
      
      return data
    } catch (error) {
      console.error('获取历史数据失败:', error)
      throw error
    }
  }

  // 更新持仓的当前价格
  static async updateHoldingPrices(userId) {
    try {
      const holdings = await Holding.findAll({
        where: { userId, isActive: true }
      })

      if (holdings.length === 0) return

      const codes = holdings.map(h => h.code)
      const realtimeData = await this.fetchRealtimeData(codes)

      for (const holding of holdings) {
        const data = realtimeData[holding.code]
        if (data) {
          const currentPrice = data.price
          const marketValue = holding.quantity * currentPrice
          const profit = marketValue - (holding.costPrice * holding.quantity)
          const profitRate = (currentPrice - holding.costPrice) / holding.costPrice

          await holding.update({
            currentPrice,
            marketValue,
            profit,
            profitRate
          })

          // 保存到历史数据
          await StockData.upsert({
            code: holding.code,
            name: holding.name,
            date: new Date(),
            open: currentPrice,
            high: currentPrice * 1.02,
            low: currentPrice * 0.98,
            close: currentPrice,
            volume: data.volume,
            amount: data.volume * currentPrice,
            changePercent: data.changePercent,
            changeAmount: data.changeAmount
          })
        }
      }

      console.log(`更新了 ${holdings.length} 个持仓的价格`)
    } catch (error) {
      console.error('更新持仓价格失败:', error)
      throw error
    }
  }

  // 计算收益分析
  static async calculateRevenueAnalysis(userId, date = new Date()) {
    try {
      const holdings = await Holding.findAll({
        where: { userId, isActive: true }
      })

      const totalValue = holdings.reduce((sum, h) => sum + Number(h.marketValue || 0), 0)
      const totalCost = holdings.reduce((sum, h) => sum + Number(h.costPrice * h.quantity), 0)
      const totalProfit = holdings.reduce((sum, h) => sum + Number(h.profit || 0), 0)

      // 计算每日收益率（简化版，实际应该基于历史数据）
      const dailyReturn = totalCost > 0 ? 
        (totalValue - totalCost) / totalCost / 365 : 0

      // 为每个持仓创建分析记录
      for (const holding of holdings) {
        await RevenueAnalysis.create({
          userId,
          holdingId: holding.id,
          date: date.toISOString().split('T')[0],
          dailyReturn,
          cumulativeReturn: Number(holding.profitRate || 0),
          maxDrawdown: 0, // 需要基于历史数据计算
          volatility: 0,  // 需要基于历史数据计算
          sharpeRatio: 0, // 需要基于历史数据计算
          totalValue: Number(holding.marketValue || 0),
          totalProfit: Number(holding.profit || 0),
          totalCost: Number(holding.costPrice * holding.quantity)
        })
      }

      console.log(`为用户 ${userId} 生成了收益分析数据`)
    } catch (error) {
      console.error('计算收益分析失败:', error)
      throw error
    }
  }
}

module.exports = StockDataService