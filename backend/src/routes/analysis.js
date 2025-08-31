const express = require('express')
const { Holding, RevenueAnalysis, User } = require('../models')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// 获取用户收益分析概览
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const { period = '1d' } = req.query

    // 计算日期范围
    const endDate = new Date()
    let startDate = new Date()

    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1)
        break
      case '5d':
        startDate.setDate(endDate.getDate() - 5)
        break
      case '15d':
        startDate.setDate(endDate.getDate() - 15)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      default:
        startDate.setDate(endDate.getDate() - 1)
    }

    // 获取用户所有持仓
    const holdings = await Holding.findAll({
      where: { userId: req.user.userId, isActive: true }
    })

    // 计算总资产、总成本、总收益
    const totalValue = holdings.reduce((sum, h) => sum + Number(h.marketValue || 0), 0)
    const totalCost = holdings.reduce((sum, h) => sum + Number(h.costPrice * h.quantity), 0)
    const totalProfit = holdings.reduce((sum, h) => sum + Number(h.profit || 0), 0)
    const totalProfitRate = totalCost > 0 ? (totalProfit / totalCost * 100) : 0

    // 获取收益分析数据
    const analysis = await RevenueAnalysis.findAll({
      where: {
        userId: req.user.userId,
        date: {
          $between: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    })

    // 计算统计指标
    const stats = {
      totalValue,
      totalCost,
      totalProfit,
      totalProfitRate,
      holdingCount: holdings.length,
      maxProfit: Math.max(...holdings.map(h => Number(h.profit || 0))),
      minProfit: Math.min(...holdings.map(h => Number(h.profit || 0))),
      avgProfitRate: holdings.length > 0 ? 
        holdings.reduce((sum, h) => sum + Number(h.profitRate || 0), 0) / holdings.length : 0
    }

    // 按分组统计
    const groupStats = {}
    holdings.forEach(h => {
      const group = h.group || '未分组'
      if (!groupStats[group]) {
        groupStats[group] = {
          count: 0,
          value: 0,
          profit: 0
        }
      }
      groupStats[group].count++
      groupStats[group].value += Number(h.marketValue || 0)
      groupStats[group].profit += Number(h.profit || 0)
    })

    res.json({
      stats,
      analysis,
      groupStats,
      holdings
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 获取持仓收益趋势
router.get('/trend/:holdingId', authMiddleware, async (req, res) => {
  try {
    const { holdingId } = req.params
    const { period = '30d' } = req.query

    // 验证持仓所有权
    const holding = await Holding.findOne({
      where: { id: holdingId, userId: req.user.userId }
    })

    if (!holding) {
      return res.status(404).json({ error: '持仓不存在' })
    }

    // 计算日期范围
    const endDate = new Date()
    let startDate = new Date()

    switch (period) {
      case '5d':
        startDate.setDate(endDate.getDate() - 5)
        break
      case '15d':
        startDate.setDate(endDate.getDate() - 15)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // 获取收益分析数据
    const analysis = await RevenueAnalysis.findAll({
      where: {
        holdingId,
        date: {
          $between: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    })

    res.json({ analysis })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 获取收益排名
router.get('/ranking', authMiddleware, async (req, res) => {
  try {
    const { type = 'profit', period = '1d' } = req.query

    // 获取用户所有持仓
    const holdings = await Holding.findAll({
      where: { userId: req.user.userId, isActive: true }
    })

    // 根据类型排序
    let sortedHoldings = [...holdings]

    switch (type) {
      case 'profit':
        sortedHoldings.sort((a, b) => Number(b.profit || 0) - Number(a.profit || 0))
        break
      case 'profitRate':
        sortedHoldings.sort((a, b) => Number(b.profitRate || 0) - Number(a.profitRate || 0))
        break
      case 'value':
        sortedHoldings.sort((a, b) => Number(b.marketValue || 0) - Number(a.marketValue || 0))
        break
    }

    res.json({ rankings: sortedHoldings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 生成分析报告
router.post('/report', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.body

    // 获取日期范围内的收益分析
    const analysis = await RevenueAnalysis.findAll({
      where: {
        userId: req.user.userId,
        date: {
          $between: [startDate, endDate]
        }
      },
      include: [{
        model: Holding,
        attributes: ['code', 'name', 'type', 'group']
      }],
      order: [['date', 'ASC']]
    })

    // 计算综合指标
    const dailyReturns = analysis.map(a => Number(a.dailyReturn || 0))
    const avgReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length
    const volatility = Math.sqrt(
      dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length
    )

    // 找出最佳和最差表现
    const bestDay = analysis.reduce((best, current) => 
      Number(current.dailyReturn || 0) > Number(best.dailyReturn || 0) ? current : best
    )
    const worstDay = analysis.reduce((worst, current) => 
      Number(current.dailyReturn || 0) < Number(worst.dailyReturn || 0) ? current : worst
    )

    // 按持仓统计
    const holdingStats = {}
    analysis.forEach(a => {
      const code = a.Holding.code
      if (!holdingStats[code]) {
        holdingStats[code] = {
          name: a.Holding.name,
          totalReturn: 0,
          days: 0,
          positiveDays: 0
        }
      }
      holdingStats[code].totalReturn += Number(a.dailyReturn || 0)
      holdingStats[code].days++
      if (Number(a.dailyReturn || 0) > 0) {
        holdingStats[code].positiveDays++
      }
    })

    const report = {
      period: { startDate, endDate },
      summary: {
        totalDays: analysis.length,
        avgDailyReturn: avgReturn,
        volatility: volatility,
        maxDrawdown: Math.min(...analysis.map(a => Number(a.maxDrawdown || 0))),
        bestDay,
        worstDay
      },
      holdingStats
    }

    res.json({ report })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router