<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">分析报告</h1>
      <p class="mt-1 text-sm text-gray-500">查看您的投资组合表现和分析</p>
    </div>

    <!-- 时间选择器 -->
    <div class="card-gradient">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">分析周期</label>
          <select v-model="selectedPeriod" @change="fetchAnalysis" class="input" style="width: auto;">
            <option value="1d">近1天</option>
            <option value="5d">近5天</option>
            <option value="15d">近15天</option>
            <option value="30d">近30天</option>
          </select>
        </div>
        <button @click="generateReport" class="btn btn-primary flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>生成报告</span>
        </button>
      </div>
    </div>

    <!-- 收益统计 -->
    <div v-if="analysisData" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card" :class="analysisData.stats.totalProfitRate >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总收益率</p>
            <p class="text-2xl font-bold" :class="analysisData.stats.totalProfitRate >= 0 ? 'text-up' : 'text-down'">
              {{ analysisData.stats.totalProfitRate.toFixed(2) }}%
            </p>
          </div>
          <div class="p-3 rounded-full shadow-lg" :class="analysisData.stats.totalProfitRate >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card stat-card-profit">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">最大收益</p>
            <p class="text-2xl font-bold text-up">¥{{ formatNumber(analysisData.stats.maxProfit) }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card stat-card-loss">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">最小收益</p>
            <p class="text-2xl font-bold text-down">¥{{ formatNumber(analysisData.stats.minProfit) }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card" :class="analysisData.stats.avgProfitRate >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">平均收益率</p>
            <p class="text-2xl font-bold" :class="analysisData.stats.avgProfitRate >= 0 ? 'text-up' : 'text-down'">
              {{ analysisData.stats.avgProfitRate.toFixed(2) }}%
            </p>
          </div>
          <div class="p-3 rounded-full shadow-lg" :class="analysisData.stats.avgProfitRate >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益趋势图 -->
    <div class="card-gradient">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">收益趋势</h3>
        <div class="text-sm text-gray-500">
          {{ selectedPeriod === '1d' ? '近1天' : selectedPeriod === '5d' ? '近5天' : selectedPeriod === '15d' ? '近15天' : '近30天' }}
        </div>
      </div>
      <Chart :options="trendChartOptions" height="320px" />
    </div>

    <!-- 分组统计 -->
    <div v-if="analysisData" class="card-gradient">
      <h3 class="text-lg font-medium text-gray-900 mb-4">分组统计</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(stats, group) in analysisData.groupStats" :key="group" class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">{{ group }}</h4>
            <span class="text-xs px-2 py-1 rounded-full" :class="stats.profit >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
              {{ stats.profit >= 0 ? '盈利' : '亏损' }}
            </span>
          </div>
          <div class="mt-3 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">持仓数</span>
              <span class="font-medium text-gray-900">{{ stats.count }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">市值</span>
              <span class="font-medium text-gray-900">¥{{ formatNumber(stats.value) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">盈亏</span>
              <span class="font-medium" :class="stats.profit >= 0 ? 'text-up' : 'text-down'">
                ¥{{ formatNumber(stats.profit) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益排名 -->
    <div class="card-gradient">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">收益排名</h3>
        <div class="text-sm text-gray-500">按盈亏金额排序</div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代码</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">盈亏金额</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收益率</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(holding, index) in sortedHoldings" :key="holding.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <span v-if="index === 0" class="text-2xl">🥇</span>
                  <span v-else-if="index === 1" class="text-2xl">🥈</span>
                  <span v-else-if="index === 2" class="text-2xl">🥉</span>
                  <span v-else class="text-gray-500 font-medium">#{{ index + 1 }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="holding.type === 'stock' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'">
                      {{ holding.type === 'stock' ? '股' : '基' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ holding.code }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ holding.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-medium" :class="holding.profit >= 0 ? 'text-up' : 'text-down'">
                    ¥{{ formatNumber(holding.profit) }}
                  </div>
                  <div class="text-xs px-2 py-1 rounded-full font-medium" :class="holding.profit >= 0 ? 'badge-up' : 'badge-down'">
                    {{ holding.profit >= 0 ? '+' : '' }}{{ (holding.profitRate || 0).toFixed(2) }}%
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium" :class="holding.profitRate >= 0 ? 'text-up' : 'text-down'">
                  {{ (holding.profitRate || 0).toFixed(2) }}%
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
import { analysisApi } from '@/api'
import { useHoldingStore } from '@/stores/holdings'
import Chart from '@/components/Chart.vue'
import * as echarts from 'echarts'

const holdingStore = useHoldingStore()

const selectedPeriod = ref('30d')
const analysisData = ref(null)

const sortedHoldings = computed(() => {
  return [...holdingStore.holdings].sort((a, b) => 
    Number(b.profit || 0) - Number(a.profit || 0)
  )
})

// 生成收益趋势图配置
const trendChartOptions = computed(() => {
  const days = selectedPeriod.value === '1d' ? 1 : 
                selectedPeriod.value === '5d' ? 5 :
                selectedPeriod.value === '15d' ? 15 : 30
  
  const data = []
  let baseValue = holdingStore.totalCost
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // 模拟收益波动
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1
    const value = baseValue * randomFactor
    
    data.push({
      date: date.toLocaleDateString('zh-CN'),
      value: value,
      profit: value - holdingStore.totalCost
    })
  }
  
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0]
        const profit = data.value - holdingStore.totalCost
        const profitRate = ((profit / holdingStore.totalCost) * 100).toFixed(2)
        return `${data.name}<br/>总资产: ¥${formatNumber(data.value)}<br/>盈亏: ¥${formatNumber(profit)} (${profitRate}%)`
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLabel: {
        interval: Math.floor(data.length / 7)
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
      data: data.map(d => d.value),
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
  }
})

onMounted(() => {
  holdingStore.fetchHoldings()
  fetchAnalysis()
})

const fetchAnalysis = async () => {
  try {
    const response = await analysisApi.getOverview({ period: selectedPeriod.value })
    analysisData.value = response
  } catch (error) {
    console.error('获取分析数据失败:', error)
  }
}

const generateReport = async () => {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30)
    
    const response = await analysisApi.generateReport({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    })
    
    console.log('报告生成成功:', response)
    alert('报告生成成功！')
  } catch (error) {
    console.error('生成报告失败:', error)
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}
</script>