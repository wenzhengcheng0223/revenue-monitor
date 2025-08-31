import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: 'holdings',
          name: 'holdings',
          component: () => import('@/views/Holdings.vue')
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: () => import('@/views/Analysis.vue')
        },
        {
          path: 'revenue',
          name: 'revenue',
          component: () => import('@/views/RevenueMonitor.vue')
        },
        {
          path: 'revenue/:id',
          name: 'revenue-detail',
          component: () => import('@/views/RevenueDetail.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { guest: true }
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()
    
    // 如果有 token 但没有用户信息，尝试获取用户信息
    if (authStore.token && !authStore.user) {
      try {
        await authStore.getProfile()
      } catch (error) {
        console.warn('获取用户信息失败，可能 token 已过期:', error)
        authStore.logout()
      }
    }
    
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      next('/login')
    } else if (to.meta.guest && authStore.isLoggedIn) {
      next('/')
    } else {
      next()
    }
  } catch (error) {
    console.error('路由守卫错误:', error)
    next()
  }
})

export default router