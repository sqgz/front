<template>
  <div class="book-manager">
    <!-- 导航栏 -->
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

    <!-- 主要内容区域 -->
    <el-main>
      <!-- 图书推荐轮播 -->
      <el-carousel
          :interval="5000"
          height="360px"
          class="recommend-carousel"
          trigger="hover"
      >
        <el-carousel-item v-for="(group, index) in chunkedRecommendBooks" :key="index">
          <div class="carousel-group">
            <div
                v-for="book in group"
                :key="book.id"
                class="recommend-book"
                @click="showDetail(book)"
            >
              <div class="cover-wrapper">
                <img :src="book.cover" :alt="book.title" />
                <div class="overlay">
                  <h3>{{ book.title }}</h3>
                  <p class="author">{{ book.author }}</p>
                </div>
              </div>
              <el-rate
                  v-model="book.rating"
                  disabled
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              />
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 图书列表 -->
      <div class="book-list">
        <el-row :gutter="24">
          <el-col
              v-for="book in filteredBooks"
              :key="book.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              class="book-card"
          >
            <el-card
                shadow="hover"
                class="book-card-inner"
                :body-style="{ padding: '0px' }"
            >
              <div class="cover-container">
                <img :src="book.cover" class="book-cover" />
                <div class="category-tag">{{ book.category }}</div>
              </div>
              <div class="book-info">
                <h3 class="title">{{ book.title }}</h3>
                <p class="author">{{ book.author }}</p>
                <div class="meta">
                  <el-rate
                      v-model="book.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                  />
                  <div class="favorite" @click="toggleFavorite(book)">
                    <el-icon :size="20" :color="book.isFavorite ? '#ff4500' : '#ccc'">
                      <Star />
                    </el-icon>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 分页 -->
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalBooks"
          :page-size="pageSize"
          @current-change="handlePageChange"
      />
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Star } from '@element-plus/icons-vue'

// 模拟数据
const recommendBooks = ref([
  {
    id: 101,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    cover: require('@/assets/OIP-C.jpg'),
    rating: 4.8,
    category: '魔幻现实主义'
  },
  {
    id: 102,
    title: '三体全集',
    author: '刘慈欣',
    cover: require('@/assets/img.png'),
    rating: 4.9,
    category: '科幻小说'
  },
  {
    id: 103,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: require('@/assets/img_1.png'),
    rating: 4.7,
    category: '历史科普'
  },
  {
    id: 104,
    title: '活着',
    author: '余华',
    cover: require('@/assets/img_2.png'),
    rating: 4.9,
    category: '当代文学'
  },
  {
    id: 105,
    title: '小王子',
    author: '圣埃克苏佩里',
    cover: require('@/assets/img_3.png'),
    rating: 4.8,
    category: '童话'
  },
  {
    id: 106,
    title: '哈利波特与魔法石',
    author: 'J.K.罗琳',
    cover: require('@/assets/img_4.png'),
    rating: 4.7,
    category: '奇幻文学'
  }
])

const allBooks = ref([
  ...recommendBooks.value,
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 计算属性
const filteredBooks = computed(() => {
  return allBooks.value.filter(book =>
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.isbn?.includes(searchQuery.value)
  ).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const chunkedRecommendBooks = computed(() => {
  return chunk(recommendBooks.value, 3)
})

// 方法
const handleSearch = () => currentPage.value = 1
const handlePageChange = (page) => currentPage.value = page
const toggleFavorite = (book) => book.isFavorite = !book.isFavorite

const chunk = (arr, size) =>
    arr.reduce((acc, _, i) =>
        (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])

const showDetail = (book) => {
  // 实现详情弹窗逻辑
  console.log('查看详情:', book)
}
</script>

<style lang="scss" scoped>
.book-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

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


  .recommend-carousel {
    margin: 30px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .carousel-group {
      display: flex;
      justify-content: center;
      gap: 40px;
      padding: 20px;
      height: 360px;

      .recommend-book {
        width: 280px;
        cursor: pointer;
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-5px);
        }

        .cover-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

          img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            transition: transform 0.3s;
          }

          .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.8) 100%);
            color: white;

            h3 {
              margin: 0;
              font-size: 20px;
              line-height: 1.4;
            }

            .author {
              margin: 8px 0 0;
              font-size: 14px;
              opacity: 0.9;
            }
          }
        }

        :deep(.el-rate) {
          margin-top: 12px;
        }
      }
    }
  }

  .book-list {
    margin: 40px 0;

    .book-card {
      margin-bottom: 30px;
      padding: 0 12px;

      .book-card-inner {
        border-radius: 12px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        .cover-container {
          position: relative;

          .book-cover {
            width: 100%;
            height: 280px;
            object-fit: cover;
            border-radius: 12px 12px 0 0;
          }

          .category-tag {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(255, 255, 255, 0.9);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
        }

        .book-info {
          padding: 20px;

          .title {
            margin: 0 0 8px;
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            line-height: 1.4;
            height: 44px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .author {
            color: #666;
            font-size: 13px;
            margin-bottom: 12px;
          }

          .meta {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .favorite {
              cursor: pointer;
              transition: all 0.3s;

              &:hover {
                transform: scale(1.1);
              }
            }
          }
        }
      }
    }
  }

  .el-pagination {
    margin: 40px 0;
    justify-content: center;

    :deep(.btn-prev),
    :deep(.btn-next) {
      border-radius: 8px;
    }

    :deep(.number) {
      border-radius: 8px;
    }
  }
}
</style>