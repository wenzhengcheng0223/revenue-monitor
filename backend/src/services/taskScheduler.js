const cron = require('node-cron')
const StockDataService = require('./stockDataService')

class TaskScheduler {
  static init() {
    // 每天收盘后更新数据（15:30）
    cron.schedule('30 15 * * 1-5', async () => {
      console.log('开始执行每日数据更新任务...')
      try {
        // TODO: 获取所有用户ID
        const userIds = [1] // 临时写死，实际应该从数据库获取
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
          await StockDataService.calculateRevenueAnalysis(userId)
        }
        
        console.log('每日数据更新任务完成')
      } catch (error) {
        console.error('每日数据更新任务失败:', error)
      }
    })

    // 每小时更新一次价格（交易时间）
    cron.schedule('0 9-15 * * 1-5', async () => {
      console.log('开始执行小时价格更新任务...')
      try {
        const userIds = [1]
        
        for (const userId of userIds) {
          await StockDataService.updateHoldingPrices(userId)
        }
        
        console.log('小时价格更新任务完成')
      } catch (error) {
        console.error('小时价格更新任务失败:', error)
      }
    })

    console.log('定时任务已启动')
  }
}

module.exports = TaskScheduler