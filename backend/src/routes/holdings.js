const express = require('express')
const { Holding, RevenueAnalysis } = require('../models')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// 获取用户持仓列表
router.get('/', authMiddleware, async (req, res) => {
  try {
    const holdings = await Holding.findAll({
      where: { userId: req.user.userId, isActive: true },
      order: [['createdAt', 'DESC']]
    })

    res.json({ holdings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 添加持仓
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, name, type, quantity, costPrice, group, note } = req.body

    const marketValue = quantity * costPrice
    const profit = 0
    const profitRate = 0

    const holding = await Holding.create({
      userId: req.user.userId,
      code,
      name,
      type,
      quantity,
      costPrice,
      currentPrice: costPrice,
      marketValue,
      profit,
      profitRate,
      group,
      note
    })

    res.status(201).json({
      message: '持仓添加成功',
      holding
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 更新持仓
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { quantity, costPrice, group, note } = req.body

    const holding = await Holding.findOne({
      where: { id, userId: req.user.userId }
    })

    if (!holding) {
      return res.status(404).json({ error: '持仓不存在' })
    }

    const updateData = { quantity, costPrice, group, note }
    if (quantity && costPrice) {
      updateData.marketValue = quantity * costPrice
      updateData.profit = (holding.currentPrice || costPrice) - costPrice * quantity
      updateData.profitRate = ((holding.currentPrice || costPrice) - costPrice) / costPrice
    }

    await holding.update(updateData)

    res.json({
      message: '持仓更新成功',
      holding
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 删除持仓
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const holding = await Holding.findOne({
      where: { id, userId: req.user.userId }
    })

    if (!holding) {
      return res.status(404).json({ error: '持仓不存在' })
    }

    await holding.update({ isActive: false })

    res.json({ message: '持仓删除成功' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 获取持仓详情
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const holding = await Holding.findOne({
      where: { id, userId: req.user.userId, isActive: true }
    })

    if (!holding) {
      return res.status(404).json({ error: '持仓不存在' })
    }

    // 获取最近的收益分析
    const analysis = await RevenueAnalysis.findAll({
      where: { holdingId: id },
      order: [['date', 'DESC']],
      limit: 30
    })

    res.json({ holding, analysis })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 批量导入持仓
router.post('/import', authMiddleware, async (req, res) => {
  try {
    const { holdings } = req.body
    const results = []

    for (const item of holdings) {
      try {
        const marketValue = item.quantity * item.costPrice
        const holding = await Holding.create({
          userId: req.user.userId,
          code: item.code,
          name: item.name,
          type: item.type || 'stock',
          quantity: item.quantity,
          costPrice: item.costPrice,
          currentPrice: item.costPrice,
          marketValue,
          profit: 0,
          profitRate: 0,
          group: item.group,
          note: item.note
        })
        results.push({ success: true, data: holding })
      } catch (error) {
        results.push({ success: false, error: error.message, data: item })
      }
    }

    res.json({
      message: '批量导入完成',
      results
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router