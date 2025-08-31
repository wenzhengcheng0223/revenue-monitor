<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">收益监控</h1>
      <button
        @click="refreshData"
        :disabled="loading"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{{ loading ? '刷新中...' : '刷新数据' }}</span>
      </button>
    </div>

    <!-- 收益/涨跌切换按钮 -->
    <div class="flex space-x-4">
      <button
        @click="viewMode = 'profit'"
        :class="[
          'btn',
          viewMode === 'profit'
            ? 'btn-primary'
            : 'btn-secondary'
        ]"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        收益视图
      </button>
      <button
        @click="viewMode = 'change'"
        :class="[
          'btn',
          viewMode === 'change'
            ? 'btn-primary'
            : 'btn-secondary'
        ]"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        涨跌视图
      </button>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">持仓数量</p>
            <p class="text-2xl font-bold text-gray-900">{{ holdings.length }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总市值</p>
            <p class="text-2xl font-bold text-gray-900">¥{{ formatNumber(totalValue) }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card" :class="totalToday >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ viewMode === 'profit' ? '今日总收益' : '今日总涨跌' }}</p>
            <p class="text-2xl font-bold" :class="totalToday >= 0 ? 'text-up' : 'text-down'">
              {{ viewMode === 'profit' ? '¥' : '' }}{{ formatNumber(totalToday) }}
              <span v-if="viewMode === 'change'" class="text-sm">%</span>
            </p>
          </div>
          <div class="p-3 rounded-full shadow-lg" :class="totalToday >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card" :class="totalProfit >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ viewMode === 'profit' ? '累计收益' : '累计涨跌' }}</p>
            <p class="text-2xl font-bold" :class="totalProfit >= 0 ? 'text-up' : 'text-down'">
              {{ viewMode === 'profit' ? '¥' : '' }}{{ formatNumber(totalProfit) }}
              <span v-if="viewMode === 'change'" class="text-sm">%</span>
            </p>
          </div>
          <div class="p-3 rounded-full shadow-lg" :class="totalProfit >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card-gradient">
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索股票代码或名称"
            class="input pl-10"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select v-model="typeFilter" class="input">
          <option value="">全部类型</option>
          <option value="stock">股票</option>
          <option value="fund">基金</option>
        </select>
        <select v-model="sortBy" class="input">
          <option value="name">按名称排序</option>
          <option value="today">{{ viewMode === 'profit' ? '按今日收益' : '按今日涨跌' }}</option>
          <option value="total">{{ viewMode === 'profit' ? '按累计收益' : '按累计涨跌' }}</option>
          <option value="value">按市值排序</option>
        </select>
      </div>

      <!-- 股票基金列表 -->
      <div class="space-y-3">
        <div
          v-for="item in sortedHoldings"
          :key="item.id"
          @click="navigateToDetail(item)"
          class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                       :class="item.type === 'stock' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'">
                    {{ item.type === 'stock' ? '股' : '基' }}
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                  <span class="text-sm text-gray-500">{{ item.code }}</span>
                </div>
                <span class="badge" :class="item.type === 'stock' ? 'badge-stock' : 'badge-fund'">
                  {{ item.type === 'stock' ? '股票' : '基金' }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">现价</p>
                  <p class="text-base font-medium text-gray-900">¥{{ item.currentPrice || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">市值</p>
                  <p class="text-base font-medium text-gray-900">¥{{ formatNumber(item.marketValue) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">{{ viewMode === 'profit' ? '今日收益' : '今日涨跌' }}</p>
                  <div class="flex items-center space-x-2">
                    <p class="text-base font-medium" :class="item.today >= 0 ? 'text-up' : 'text-down'">
                      {{ viewMode === 'profit' ? '¥' : '' }}{{ formatNumber(item.today) }}
                      <span v-if="viewMode === 'change'" class="text-xs">%</span>
                    </p>
                    <div class="text-xs px-2 py-1 rounded-full font-medium" :class="item.today >= 0 ? 'badge-up' : 'badge-down'">
                      {{ item.today >= 0 ? '涨' : '跌' }}
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">{{ viewMode === 'profit' ? '累计收益' : '累计涨跌' }}</p>
                  <div class="flex items-center space-x-2">
                    <p class="text-base font-medium" :class="item.profit >= 0 ? 'text-up' : 'text-down'">
                      {{ viewMode === 'profit' ? '¥' : '' }}{{ formatNumber(item.profit) }}
                      <span v-if="viewMode === 'change'" class="text-xs">%</span>
                    </p>
                    <div class="text-xs px-2 py-1 rounded-full font-medium" :class="item.profit >= 0 ? 'badge-up' : 'badge-down'">
                      {{ item.profit >= 0 ? '盈' : '亏' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-right ml-4 flex items-start">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="sortedHoldings.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">暂无数据</h3>
        <p class="mt-1 text-sm text-gray-500">请先添加持仓或刷新数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHoldingStore } from '@/stores/holdings'

const router = useRouter()
const route = useRoute()
const holdingStore = useHoldingStore()

const viewMode = ref('profit') // 'profit' 或 'change'
const searchQuery = ref('')
const typeFilter = ref('')
const sortBy = ref('name')
const loading = ref(false)

// 计算属性
const holdings = computed(() => holdingStore.holdings)

const totalValue = computed(() => {
  return holdings.value.reduce((sum, h) => sum + Number(h.marketValue || 0), 0)
})

const totalToday = computed(() => {
  return holdings.value.reduce((sum, h) => {
    const todayValue = viewMode.value === 'profit' 
      ? (h.todayProfit || 0) 
      : (h.todayChange || 0)
    return sum + Number(todayValue)
  }, 0)
})

const totalProfit = computed(() => {
  return holdings.value.reduce((sum, h) => {
    const profitValue = viewMode.value === 'profit'
      ? (h.profit || 0)
      : (h.profitRate || 0)
    return sum + Number(profitValue)
  }, 0)
})

// 筛选和排序
const filteredHoldings = computed(() => {
  return holdings.value.filter(h => {
    const matchSearch = !searchQuery.value || 
      h.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = !typeFilter.value || h.type === typeFilter.value
    return matchSearch && matchType
  })
})

const sortedHoldings = computed(() => {
  const items = [...filteredHoldings.value].map(h => ({
    ...h,
    today: viewMode.value === 'profit' ? (h.todayProfit || 0) : (h.todayChange || 0),
    profit: viewMode.value === 'profit' ? (h.profit || 0) : (h.profitRate || 0)
  }))

  items.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name, 'zh-CN')
      case 'today':
        return Math.abs(b.today) - Math.abs(a.today)
      case 'total':
        return Math.abs(b.profit) - Math.abs(a.profit)
      case 'value':
        return (b.marketValue || 0) - (a.marketValue || 0)
      default:
        return 0
    }
  })

  return items
})

// 方法
const refreshData = async () => {
  loading.value = true
  try {
    await holdingStore.fetchHoldings()
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    loading.value = false
  }
}

const navigateToDetail = (item) => {
  router.push({
    name: 'revenue-detail',
    params: { id: item.id },
    query: { mode: viewMode.value }
  })
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

onMounted(() => {
  // 从 URL 参数获取视图模式
  const mode = route.query.mode
  if (mode === 'profit' || mode === 'change') {
    viewMode.value = mode
  }
  
  holdingStore.fetchHoldings()
})
</script>