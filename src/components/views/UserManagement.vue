<template>
  <div class="user-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAddUser">
        <el-icon><Plus /></el-icon> 新增用户
      </el-button>

      <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名/邮箱"
          style="width: 300px"
          clearable
          @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 用户表格 -->
    <el-table :data="filteredUsers" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="registrationDate" label="注册时间" width="180" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEditUser(row)">编辑</el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDeleteUser(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 用户表单对话框 -->
    <el-dialog
        v-model="userDialogVisible"
        :title="isEditUser ? '编辑用户' : '新增用户'"
        width="500"
    >
      <el-form :model="currentUser" label-width="80px">
        <el-form-item label="用户名" required>
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input v-model="currentUser.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentUser.role">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" v-if="!isEditUser">
          <el-input v-model="currentUser.password" type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUserSubmit">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 模拟用户数据
const initialUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@library.com',
    role: 'admin',
    password: '123456',
    registrationDate: '2023-01-01'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@test.com',
    role: 'user',
    password: '123456',
    registrationDate: '2023-02-15'
  }
]
// 在setup脚本中添加这个方法
const handleSearch = () => {
  // 这里可以添加实际的搜索逻辑
  // 由于我们使用计算属性过滤，这里可以留空
  // 或者保持与计算属性的实时过滤一致
}
// 响应式数据
const users = ref([...initialUsers])
const searchKeyword = ref('')
const userDialogVisible = ref(false)
const isEditUser = ref(false)
const currentUser = reactive({
  id: null,
  username: '',
  email: '',
  role: 'user',
  password: ''
})

// 计算属性
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const keyword = searchKeyword.value.toLowerCase()
    return (
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    )
  })
})

// 操作方法
const handleAddUser = () => {
  isEditUser.value = false
  resetCurrentUser()
  userDialogVisible.value = true
}

const handleEditUser = (user) => {
  isEditUser.value = true
  Object.assign(currentUser, user)
  userDialogVisible.value = true
}

const handleDeleteUser = (id) => {
  ElMessageBox.confirm('确定要删除这个用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(user => user.id !== id)
    ElMessage.success('删除成功')
  })
}

const handleUserSubmit = () => {
  if (!validateUserForm()) return

  if (isEditUser.value) {
    // 更新用户
    const index = users.value.findIndex(u => u.id === currentUser.id)
    if (index > -1) {
      users.value.splice(index, 1, { ...currentUser })
    }
  } else {
    // 新增用户
    users.value.push({
      ...currentUser,
      id: Date.now(),
      registrationDate: new Date().toISOString().split('T')[0]
    })
  }

  userDialogVisible.value = false
  ElMessage.success(isEditUser.value ? '用户更新成功' : '用户创建成功')
}

// 表单验证
const validateUserForm = () => {
  if (!currentUser.username.trim()) {
    ElMessage.warning('请输入用户名')
    return false
  }
  if (!currentUser.email.trim()) {
    ElMessage.warning('请输入邮箱')
    return false
  }
  if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(currentUser.email)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return false
  }
  if (!isEditUser.value && !currentUser.password) {
    ElMessage.warning('请输入密码')
    return false
  }
  return true
}

const resetCurrentUser = () => {
  Object.assign(currentUser, {
    id: null,
    username: '',
    email: '',
    role: 'user',
    password: ''
  })
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>