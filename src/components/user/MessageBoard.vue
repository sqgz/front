<template>
  <div class="message-board">
    <!-- 标题 -->
    <h1 class="title">💬 留言板（{{ totalMessages }}）</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      正在加载留言...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      ⚠️ {{ error }}
      <button @click="fetchMessages" class="retry-btn">重新加载</button>
    </div>

    <!-- 留言列表 -->
    <div v-else class="message-list">
      <transition-group name="fade">
        <div
            v-for="message in messages"
            :key="message.id"
            class="message-card"
        >
          <div class="message-header">
            <span class="username">{{ message.username }}</span>
            <span class="timestamp">{{ message.created_at }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </transition-group>
    </div>

    <!-- 留言表单 -->
    <div class="message-form">
      <div class="form-group">
        <input
            v-model.trim="form.username"
            placeholder="输入昵称（最多20字）"
            maxlength="20"
            class="form-input"
            :disabled="isSubmitting"
        >
      </div>

      <div class="form-group">
        <textarea
            v-model.trim="form.content"
            placeholder="写下你的留言（最多200字）"
            maxlength="200"
            rows="3"
            class="form-textarea"
            :disabled="isSubmitting"
        ></textarea>
      </div>

      <div class="form-footer">
        <span class="char-count">{{ 200 - form.content.length }}字剩余</span>
        <button
            @click="submitMessage"
            class="submit-btn"
            :class="{ submitting: isSubmitting }"
            :disabled="!canSubmit || isSubmitting"
        >
          <span v-if="!isSubmitting">📮 发布留言</span>
          <span v-else>提交中...</span>
        </button>
      </div>

      <!-- 提交反馈 -->
      <transition name="fade">
        <div v-if="submitSuccess" class="success-message">
          ✅ 留言发布成功！
        </div>
      </transition>

      <transition name="fade">
        <div v-if="submitError" class="error-message">
          ⚠️ {{ submitError }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// API配置
const API_BASE = 'http://localhost:3000'
const messages = ref([])
const totalMessages = computed(() => messages.value.length)

// 表单状态
const form = ref({
  username: '',
  content: ''
})

// 界面状态
const loading = ref(true)
const error = ref(null)
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(null)

// 输入验证
const canSubmit = computed(() => {
  return form.value.username.length >= 2 &&
      form.value.content.length >= 5 &&
      !isSubmitting.value
})

// 获取留言
const fetchMessages = async () => {
  try {
    loading.value = true
    error.value = null
    const { data } = await axios.get(`${API_BASE}/messages`)
    messages.value = data
  } catch (err) {
    error.value = '无法加载留言，请检查网络连接'
    console.error('加载失败:', err)
  } finally {
    loading.value = false
  }
}

// 提交留言
const submitMessage = async () => {
  if (!canSubmit.value) return

  try {
    isSubmitting.value = true
    submitError.value = null

    const { data: newMessage } = await axios.post(`${API_BASE}/messages`, {
      username: form.value.username,
      content: form.value.content
    })

    messages.value.unshift(newMessage)
    submitSuccess.value = true
    resetForm()

    setTimeout(() => {
      submitSuccess.value = false
    }, 2000)

  } catch (err) {
    submitError.value = err.response?.data?.error || '提交失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.value = {
    username: '',
    content: ''
  }
}

// 初始化加载
onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.message-board {
  max-width: 2000px;
  margin: 2rem auto;
  padding: 0 1rem;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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

/* 其他样式保持不变 */
.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #ddd;
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: #ffe3e6;
  color: #dc3545;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.retry-btn {
  background: none;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.timestamp {
  font-size: 0.85rem;
  color: #666;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.submit-btn {
  background: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 6px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .message-board {
    padding: 0 0.5rem;
  }

  .message-card,
  .message-form {
    width: calc(100% - 1rem);
    padding: 1rem;
  }

  .form-input, .form-textarea {
    padding: 0.75rem 1rem;
  }

  .form-textarea {
    min-height: 100px;
  }
}
</style>