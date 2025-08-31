<template>
  <div class="space-y-6">
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">持仓管理</h1>
      <button
        @click="showAddModal = true"
        class="btn btn-primary"
      >
        添加持仓
      </button>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">持仓数量</p>
            <p class="text-2xl font-bold text-gray-900">{{ holdingStore.holdings.length }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总市值</p>
            <p class="text-2xl font-bold text-gray-900">¥{{ formatNumber(holdingStore.totalValue) }}</p>
          </div>
          <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
      <div class="stat-card" :class="holdingStore.totalProfit >= 0 ? 'stat-card-profit' : 'stat-card-loss'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">今日盈亏</p>
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
    </div>

    <!-- 持仓列表 -->
    <div class="card-gradient">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h3 class="text-lg font-medium text-gray-900">持仓列表</h3>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索股票代码或名称"
              class="input pl-10 w-full sm:w-64"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            @click="showImportModal = true"
            class="btn btn-secondary flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>批量导入</span>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代码</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成本价</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">现价</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">市值</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">盈亏</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="holding in filteredHoldings" :key="holding.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ holding.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ holding.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge" :class="holding.type === 'stock' ? 'badge-stock' : 'badge-fund'">
                  {{ holding.type === 'stock' ? '股票' : '基金' }}
                </span>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ¥{{ formatNumber(holding.marketValue) }}
              </td>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editHolding(holding)" class="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>编辑</span>
                  </button>
                  <button @click="deleteHolding(holding)" class="text-red-600 hover:text-red-800 flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>删除</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 添加/编辑持仓弹窗 -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">{{ showEditModal ? '编辑持仓' : '添加持仓' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">股票代码</label>
              <div class="relative">
                <input 
                  v-model="form.code" 
                  type="text" 
                  required 
                  class="input pr-10"
                  placeholder="输入股票代码自动获取名称"
                />
                <div v-if="isFetchingStockInfo" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <p v-if="stockInfoError" class="mt-1 text-sm text-red-600">{{ stockInfoError }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">股票名称</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                class="input"
                :class="{ 'bg-gray-100': form.code && form.name }"
                placeholder="输入股票代码后自动填充"
              />
              <p v-if="form.code && form.name" class="mt-1 text-sm text-green-600">✓ 已自动获取股票名称</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <select v-model="form.type" class="input">
                <option value="stock">股票</option>
                <option value="fund">基金</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">数量</label>
              <input v-model.number="form.quantity" type="number" step="0.01" required class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">成本价</label>
              <input v-model.number="form.costPrice" type="number" step="0.01" required class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">分组</label>
              <input v-model="form.group" type="text" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea v-model="form.note" rows="3" class="input"></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              取消
            </button>
            <button type="submit" class="btn btn-primary">
              {{ showEditModal ? '更新' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHoldingStore } from '@/stores/holdings'
import { stockApi } from '@/api'

const holdingStore = useHoldingStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const searchQuery = ref('')
const form = ref({
  code: '',
  name: '',
  type: 'stock',
  quantity: 0,
  costPrice: 0,
  group: '',
  note: ''
})

// 自动获取股票名称
const isFetchingStockInfo = ref(false)
const stockInfoError = ref('')

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 监听股票代码变化（防抖）
watch(() => form.value.code, debounce(async (newCode) => {
  if (newCode && newCode.length >= 4) {
    await fetchStockInfo(newCode)
  } else {
    // 清空股票名称
    form.value.name = ''
    stockInfoError.value = ''
  }
}, 800))

// 获取股票信息
const fetchStockInfo = async (code) => {
  if (!code || code.length < 4) return
  
  isFetchingStockInfo.value = true
  stockInfoError.value = ''
  
  try {
    const response = await stockApi.getStockInfo(code)
    console.log('API响应:', response)
    
    if (response && response.success) {
      const stockData = response.data
      form.value.name = stockData.name || ''
      
      // 自动判断类型
      if (code.startsWith('5') || code.startsWith('1')) {
        form.value.type = 'fund'
      } else {
        form.value.type = 'stock'
      }
    } else {
      stockInfoError.value = '未找到该股票/基金信息'
      form.value.name = ''
    }
  } catch (error) {
    console.error('获取股票信息失败:', error)
    stockInfoError.value = '获取股票信息失败'
    form.value.name = ''
  } finally {
    isFetchingStockInfo.value = false
  }
}

const filteredHoldings = computed(() => {
  return holdingStore.holdings.filter(h => 
    h.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    h.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(() => {
  holdingStore.fetchHoldings()
})

const editHolding = (holding) => {
  form.value = { ...holding }
  showEditModal.value = true
}

const deleteHolding = async (holding) => {
  if (confirm('确定要删除这个持仓吗？')) {
    try {
      await holdingStore.deleteHolding(holding.id)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

const handleSubmit = async () => {
  try {
    if (showEditModal.value) {
      await holdingStore.updateHolding(form.value.id, form.value)
    } else {
      await holdingStore.addHolding(form.value)
    }
    closeModal()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    code: '',
    name: '',
    type: 'stock',
    quantity: 0,
    costPrice: 0,
    group: '',
    note: ''
  }
  stockInfoError.value = ''
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}
</script>