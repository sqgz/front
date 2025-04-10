<template>
  <div class="borrow-records">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
      />
      <el-select v-model="filterStatus" placeholder="选择状态" clearable>
        <el-option label="借阅中" value="borrowing" />
        <el-option label="已归还" value="returned" />
      </el-select>
    </div>

    <!-- 借阅记录表格 -->
    <el-table :data="filteredRecords" border stripe style="width: 100%">
      <el-table-column prop="bookName" label="图书名称" />
      <el-table-column prop="userName" label="借阅人" />
      <el-table-column prop="borrowDate" label="借阅日期" width="120" />
      <el-table-column prop="dueDate" label="应还日期" width="120" />
      <el-table-column prop="returnDate" label="归还日期" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'returned' ? 'success' : 'danger'">
            {{ row.status === 'returned' ? '已归还' : '借阅中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" v-if="filterStatus !== 'returned'">
        <template #default="{ row }">
          <el-button
              v-if="row.status === 'borrowing'"
              size="small"
              type="success"
              @click="handleReturn(row)"
          >
            归还
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟借阅数据
const initialRecords = [
  {
    id: 1,
    bookName: 'Vue.js设计与实现',
    userName: 'user1',
    borrowDate: '2023-03-01',
    dueDate: '2023-04-01',
    returnDate: null,
    status: 'borrowing'
  },
  {
    id: 2,
    bookName: 'JavaScript高级程序设计',
    userName: 'admin',
    borrowDate: '2023-02-15',
    dueDate: '2023-03-15',
    returnDate: '2023-03-10',
    status: 'returned'
  }
]

// 响应式数据
const records = ref([...initialRecords])
const dateRange = ref([])
const filterStatus = ref('')

// 计算属性
const filteredRecords = computed(() => {
  return records.value.filter(record => {
    const dateFilter = dateRange.value?.length === 2
        ? new Date(record.borrowDate) >= new Date(dateRange.value[0]) &&
        new Date(record.borrowDate) <= new Date(dateRange.value[1])
        : true

    const statusFilter = filterStatus.value
        ? record.status === filterStatus.value
        : true

    return dateFilter && statusFilter
  })
})

// 操作方法
const handleReturn = (record) => {
  const index = records.value.findIndex(r => r.id === record.id)
  if (index > -1) {
    records.value[index] = {
      ...record,
      returnDate: new Date().toISOString().split('T')[0],
      status: 'returned'
    }
    ElMessage.success('图书归还成功')
  }
}
</script>

<style scoped>
.borrow-records {
  padding: 20px;
}

.filter-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.el-date-picker {
  width: 350px;
}

.el-select {
  width: 150px;
}
</style>