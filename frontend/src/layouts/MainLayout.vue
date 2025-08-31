<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex-shrink-0">
      <div class="navbar-content">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-white">收益监控系统</h1>
          </div>
          <nav class="flex space-x-1">
            <router-link 
              to="/" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.name === 'dashboard' }"
            >
              监控面板
            </router-link>
            <router-link 
              to="/holdings" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.name === 'holdings' }"
            >
              持仓管理
            </router-link>
            <router-link 
              to="/analysis" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.name === 'analysis' }"
            >
              分析报告
            </router-link>
            <router-link 
              to="/revenue" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.name === 'revenue' }"
            >
              收益监控
            </router-link>
          </nav>
          <div class="flex items-center">
            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                  {{ userInitial }}
                </div>
                <span class="text-sm font-medium text-white">{{ authStore.user?.username || '用户' }}</span>
                <svg 
                  class="w-4 h-4 transition-transform" 
                  :class="{ 'rotate-180': showUserMenu }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ authStore.user?.username || '用户' }}</p>
                  <p class="text-xs text-gray-500">{{ authStore.user?.email || '' }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="navbar-content flex-grow py-8">
      <ErrorBoundary>
        <router-view v-slot="{ Component }">
          <transition name="page-transition" mode="out-in">
            <div class="page-content" :key="$route.path">
              <Component :is="Component" />
            </div>
          </transition>
        </router-view>
      </ErrorBoundary>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const userMenuRef = ref(null)

// 计算用户名首字母
const userInitial = computed(() => {
  const username = authStore.user?.username || 'U'
  return username.charAt(0).toUpperCase()
})

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 处理退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
  }
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>