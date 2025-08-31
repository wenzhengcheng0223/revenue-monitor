<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">监控面板</h1>
        <p class="mt-1 text-sm text-gray-500">查看您的投资组合概览</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="refreshPrices" 
          :disabled="isRefreshing"
          class="btn btn-primary flex items-center space-x-2"
          :class="{ 'opacity-50 cursor-not-allowed': isRefreshing }"
        >
          <svg 
            class="w-4 h-4 animate-spin" 
            :class="{ 'hidden': !isRefreshing }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg 
            class="w-4 h-4" 
            :class="{ 'hidden': isRefreshing }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isRefreshing ? '刷新中...' : '刷新价格' }}</span>
        </button>
      </div>
    </div>

    <!-- 总览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总资产</p>
            <p class="text-2xl font-bold text-gray-900">¥{{ formatNumber(holdingStore.totalValue) }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总成本</p>
            <p class="text-2xl font-bold text-gray-900">¥{{ formatNumber(holdingStore.totalCost) }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="holdingStore.totalProfit >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总盈亏</p>
            <p class="text-2xl font-bold" :class="holdingStore.totalProfit >= 0 ? 'text-up' : 'text-down'">
              ¥{{ formatNumber(holdingStore.totalProfit) }}
            </p>
          </div>
          <div class="p-3 rounded-full shadow-lg" :class="holdingStore.totalProfit >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="holdingStore.totalProfitRate >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">收益率</p>
            <p class="text-2xl font-bold" :class="holdingStore.totalProfitRate >= 0 ? 'text-up' : 'text-down'">
              {{ holdingStore.totalProfitRate.toFixed(2) }}%
            </p>
          </div>
          <div class="p-3 rounded-full shadow-lg" :class="holdingStore.totalProfitRate >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益趋势图 -->
    <div class="card-gradient">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">收益趋势</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">30天</span>
        </div>
      </div>
      <div class="relative bg-white rounded-lg p-4 shadow-sm">
        <div v-if="loadingTrendData" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div class="text-center">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-gray-600">正在加载价格走势数据...</p>
          </div>
        </div>
        <Chart :options="trendChartOptions" height="350px" />
      </div>
    </div>

    <!-- 持仓列表 -->
    <div class="card-gradient">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">我的持仓</h3>
        <router-link to="/holdings" class="text-primary hover:text-primary-700 flex items-center space-x-1">
          <span>查看全部</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成本价</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">现价</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">盈亏</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="holding in holdingStore.holdings.slice(0, 5)" :key="holding.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="holding.type === 'stock' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'">
                      {{ holding.type === 'stock' ? '股' : '基' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ holding.name }}</div>
                    <div class="text-sm text-gray-500">{{ holding.code }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ holding.quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ¥{{ holding.costPrice }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ¥{{ holding.currentPrice || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-medium" :class="holding.profit >= 0 ? 'text-up' : 'text-down'">
                    ¥{{ formatNumber(holding.profit) }}
                  </div>
                  <div class="text-xs px-2 py-1 rounded-full" :class="holding.profit >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                    {{ holding.profit >= 0 ? '+' : '' }}{{ (holding.profitRate || 0).toFixed(2) }}%
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHoldingStore } from '@/stores/holdings'
import Chart from '@/components/Chart.vue'
import * as echarts from 'echarts'
import stockDataApi from '@/api/stockData'

const holdingStore = useHoldingStore()
const isRefreshing = ref(false)

// 获取真实的收益趋势数据
const trendData = ref([])
const loadingTrendData = ref(false)

// 获取近一个月的价格走势数据
const fetchTrendData = async () => {
  loadingTrendData.value = true
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30) // 30天前
    
    // 获取所有持仓代码
    const codes = holdingStore.holdings.map(h => h.code)
    
    if (codes.length === 0) {
      // 如果没有持仓，生成空数据
      generateEmptyTrendData()
      return
    }
    
    // 为每个持仓获取历史数据
    const allHistoricalData = []
    
    for (const code of codes) {
      try {
        const response = await stockDataApi.getHistoricalData(
          code,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        )
        
        if (response.data && response.data.length > 0) {
          allHistoricalData.push(...response.data)
        }
      } catch (error) {
        console.warn(`获取 ${code} 历史数据失败:`, error)
      }
    }
    
    // 处理历史数据，按日期聚合
    const aggregatedData = aggregateHistoricalData(allHistoricalData)
    trendData.value = aggregatedData
    
  } catch (error) {
    console.error('获取趋势数据失败:', error)
    // 如果获取真实数据失败，显示空数据而不是模拟数据
    generateEmptyTrendData()
  } finally {
    loadingTrendData.value = false
  }
}

// 聚合历史数据
const aggregateHistoricalData = (data) => {
  const dailyValues = {}
  
  data.forEach(item => {
    const date = new Date(item.date).toLocaleDateString('zh-CN')
    if (!dailyValues[date]) {
      dailyValues[date] = 0
    }
    // 简单计算：使用收盘价作为当日价值
    dailyValues[date] += item.close || 0
  })
  
  // 转换为数组并按日期排序
  const result = Object.entries(dailyValues)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  
  // 如果数据不足30天，填充前面的日期
  if (result.length < 30) {
    const filledData = []
    const endDate = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('zh-CN')
      
      const existingData = result.find(item => item.date === dateStr)
      if (existingData) {
        filledData.push(existingData)
      } else {
        // 使用前一个值或初始值
        const prevValue = filledData.length > 0 ? filledData[filledData.length - 1].value : 100000
        filledData.push({
          date: dateStr,
          value: prevValue
        })
      }
    }
    
    return filledData
  }
  
  return result
}


// 生成空趋势数据
const generateEmptyTrendData = () => {
  const days = 30
  const data = []
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toLocaleDateString('zh-CN'),
      value: 0
    })
  }
  
  trendData.value = data
}

const trendChartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      const data = params[0]
      return `${data.name}<br/>总资产: ¥${formatNumber(data.value)}`
    }
  },
  xAxis: {
    type: 'category',
    data: trendData.value.map(d => d.date),
    axisLabel: {
      interval: Math.floor(trendData.value.length / 5)
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: function(value) {
        return '¥' + (value / 10000).toFixed(0) + '万'
      }
    }
  },
  series: [{
    data: trendData.value.map(d => d.value),
    type: 'line',
    smooth: true,
    lineStyle: {
      color: holdingStore.totalProfit >= 0 ? 'var(--profit-up)' : 'var(--profit-down)'
    },
    areaStyle: {
      color: holdingStore.totalProfit >= 0 ? 
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: 'rgba(239, 68, 68, 0.3)'
        }, {
          offset: 1, color: 'rgba(239, 68, 68, 0.05)'
        }]) : 
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: 'rgba(16, 185, 129, 0.3)'
        }, {
          offset: 1, color: 'rgba(16, 185, 129, 0.05)'
        }])
    }
  }]
}))

onMounted(async () => {
  await holdingStore.fetchHoldings()
  fetchTrendData()
})

// 刷新持仓价格
const refreshPrices = async () => {
  try {
    isRefreshing.value = true
    await stockDataApi.refreshPrices()
    await holdingStore.fetchHoldings()
    
    // 刷新后重新获取趋势数据
    await fetchTrendData()
    
    // 显示成功消息
    alert('价格刷新成功！')
  } catch (error) {
    console.error('刷新价格失败:', error)
    alert('刷新失败，请稍后重试')
  } finally {
    isRefreshing.value = false
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(Math.round(num))
}
</script>