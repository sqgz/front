<template>
  <div class="book-management">
    <h1>图书管理系统</h1>

    <!-- 新增图书表单 -->
    <div class="book-form">
      <h2>添加新书</h2>
      <form @submit.prevent="handleSubmit">
        <input v-model="newBook.title" placeholder="书名" required>
        <input v-model="newBook.author" placeholder="作者" required>
        <input v-model="newBook.isbn" placeholder="ISBN" required>
        <button type="submit">添加图书</button>
      </form>
    </div>

    <!-- 图书列表 -->
    <div v-if="loading" class="loading">加载中...</div>

    <template v-else>
      <div class="book-list">
        <div class="search-box">
          <input
              ref="searchInput"
              v-model="searchQuery"
              placeholder="搜索书名或作者"
              @input="handleSearch"

          >
        </div>

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
            <td :class="{ 'borrowed': book.borrowed }">
              {{ book.borrowed ? '已借出' : '可借阅' }}
            </td>
            <td>

              <button
                  class="edit-btn"
                  @click="openEditModal(book)"
              >
                编辑
              </button>
              <button
                  class="delete-btn"
                  @click="deleteBook(book)"
              >
                删除
              </button>
            </td>
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

      <!-- 编辑模态框 -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h2>编辑图书信息</h2>
          <form @submit.prevent="handleUpdate">
            <label>书名:</label>
            <input v-model="selectedBook.title" required>

            <label>作者:</label>
            <input v-model="selectedBook.author" required>

            <label>ISBN:</label>
            <input v-model="selectedBook.isbn" required>

            <div class="modal-actions">
              <button type="submit">保存更改</button>
              <button type="button" @click="closeEditModal">取消</button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {ref, computed,watch,onMounted} from 'vue'
import {
  getAll,
  create,
  update,
  remove
} from '@/api/books'

// 响应式状态
const books = ref([])
const loading = ref(true)
const searchQuery = ref('')
const sortKey = ref('id')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = 10
const totalItems = ref(0)
const newBook = ref({
  title: '',
  author: '',
  isbn: ''
})
const showEditModal = ref(false)
const selectedBook = ref(null)
// 监视器
watch([currentPage, searchQuery], () => {
  fetchBooks()
})
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return books.value.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
  )
})

// 方法
const fetchBooks = async () => {
  try {
    loading.value = true
    const response = await getAll({
      page: currentPage.value-1,
      size: pageSize,
      search: searchQuery.value
    })
    books.value = response.data.content
    totalItems.value = response.data.pageable.totalPages
  } catch (error) {
    console.error('获取图书失败:', error)
    alert('获取图书数据失败，请稍后重试')
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


const handleSubmit = async () => {
  try {
    await create(newBook.value)
    await fetchBooks()
    newBook.value = {title: '', author: '', isbn: ''}
    alert('图书添加成功')
  } catch (error) {
    console.error('添加失败:', error)
    alert('添加图书失败，请检查输入')
  }
}


const deleteBook = async (book) => {
  if (confirm('确定要删除这本图书吗？')) {
    try {
      await remove(book.id)
      await fetchBooks()
      alert('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }
}

const openEditModal = (book) => {
  selectedBook.value = {...book}
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedBook.value = null
}

const handleUpdate = async () => {
  try {
    await update(selectedBook.value.id, selectedBook.value)
    await fetchBooks()
    closeEditModal()
    alert('更新成功')
  } catch (error) {
    console.error('更新失败:', error)
    alert('更新失败')
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
  fetchBooks()


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
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  cursor: pointer;
  user-select: none;
}

tr:hover {
  background-color: #f9f9f9;
}

.borrowed {
  color: #ff4444;
  font-weight: bold;
}

button {
  padding: 6px 12px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-btn {
  background-color: #4CAF50;
  color: white;
}

.toggle-btn.borrowed {
  background-color: #ff4444;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
}

.pagination button.active {
  background-color: #007bff;
  color: white;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.search-box {
  margin: 20px 0;
}

.search-box input {
  width: 300px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.book-form {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.book-form input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>