const cron = require('node-cron')
const { User } = require('../models')
const StockDataService = require('./stockDataService')
const RealStockService = require('./realStockService')

class TaskScheduler {
  // 获取所有用户ID
  static async getAllUserIds() {
    try {
      const users = await User.findAll({
        attributes: ['id']
      })
      return users.map(user => user.id)
    } catch (error) {
      console.error('获取用户ID失败:', error)
      return []
    }
  }

  static init() {
    // 每天收盘后更新数据（15:30）
    cron.schedule('30 15 * * 1-5', async () => {
      console.log('开始执行每日收盘数据更新任务...')
      try {
        const userIds = await this.getAllUserIds()
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
          await StockDataService.calculateRevenueAnalysis(userId)
        }
        
        console.log(`收盘数据更新完成，共更新 ${userIds.length} 个用户`)
      } catch (error) {
        console.error('每日收盘数据更新任务失败:', error)
      }
    })

    // 开盘前更新（9:00）
    cron.schedule('0 9 * * 1-5', async () => {
      console.log('开始执行开盘前数据更新任务...')
      try {
        const userIds = await this.getAllUserIds()
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
        }
        
        console.log(`开盘前数据更新完成，共更新 ${userIds.length} 个用户`)
      } catch (error) {
        console.error('开盘前数据更新任务失败:', error)
      }
    })

    // 上午收盘更新（11:30）
    cron.schedule('30 11 * * 1-5', async () => {
      console.log('开始执行上午收盘数据更新任务...')
      try {
        const userIds = await this.getAllUserIds()
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
        }
        
        console.log(`上午收盘数据更新完成，共更新 ${userIds.length} 个用户`)
      } catch (error) {
        console.error('上午收盘数据更新任务失败:', error)
      }
    })

    // 午盘开盘更新（13:00）
    cron.schedule('0 13 * * 1-5', async () => {
      console.log('开始执行午盘开盘数据更新任务...')
      try {
        const userIds = await this.getAllUserIds()
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
        }
        
        console.log(`午盘开盘数据更新完成，共更新 ${userIds.length} 个用户`)
      } catch (error) {
        console.error('午盘开盘数据更新任务失败:', error)
      }
    })

    // 交易时间内每30分钟更新一次（9:30-11:30, 13:00-15:00）
    cron.schedule('0,30 9-11,13-14 * * 1-5', async () => {
      console.log('开始执行交易时间价格更新任务...')
      try {
        const stockService = new RealStockService()
        
        // 检查是否为交易时间
        if (!stockService.isTradingTime()) {
          console.log('当前非交易时间，跳过更新')
          return
        }
        
        const userIds = await this.getAllUserIds()
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
        }
        
        console.log(`交易时间价格更新完成，共更新 ${userIds.length} 个用户`)
      } catch (error) {
        console.error('交易时间价格更新任务失败:', error)
      }
    })

    // 每天凌晨生成收益分析报告（00:30）
    cron.schedule('30 0 * * *', async () => {
      console.log('开始执行每日收益分析任务...')
      try {
        const userIds = await this.getAllUserIds()
        
        for (const userId of userIds) {
          await StockDataService.calculateRevenueAnalysis(userId)
        }
        
        console.log(`每日收益分析完成，共处理 ${userIds.length} 个用户`)
      } catch (error) {
        console.error('每日收益分析任务失败:', error)
      }
    })

    // 清理过期数据（每周日凌晨2点）
    cron.schedule('0 2 * * 0', async () => {
      console.log('开始执行数据清理任务...')
      try {
        // TODO: 添加数据清理逻辑
        console.log('数据清理任务完成')
      } catch (error) {
        console.error('数据清理任务失败:', error)
      }
    })

    console.log('定时任务已启动')
    console.log('- 交易时间每30分钟更新价格')
    console.log('- 收盘后执行完整数据更新')
    console.log('- 每日生成收益分析报告')
  }
}

module.exports = TaskScheduler