<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="decorative-background">
      <div class="floating-books">
        <div class="book">📘</div>
        <div class="book">📗</div>
      </div>
      <div class="bookshelf"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="auth-card">
      <h1 class="system-brand">
        <span class="library-icon">📚</span>
        HNUST图书管理系统
      </h1>

      <!-- 登录表单 -->
      <div class="form-wrapper">
        <!-- 用户名输入 -->
        <div class="input-group">
          <div class="input-container">
            <label class="input-label">用户名</label>
            <input
                type="text"
                v-model="loginForm.username"
                placeholder="请输入用户名"
                class="modern-input"
            >
          </div>
        </div>

        <!-- 密码输入 -->
        <div class="input-group">
          <div class="input-container">
            <label class="input-label">密码</label>
            <input
                type="password"
                v-model="loginForm.password"
                placeholder="请输入密码"
                class="modern-input"
                @keyup.enter="login"
            >
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button @click="login" class="primary-btn">
            <span class="btn-icon">🔑</span>
            立即登录
          </button>
          <button @click="register" class="secondary-btn">
            <span class="btn-icon">📝</span>
            注册新账号
          </button>
        </div>
      </div>
    </div>

    <!-- 错误提示弹窗 -->
    <transition name="slide-up">
      <div v-if="showErrorDialog" class="error-modal">
        <div class="modal-content">
          <div class="warning-icon">⚠️</div>
          <h3>登录失败</h3>
          <p>{{ errorMsg }}</p>
          <button @click="showErrorDialog = false" class="close-btn">
            确认
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      showErrorDialog: false,
      errorMsg: '用户名或密码错误，请重新输入'
    }
  },
  methods: {
    async login() {
      try {
        const response = await this.$axios.post('/login', this.loginForm)
        const jwt = response.data.data;
        localStorage.setItem('jwt', jwt); // 将JWT存储到本地
        if (response.data.code === 200 &&  jwt!=null ) {


          this.$router.push('/index')
        } else if (response.data.code === 300) {
          this.$router.push('/admin')
        }else{
          this.showErrorDialog = true
        }
      } catch (error) {
        this.showErrorDialog = true
        console.error('登录失败:', error)
      }
    },
    register() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
/* 基础布局 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
}

/* 装饰元素 */
.decorative-background {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bookshelf {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #d3c1ae;
  box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
}

.floating-books {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.book {
  font-size: 2.5rem;
  opacity: 0.9;
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.1));
}

@keyframes float {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -20px); }
}

/* 登录卡片 */
.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
  z-index: 1;
  position: relative;
}

.system-brand {
  text-align: center;
  color: #2b2d42;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.library-icon {
  font-size: 2rem;
}

/* 表单容器 */
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* 输入组精准布局 */
.input-group {
  display: flex;
  justify-content: center;
  width: 100%;
}

.input-container {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 500;
  padding-left: 0.25rem;
  text-align: left;
}

/* 输入框精准控制 */
.modern-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  box-sizing: border-box;
}

.modern-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  outline: none;
}

/* 按钮精准布局 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  max-width: 320px;
  padding: 0.875rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.primary-btn {
  background: #667eea;
  color: white;
}

.primary-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.secondary-btn {
  background: #48bb78;
  color: white;
}

.secondary-btn:hover {
  background: #38a169;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 错误弹窗 */
.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.warning-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.close-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.6rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #5a67d8;
}

/* 动画效果 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
    border-radius: 1rem;
  }

  .system-brand {
    font-size: 1.5rem;
  }

  .input-container {
    max-width: 100%;
  }

  .modern-input {
    padding: 0.75rem 1rem;
  }

  .primary-btn,
  .secondary-btn {
    padding: 0.9rem;
  }
}
</style>