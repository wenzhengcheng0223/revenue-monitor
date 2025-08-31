<template>
  <div class="space-y-6">
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

const holdingStore = useHoldingStore()

// 生成模拟的收益趋势数据
const trendData = computed(() => {
  const days = 30
  const data = []
  let value = 100000
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // 模拟每日波动
    const change = (Math.random() - 0.5) * 0.02
    value = value * (1 + change)
    
    data.push({
      date: date.toLocaleDateString('zh-CN'),
      value: value
    })
  }
  
  return data
})

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

onMounted(() => {
  holdingStore.fetchHoldings()
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(Math.round(num))
}
</script>