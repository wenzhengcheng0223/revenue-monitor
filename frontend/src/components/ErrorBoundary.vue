<template>
  <slot v-if="!error" />
  <div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-center text-gray-900 mb-2">页面出错了</h3>
      <p class="text-sm text-gray-500 text-center mb-4">{{ error }}</p>
      <div class="flex justify-center space-x-3">
        <button
          @click="reset"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          重试
        </button>
        <button
          @click="goHome"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
        >
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref(null)

onErrorCaptured((err) => {
  error.value = err.message
  console.error('错误边界捕获到错误:', err)
  return false // 阻止错误继续向上传播
})

const reset = () => {
  error.value = null
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>