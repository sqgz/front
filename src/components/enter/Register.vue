<template>
  <div class="register-page">
    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- 注册卡片 -->
    <div class="register-card">
      <!-- 标题部分 -->
      <div class="card-header">
        <h1 class="title">加入书海</h1>
        <p class="subtitle">开启你的阅读之旅</p>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" class="form-container">
        <!-- 用户名输入 -->
        <div class="input-group">
          <div class="input-wrapper">
            <i class="icon">👤</i>
            <input
                type="text"
                v-model="formData.username"
                required
                class="form-input"
                placeholder=" "
                @focus="handleInputFocus"
                @blur="handleInputBlur"
            />
            <label class="input-label">用户名(不可重复)</label>
            <div class="input-underline"></div>
          </div>
        </div>

        <!-- 密码输入 -->
        <div class="input-group">
          <div class="input-wrapper">
            <i class="icon">🔒</i>
            <input
                type="password"
                v-model="formData.password"
                required
                class="form-input"
                placeholder=" "
                @focus="handleInputFocus"
                @blur="handleInputBlur"
            />
            <label class="input-label">密码</label>
            <div class="input-underline"></div>
          </div>
        </div>

        <!-- 确认密码 -->
        <div class="input-group">
          <div class="input-wrapper">
            <i class="icon">🔑</i>
            <input
                type="password"
                v-model="formData.confirmPassword"
                required
                class="form-input"
                placeholder=" "
                @focus="handleInputFocus"
                @blur="handleInputBlur"
                @keyup.enter="handleRegister"
            />
            <label class="input-label">确认密码</label>
            <div class="input-underline"></div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button class="submit-btn" :class="{ loading: isSubmitting }" @click="register">
          <span class="btn-text">{{ isSubmitting ? '注册中...' : '立即加入' }}</span>
          <div class="loader"></div>
        </button>
      </form>

      <!-- 底部链接 -->
      <div class="footer-links">
        <span>已有账号？</span>
        <router-link to="/login" class="login-link">立即登录</router-link>
      </div>
    </div>

    <!-- 错误提示弹窗 -->
    <div v-if="showErrorDialog" class="error-dialog-mask">
      <div class="error-dialog">
        <div class="dialog-header">
          <i class="error-icon">⚠️</i>
          <h3 class="dialog-title">注册失败</h3>
        </div>
        <p class="error-message">{{ errorMsg }}</p>
        <button class="dialog-confirm-btn" @click="showErrorDialog = false">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      showErrorDialog: false,
      errorMsg: '两次输入密码不一致',
      isSubmitting: false
    };
  },
  methods: {
    handleInputFocus(event) {
      event.target.parentElement.classList.add('focused');
    },
    handleInputBlur(event) {
      if (!event.target.value) {
        event.target.parentElement.classList.remove('focused');
      }
    },
    handleRegister() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.showErrorDialog = true;
        this.errorMsg = '两次输入密码不一致';
        return;
      }

      this.isSubmitting = true;

    },
    register() {
      this.$axios
          .post('/Register', {
            username: this.formData.username,
            password: this.formData.password,
            confirmPassword: this.formData.confirmPassword
          })
          .then((successResponse) => {
            if (successResponse.data.code === 200) {
              this.$router.replace({path: '/Login'});
            } else {
              this.showErrorDialog = true;
              this.errorMsg = '注册失败';
            }
          })
          .catch(() => {
            this.showErrorDialog = true;
            this.errorMsg = '注册失败';
          })
          .finally(() => {
            this.isSubmitting = false;
          });
    }
  }
};
</script>

<style scoped>
/* 原有样式保持不变，以下是新增的弹窗样式 */

.error-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-dialog {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 320px;
  text-align: center;
  animation: dialogSlide 0.3s ease-out;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 28px;
  margin-right: 12px;
}

.dialog-title {
  color: #e74c3c;
  margin: 0;
  font-size: 20px;
}

.error-message {
  color: #7f8c8d;
  margin: 20px 0;
  line-height: 1.6;
}

.dialog-confirm-btn {
  background: #6d7fcc;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.dialog-confirm-btn:hover {
  background: #4b5ba8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(109, 127, 204, 0.3);
}

@keyframes dialogSlide {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 原有其他样式保持不变 */
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.animated-background {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(109, 127, 204, 0.1);
  border-radius: 50%;
  animation: float 20s infinite;
}

.shape-1 {
  width: 150px;
  height: 150px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: 4s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 25%;
  animation-delay: 8s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.register-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 48px;
  width: 440px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  z-index: 1;
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 2.4rem;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #6d7fcc 0%, #4b5ba8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.05rem;
}

.input-group {
  margin-bottom: 32px;
  width: 100%;
}

.input-wrapper {
  position: relative;
  height: 56px;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #f8f9fa;
}

.icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #aab2bd;
}

.form-input {
  width: 100%;
  height: 100%;
  padding: 0 20px 0 56px;
  border: none;
  background: transparent;
  font-size: 16px;
  line-height: 56px;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.9);
}

.input-label {
  position: absolute;
  left: 56px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  transition: all 0.3s;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(248, 249, 250, 0) 0%, rgba(248, 249, 250, 0) 50%, rgba(248, 249, 250, 1) 50%);
  padding: 0 8px;
}

.input-wrapper.focused .input-label,
.form-input:not(:placeholder-shown) + .input-label {
  top: 0;
  left: 48px;
  font-size: 13px;
  color: #6d7fcc;
  transform: translateY(-50%);
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #6d7fcc;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.input-wrapper.focused .input-underline {
  transform: scaleX(1);
}

.submit-btn {
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #6d7fcc 0%, #4b5ba8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.submit-btn:hover:not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(109, 127, 204, 0.3);
}

.loader {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.submit-btn.loading .btn-text {
  visibility: hidden;
}

.submit-btn.loading .loader {
  display: block;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.footer-links {
  text-align: center;
  margin-top: 32px;
  color: #7f8c8d;
}

.login-link {
  color: #6d7fcc;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 480px) {
  .register-card {
    width: 90%;
    padding: 32px;
    border-radius: 16px;
  }

  .input-wrapper {
    height: 52px;
    border-radius: 10px;
  }

  .form-input {
    padding-left: 52px;
    line-height: 52px;
  }

  .icon {
    left: 14px;
  }

  .input-label {
    left: 52px;
  }

  .input-wrapper.focused .input-label,
  .form-input:not(:placeholder-shown) + .input-label {
    left: 44px;
  }

  .error-dialog {
    width: 80%;
    padding: 24px;
  }
}
</style>