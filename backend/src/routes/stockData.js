const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const StockDataService = require('../services/stockDataService')
const RealStockService = require('../services/realStockService')

// 手动刷新持仓价格
router.post('/refresh-prices', auth, async (req, res) => {
  try {
    const userId = req.user.userId
    
    console.log(`用户 ${userId} 手动刷新持仓价格`)
    console.log('完整的用户信息:', req.user)
    
    await StockDataService.updateHoldingPrices(userId)
    
    res.json({
      success: true,
      message: '持仓价格刷新成功',
      timestamp: new Date()
    })
  } catch (error) {
    console.error('手动刷新持仓价格失败:', error)
    res.status(500).json({
      success: false,
      message: '刷新失败',
      error: error.message
    })
  }
})

// 获取指定代码的实时价格
router.get('/realtime/:codes', auth, async (req, res) => {
  try {
    const codes = req.params.codes.split(',').map(code => code.trim())
    
    if (codes.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供股票/基金代码'
      })
    }
    
    const data = await StockDataService.fetchRealtimeData(codes)
    
    res.json({
      success: true,
      data,
      count: Object.keys(data).length,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('获取实时价格失败:', error)
    res.status(500).json({
      success: false,
      message: '获取价格失败',
      error: error.message
    })
  }
})

// 获取历史数据
router.get('/history/:code', auth, async (req, res) => {
  try {
    const { code } = req.params
    const { startDate, endDate } = req.query
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '请提供开始日期和结束日期'
      })
    }
    
    const data = await StockDataService.fetchHistoricalData(code, startDate, endDate)
    
    res.json({
      success: true,
      data,
      count: data.length,
      code,
      period: `${startDate} 至 ${endDate}`
    })
  } catch (error) {
    console.error('获取历史数据失败:', error)
    res.status(500).json({
      success: false,
      message: '获取历史数据失败',
      error: error.message
    })
  }
})

// 检查交易时间
router.get('/trading-status', auth, async (req, res) => {
  try {
    const stockService = new RealStockService()
    const isTradingTime = stockService.isTradingTime()
    
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    res.json({
      success: true,
      isTradingTime,
      currentDay: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day],
      currentTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      nextTradingSession: this.getNextTradingSession(now)
    })
  } catch (error) {
    console.error('检查交易状态失败:', error)
    res.status(500).json({
      success: false,
      message: '检查交易状态失败',
      error: error.message
    })
  }
})

// 获取下一个交易时段
function getNextTradingSession(currentTime) {
  const day = currentTime.getDay()
  const hour = currentTime.getHours()
  const minute = currentTime.getMinutes()
  const time = hour * 60 + minute
  
  // 周末无交易
  if (day === 0 || day === 6) {
    return {
      type: 'next_open',
      time: '周一 09:00',
      isWeekend: true
    }
  }
  
  // 交易时间判断
  if (time < 540) { // 9:00前
    return {
      type: 'morning_open',
      time: '今日 09:00',
      isWeekend: false
    }
  } else if (time >= 540 && time < 690) { // 9:00-11:30
    return {
      type: 'morning_session',
      time: '11:30',
      isWeekend: false
    }
  } else if (time >= 690 && time < 780) { // 11:30-13:00
    return {
      type: 'afternoon_open',
      time: '13:00',
      isWeekend: false
    }
  } else if (time >= 780 && time < 900) { // 13:00-15:00
    return {
      type: 'afternoon_session',
      time: '15:00',
      isWeekend: false
    }
  } else { // 15:00后
    return {
      type: 'next_open',
      time: day === 5 ? '周一 09:00' : '明日 09:00',
      isWeekend: day === 5
    }
  }
}

// 根据股票代码获取股票信息
router.get('/info/:code', auth, async (req, res) => {
  try {
    const { code } = req.params
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: '请提供股票/基金代码'
      })
    }
    
    const stockService = new RealStockService()
    const info = await stockService.getStockInfo(code)
    
    if (!info) {
      return res.status(404).json({
        success: false,
        message: '未找到该股票/基金信息'
      })
    }
    
    res.json({
      success: true,
      data: info
    })
  } catch (error) {
    console.error('获取股票信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取股票信息失败',
      error: error.message
    })
  }
})

// 批量获取股票信息
router.post('/batch-info', auth, async (req, res) => {
  try {
    const { codes } = req.body
    
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供股票/基金代码数组'
      })
    }
    
    const stockService = new RealStockService()
    const results = {}
    
    for (const code of codes) {
      try {
        const info = await stockService.getStockInfo(code)
        if (info) {
          results[code] = info
        }
      } catch (error) {
        console.error(`获取股票 ${code} 信息失败:`, error)
      }
    }
    
    res.json({
      success: true,
      data: results,
      count: Object.keys(results).length
    })
  } catch (error) {
    console.error('批量获取股票信息失败:', error)
    res.status(500).json({
      success: false,
      message: '批量获取信息失败',
      error: error.message
    })
  }
})

module.exports = router