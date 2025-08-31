<template>
  <div class="space-y-6">
    <!-- 返回按钮 -->
    <button
      @click="goBack"
      class="flex items-center text-blue-600 hover:text-blue-800"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      返回列表
    </button>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- 详情内容 -->
    <div v-else-if="holding" class="space-y-6">
      <!-- 基本信息 -->
      <div class="card">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ holding.name }}</h1>
            <p class="text-gray-600">{{ holding.code }}</p>
          </div>
          <span
            class="px-3 py-1 text-sm rounded-full"
            :class="holding.type === 'stock' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
          >
            {{ holding.type === 'stock' ? '股票' : '基金' }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-500">成本价</p>
            <p class="text-xl font-semibold">¥{{ holding.costPrice }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">现价</p>
            <p class="text-xl font-semibold">¥{{ holding.currentPrice || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">数量</p>
            <p class="text-xl font-semibold">{{ holding.quantity }}</p>
          </div>
        </div>
      </div>

      <!-- 收益/涨跌切换 -->
      <div class="flex space-x-4">
        <button
          @click="viewMode = 'profit'"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            viewMode === 'profit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          收益分析
        </button>
        <button
          @click="viewMode = 'change'"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            viewMode === 'change'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          涨跌分析
        </button>
      </div>

      <!-- 收益统计 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card">
          <p class="text-sm text-gray-500">市值</p>
          <p class="text-2xl font-bold">¥{{ formatNumber(holding.marketValue) }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-500">{{ viewMode === 'profit' ? '今日收益' : '今日涨跌' }}</p>
          <p class="text-2xl font-bold" :class="todayValue >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ viewMode === 'profit' ? '¥' : '' }}{{ formatNumber(todayValue) }}
            <span v-if="viewMode === 'change'" class="text-sm">%</span>
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-500">{{ viewMode === 'profit' ? '累计收益' : '累计涨跌' }}</p>
          <p class="text-2xl font-bold" :class="totalValue >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ viewMode === 'profit' ? '¥' : '' }}{{ formatNumber(totalValue) }}
            <span v-if="viewMode === 'change'" class="text-sm">%</span>
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-500">收益率排名</p>
          <p class="text-2xl font-bold">{{ ranking }}/{{ totalHoldings }}</p>
        </div>
      </div>

      <!-- 价格走势图 -->
      <div class="card">
        <h3 class="text-lg font-medium mb-4">价格走势</h3>
        <div class="h-80">
          <Chart
            :options="priceChartOption"
            style="width: 100%; height: 100%"
          />
        </div>
      </div>

      <!-- 收益分布图 -->
      <div class="card">
        <h3 class="text-lg font-medium mb-4">{{ viewMode === 'profit' ? '收益分布' : '涨跌分布' }}</h3>
        <div class="h-80">
          <Chart
            :options="distributionChartOption"
            style="width: 100%; height: 100%"
          />
        </div>
      </div>

      <!-- 历史记录 -->
      <div class="card">
        <h3 class="text-lg font-medium mb-4">历史记录</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开盘价</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最高价</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最低价</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收盘价</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">涨跌幅</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in historyRecords" :key="record.date">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{{ record.open }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{{ record.high }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{{ record.low }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{{ record.close }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="record.change >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ record.change >= 0 ? '+' : '' }}{{ record.change }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 其他信息 -->
      <div v-if="holding.group || holding.note" class="card">
        <h3 class="text-lg font-medium mb-4">其他信息</h3>
        <div class="space-y-3">
          <div v-if="holding.group">
            <p class="text-sm text-gray-500">分组</p>
            <p class="text-gray-900">{{ holding.group }}</p>
          </div>
          <div v-if="holding.note">
            <p class="text-sm text-gray-500">备注</p>
            <p class="text-gray-900 whitespace-pre-wrap">{{ holding.note }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">加载失败</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <button @click="loadHoldingData" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        重试
      </button>
    </div>
    
    <!-- 未找到持仓状态 -->
    <div v-else-if="!loading && holdingStore.holdings.length > 0 && !holding" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">未找到持仓信息</h3>
      <button @click="router.push({ name: 'revenue' })" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        返回列表
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHoldingStore } from '@/stores/holdings'
import Chart from '@/components/Chart.vue'

const route = useRoute()
const router = useRouter()
const holdingStore = useHoldingStore()

const viewMode = ref(route.query.mode || 'profit')
const loading = ref(false)
const error = ref(null)

// 调试信息
onMounted(() => {
  console.log('RevenueDetail mounted:', {
    params: route.params,
    query: route.query,
    holdingsLength: holdingStore.holdings.length
  })
})

// 计算属性
const holding = computed(() => {
  if (!route.params.id) return null
  const id = parseInt(route.params.id)
  if (isNaN(id)) return null
  return holdingStore.holdings.find(h => h.id === id)
})

const todayValue = computed(() => {
  if (!holding.value) return 0
  return viewMode.value === 'profit' 
    ? (holding.value.todayProfit || 0) 
    : (holding.value.todayChange || 0)
})

const totalValue = computed(() => {
  if (!holding.value) return 0
  return viewMode.value === 'profit'
    ? (holding.value.profit || 0)
    : (holding.value.profitRate || 0)
})

const ranking = computed(() => {
  if (!holding.value) return 0
  const sorted = [...holdingStore.holdings].sort((a, b) => {
    const aVal = viewMode.value === 'profit' ? (a.profit || 0) : (a.profitRate || 0)
    const bVal = viewMode.value === 'profit' ? (b.profit || 0) : (b.profitRate || 0)
    return bVal - aVal
  })
  return sorted.findIndex(h => h.id === holding.value.id) + 1
})

const totalHoldings = computed(() => holdingStore.holdings.length)

// 图表配置
const priceChartOption = computed(() => ({
  title: {
    text: '价格走势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: ¥{c}'
  },
  xAxis: {
    type: 'category',
    data: priceHistory.value.map(item => item.date)
  },
  yAxis: {
    type: 'value',
    name: '价格'
  },
  series: [{
    data: priceHistory.value.map(item => item.price),
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#3B82F6'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(59, 130, 246, 0.3)'
        }, {
          offset: 1,
          color: 'rgba(59, 130, 246, 0.05)'
        }]
      }
    }
  }]
}))

const distributionChartOption = computed(() => ({
  title: {
    text: viewMode.value === 'profit' ? '收益分布' : '涨跌分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { 
        value: Math.abs(positiveValue.value), 
        name: viewMode.value === 'profit' ? '盈利' : '上涨',
        itemStyle: { color: '#10B981' }
      },
      { 
        value: Math.abs(negativeValue.value), 
        name: viewMode.value === 'profit' ? '亏损' : '下跌',
        itemStyle: { color: '#EF4444' }
      }
    ],
    label: {
      formatter: '{b}: {c}'
    }
  }]
}))

// 模拟数据
const priceHistory = ref([
  { date: '2024-01-01', price: 10.50 },
  { date: '2024-01-02', price: 10.80 },
  { date: '2024-01-03', price: 11.20 },
  { date: '2024-01-04', price: 10.90 },
  { date: '2024-01-05', price: 11.50 }
])

const positiveValue = computed(() => Math.max(0, totalValue.value))
const negativeValue = computed(() => Math.min(0, totalValue.value))

const historyRecords = ref([
  { date: '2024-01-05', open: 11.00, high: 11.60, low: 10.80, close: 11.50, change: 5.50 },
  { date: '2024-01-04', open: 10.50, high: 11.00, low: 10.40, close: 10.90, change: -2.68 },
  { date: '2024-01-03', open: 10.80, high: 11.30, low: 10.70, close: 11.20, change: 3.70 },
  { date: '2024-01-02', open: 10.20, high: 10.90, low: 10.10, close: 10.80, change: 2.86 },
  { date: '2024-01-01', open: 10.00, high: 10.60, low: 9.90, close: 10.50, change: 5.00 }
])

// 方法
const goBack = () => {
  router.push({ name: 'revenue', query: { mode: viewMode.value } })
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// 安全的数据加载函数
const loadHoldingData = async () => {
  // 如果没有ID或ID无效，直接跳转
  if (!route.params.id || isNaN(parseInt(route.params.id))) {
    router.push({ name: 'revenue' })
    return
  }
  
  // 只有在没有数据时才加载
  if (holdingStore.holdings.length === 0) {
    loading.value = true
    try {
      await holdingStore.fetchHoldings()
    } catch (error) {
      console.error('获取持仓数据失败:', error)
      // 加载失败也继续，可能本地有缓存
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  // 使用 nextTick 确保 DOM 更新后再执行
  nextTick(() => {
    loadHoldingData()
  })
})

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    nextTick(() => {
      loadHoldingData()
    })
  }
}, { immediate: false })
</script>