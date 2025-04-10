<template>
  <div class="personal-center">
    <!-- 固定在顶部的导航栏 -->
    <el-header class="header fixed-header">
      <div class="logo">📚 书海云阁</div>
      <el-menu
          mode="horizontal"
          router
          background-color="rgba(255, 255, 255, 0.95)"
          text-color="#2c3e50"
          active-text-color="#409EFF"
          class="nav-menu"
      >
        <el-menu-item index="/index">今日推荐</el-menu-item>
        <el-menu-item index="/index/bookshelf">书库</el-menu-item>
        <el-menu-item index="/index/search">留言板</el-menu-item>
        <el-menu-item index="/index/profile">个人中心</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 内容区域，留出导航栏的高度 -->
    <div class="content-wrapper">
      <div v-if="loading" class="loading-wrapper">
        <span class="loader"></span>
        <p class="loading-text">正在加载用户信息...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-wrapper">
        <span class="error-icon">⚠️</span>
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- 正常显示 -->
      <section v-else class="user-profile">
        <h2 class="profile-title">用户信息</h2>
        <div class="profile-details">
          <div class="detail-item">
            <label>用户ID：</label>
            <span>{{ userInfo.id }}</span>
          </div>
          <div class="detail-item">
            <label>用户名：</label>
            <span>{{ userInfo.username }}</span>
          </div>
          <!-- 其他信息字段可在此扩展 -->
        </div>

        <!-- 借阅记录 -->
        <h2 class="profile-title">借阅记录</h2>
        <div class="borrowed-books">
          <div v-if="borrowedBooks.length === 0" class="no-borrowed-books">
            <p>您目前没有借阅任何书籍。</p>
          </div>
          <div v-else class="book-list">
            <div v-for="book in borrowedBooks" :key="book.id" class="book-item">
              <span>{{ book.title }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'

const router = useRouter()
const userInfo = ref({})
const borrowedBooks = ref([])
const loading = ref(true)
const error = ref(null)

/**
 * JWT 解析工具函数
 * @param {string} token - JWT令牌
 * @returns {object|null} 解析后的Payload对象
 */
const parseJwt = (token) => {
  try {
    const payloadBase64 = token.split('.')[1]
    const base64 = payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const decoded = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    )

    return JSON.parse(decoded)
  } catch (err) {
    console.error('[JWT解析错误]', err)
    return null
  }
}

/**
 * 获取用户信息
 */
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('jwt')

    // 验证令牌存在性
    if (!token?.trim()) {
      throw new Error('用户登录状态已失效，请重新登录')
    }

    // 解析令牌
    const decoded = parseJwt(token)
    const id = decoded?.claims?.id

    // 验证用户ID
    if (!id) {
      throw new Error('无效的用户凭证，请重新登录')
    }

    // 发起请求
    const response = await axios.get(`/User/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    })

    userInfo.value = response.data.data
  } catch (err) {
    handleError(err)
  }
}

/**
 * 获取用户借阅的书籍
 */
const fetchBorrowedBooks = async () => {
  try {
    const token = localStorage.getItem('jwt')

    if (!token?.trim()) {
      throw new Error('用户登录状态已失效，请重新登录')
    }

    const decoded = parseJwt(token)
    const id = decoded?.claims?.id

    if (!id) {
      throw new Error('无效的用户凭证，请重新登录')
    }

    const response = await axios.get(`/BorrowedBooks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    borrowedBooks.value = response.data.content
  } catch (err) {
    handleError(err)
  }
}

/**
 * 统一错误处理
 * @param {Error} err - 错误对象
 */
const handleError = (err) => {
  error.value = err.response?.data?.message || err.message
  if (err.message.includes('无效') || err.message.includes('失效')) {
    setTimeout(() => router.push('/login'), 1500)  // 1.5秒后跳转
  }
}

// 生命周期钩子
onMounted(async () => {
  await fetchUserInfo()
  await fetchBorrowedBooks()
  loading.value = false
})
</script>

<style scoped>
.personal-center {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 固定在顶部的导航栏 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 0 40px;
  height: 60px;
  display: flex;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 2px;
}

.nav-menu {
  border-bottom: none;
  flex-grow: 1;
  justify-content: flex-start;
}

:deep(.el-menu-item) {
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  border-radius: 8px;

  &.is-active {
    background-color: rgba(64, 158, 255, 0.1);
    color: #409EFF;
  }

  &:hover {
    background-color: rgba(64, 158, 255, 0.05);
  }
}

/* 内容区域，留出导航栏的高度 */
.content-wrapper {
  margin-top: 80px; /* 为导航栏留出空间 */
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 加载状态样式 */
.loading-wrapper {
  text-align: center;
  padding: 2rem;
}

.loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: #6b7280;
}

/* 错误状态样式 */
.error-wrapper {
  padding: 1.5rem;
  background: #fef2f2;
  border-radius: 8px;
  text-align: center;
}

.error-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #ef4444;
  font-weight: 500;
}

/* 用户资料样式 */
.user-profile {
  padding: 1rem;
}

.profile-title {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.profile-details {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
}

/* 借阅记录样式 */
.borrowed-books {
  margin-top: 2rem;
}

.no-borrowed-books {
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  color: #6b7280;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.book-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>