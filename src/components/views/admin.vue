<template>
  <div class="admin-container">
    <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
        class="admin-nav"
    >
      <el-menu-item index="/books">📚 图书管理</el-menu-item>
      <el-menu-item index="/users">👥 用户管理</el-menu-item>
      <el-menu-item index="/records">📖 借阅记录</el-menu-item>
    </el-menu>

    <div class="content-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-nav {
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.content-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>