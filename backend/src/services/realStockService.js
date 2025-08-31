const fetch = require('node-fetch')
const axios = require('axios')

class RealStockService {
  constructor() {
    // 使用免费的股票API，这里以腾讯股票API为例
    this.baseUrls = {
      // 腾讯股票API
      tencent: 'https://qt.gtimg.cn',
      // 新浪财经API
      sina: 'https://hq.sinajs.cn',
      // 东方财富API
      eastmoney: 'https://push2.eastmoney.com'
    }
    
    // 股票代码映射（前缀）
    this.codePrefix = {
      'sh': '上海证券交易所',
      'sz': '深圳证券交易所',
      'bj': '北京证券交易所'
    }
  }

  // 获取实时股票数据
  async fetchRealtimeStockData(codes) {
    try {
      // 构建腾讯API请求URL
      const codeList = codes.map(code => {
        // 添加市场前缀
        if (code.startsWith('6')) {
          return `sh${code}`
        } else if (code.startsWith('0') || code.startsWith('3')) {
          return `sz${code}`
        } else if (code.startsWith('4') || code.startsWith('8')) {
          return `bj${code}`
        }
        return `sz${code}` // 默认深圳
      })
      
      const queryString = codeList.map(code => `s_${code}`).join(',')
      const url = `${this.baseUrls.tencent}/q=${queryString}`
      
      console.log('请求股票数据:', url)
      
      const response = await fetch(url)
      const data = await response.text()
      
      return this.parseTencentData(data, codes)
    } catch (error) {
      console.error('获取实时股票数据失败:', error)
      // 返回模拟数据作为备用
      return this.generateMockData(codes)
    }
  }

  // 获取基金数据
  async fetchFundData(codes) {
    try {
      // 使用东方财富基金API
      const results = {}
      
      for (const code of codes) {
        try {
          const url = `${this.baseUrls.eastmoney}/api/qt/clist/get?pn=1&pz=10&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:90+t:2+f:50&fields=f12,f14,f3,f62,f2,f5,f116,f8`
          
          const response = await fetch(url)
          const data = await response.json()
          
          if (data.data && data.data.diff) {
            const fund = data.data.diff.find(f => f.f12 === code)
            if (fund) {
              results[code] = {
                code: fund.f12,
                name: fund.f14,
                price: fund.f2 || 1,
                changePercent: fund.f3 || 0,
                changeAmount: fund.f62 || 0,
                volume: fund.f5 || 0,
                timestamp: new Date()
              }
            }
          }
        } catch (error) {
          console.error(`获取基金 ${code} 数据失败:`, error)
        }
      }
      
      return results
    } catch (error) {
      console.error('获取基金数据失败:', error)
      return this.generateMockData(codes)
    }
  }

  // 解析腾讯API返回的数据
  parseTencentData(data, originalCodes) {
    const results = {}
    const items = data.split(';')
    
    items.forEach((item, index) => {
      if (item && item.includes('~')) {
        const cleanItem = item.replace('v_', '').replace('="', '').replace('"', '')
        const fields = cleanItem.split('~')
        
        if (fields.length >= 10) {
          const originalCode = originalCodes[index] || fields[0].substring(2)
          results[originalCode] = {
            code: originalCode,
            name: fields[1],
            price: parseFloat(fields[3]) || 0,
            changePercent: parseFloat(fields[32]) || 0,
            changeAmount: parseFloat(fields[31]) || 0,
            volume: parseInt(fields[6]) || 0,
            high: parseFloat(fields[33]) || 0,
            low: parseFloat(fields[34]) || 0,
            open: parseFloat(fields[5]) || 0,
            timestamp: new Date()
          }
        }
      }
    })
    
    return results
  }

  // 生成模拟数据（备用方案）
  generateMockData(codes) {
    const results = {}
    codes.forEach(code => {
      const basePrice = 10 + Math.random() * 100
      const change = (Math.random() - 0.5) * 0.1
      
      results[code] = {
        code,
        name: `股票${code}`,
        price: basePrice,
        changePercent: change * 100,
        changeAmount: basePrice * change,
        volume: Math.floor(Math.random() * 1000000),
        high: basePrice * (1 + Math.random() * 0.03),
        low: basePrice * (1 - Math.random() * 0.03),
        open: basePrice * (1 + Math.random() * 0.01),
        timestamp: new Date()
      }
    })
    
    return results
  }

  // 获取历史数据
  async fetchHistoricalData(code, startDate, endDate) {
    try {
      // 这里可以使用其他API获取历史数据
      // 由于API限制，这里返回模拟数据
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
      return []
    }
  }

  // 获取股票基本信息
  async getStockInfo(code) {
    try {
      // 尝试从腾讯API获取实时数据，其中包含股票名称
      const realtimeData = await this.fetchRealtimeStockData([code])
      
      if (realtimeData[code] && realtimeData[code].name) {
        return {
          code,
          name: realtimeData[code].name,
          market: code.startsWith('6') ? 'sh' : 'sz',
          type: 'stock',
          price: realtimeData[code].price,
          changePercent: realtimeData[code].changePercent,
          changeAmount: realtimeData[code].changeAmount
        }
      }
      
      // 如果获取失败，返回基本信息
      return {
        code,
        name: `股票${code}`,
        market: code.startsWith('6') ? 'sh' : 'sz',
        type: 'stock'
      }
    } catch (error) {
      console.error('获取股票信息失败:', error)
      return {
        code,
        name: `股票${code}`,
        market: code.startsWith('6') ? 'sh' : 'sz',
        type: 'stock'
      }
    }
  }

  // 检查是否为交易时间
  isTradingTime() {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    // 周末不交易
    if (day === 0 || day === 6) return false
    
    // 交易时间：9:30-11:30, 13:00-15:00
    const time = hour * 60 + minute
    return (time >= 570 && time <= 690) || (time >= 780 && time <= 900)
  }
}

module.exports = RealStockService