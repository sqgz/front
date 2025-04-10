<template>
  <div class="book-management">
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
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 图书列表 -->
    <template v-else>
      <div class="book-list">
        <!-- 搜索框 -->
        <div class="search-box">
          <input
              v-model="searchQuery"
              placeholder="搜索书名或作者"
              @input="handleSearch"
          >
        </div>

        <!-- 图书表格 -->
        <table>
          <thead>
          <tr>
            <th @click="sortBy('id')">ID {{ sortIcon('id') }}</th>
            <th @click="sortBy('title')">书名 {{ sortIcon('title') }}</th>
            <th @click="sortBy('author')">作者 {{ sortIcon('author') }}</th>
            <th>ISBN</th>
            <th @click="sortBy('status')">状态码 {{ sortIcon('status') }}</th>
            <th @click="sortBy('borrowed')">状态 {{ sortIcon('borrowed') }}</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="book in sortedBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.isbn }}</td>
            <td>{{ book.status }}</td>
            <td :class="{ 'borrowed': !book.status }">
              {{ book.status ? '可借阅' : '已借出' }}
            </td>
            <td>
              <button
                  class="toggle-btn"
                  :class="{ 'borrowed': !book.status }"
                  @click="toggleBorrowStatus(book)"
              >
                {{ book.status ? '借阅' : '归还' }}
              </button>
            </td>
          </tr>
          <tr v-if="books.length === 0">
            <td colspan="7" class="empty-state">暂无数据</td>
          </tr>
          </tbody>
        </table>

        <!-- 分页控件 -->
        <div class="pagination" v-if="totalPages > 1">
          <button
              @click="prevPage"
              :disabled="currentPage === 1"
          >
            上一页
          </button>

          <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>

          <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
          >
            下一页
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getAll, update } from '@/api/books'
import {Search} from "@element-plus/icons-vue";
import axios from "axios";

// 响应式状态
const books = ref([])
const loading = ref(true)
const searchQuery = ref('')
const sortKey = ref('id')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = 10
const totalItems = ref(0)


// 监视器
watch([currentPage, searchQuery], () => {
  fetchBooks()
})
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
// 方法
const fetchBooks = async () => {
  try {
    loading.value = true
    const response = await getAll({
      page: currentPage.value - 1,
      size: pageSize,
      search: searchQuery.value,
    })
    books.value = response.data.content
    totalItems.value = response.data.pageable.totalPages

  } catch (error) {
    console.error('获取图书失败:', error)
    alert('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
// 计算属性
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

const visiblePages = computed(() => {
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const sortedBooks = computed(() => {
  return [...books.value].sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1
    return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
  })
})



const toggleBorrowStatus = async (book) => {
  try {
    const token = localStorage.getItem('jwt')

    // 验证令牌存在性
    if (!token?.trim()) {
      throw new Error('用户登录状态已失效，请重新登录')
    }

    // 解析令牌
    const decoded = parseJwt(token)
    const userId = decoded?.claims?.id

    // 验证用户ID
    if (!userId) {
      throw new Error('无效的用户凭证，请重新登录')
    }

    await update(book.id, book.status, userId)
    await fetchBooks()
  } catch (error) {
    console.error('操作失败:', error)
    alert('您未借该书')
  }
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const sortIcon = (key) => {
  if (sortKey.value !== key) return ''
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

const handleSearch = () => {
  currentPage.value = 1
}

const prevPage = () => {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

const nextPage = () => {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

// 初始化加载
fetchBooks()
</script>

<style scoped>
.book-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
}

tr:hover {
  background-color: #f8f9fa;
}

.borrowed {
  color: #dc3545;
  font-weight: 500;
}

.toggle-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn {
  background-color: #28a745;
  color: white;
}

.toggle-btn.borrowed {
  background-color: #dc3545;
}

.toggle-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background-color: #e9ecef;
}

.pagination button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #6c757d;
  font-size: 1.1em;
}

.search-box {
  margin: 20px 0;
}

.search-box input {
  width: 100%;
  max-width: 400px;
  padding: 10px 15px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #6c757d;
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

/* 内容区域的顶部留出导航栏的高度 */
.content-container {
  margin-top: 80px; /* 为导航栏留出空间 */
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* 留言列表和卡片样式 */
.message-list {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.message-card {
  width: calc(100% - 2rem);
  max-width: 800px;
  margin: 0 auto 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

/* 表单样式 */
.message-form {
  width: calc(100% - 2rem);
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.form-group {
  width: 100%;
  margin-bottom: 1rem;
}

/* 输入框样式 */
.form-input, .form-textarea {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
}

</style>