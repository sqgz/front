
import { createRouter, createWebHistory } from 'vue-router';

// 创建一个路由器，管理所有的路由
const router = createRouter({
    history: createWebHistory(), // 使用 history 模式
    routes: [ // 定义路由规则
        {
            path: '/login',
            name: 'login',
            component: () => import('@/components/enter/Login.vue')
        },
        {
            path: '/index',
            component: () => import('@/components/views/Index.vue')
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('@/components/enter/Register.vue')
        },
        {
            path: '/index/bookshelf',
            name: 'Bookshelf',
            component: () => import('@/components/user/Bookshelf.vue')
        },
        {
            path: '/index/search',
            name: 'Search',
            component: () => import('@/components/user/Search.vue')
        },
        {
            path: '/index/profile',
            name: 'Profile',
            component: () => import('@/components/user/Profile.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/components/views/admin.vue'),
            children: [
                { path: '/books',  component: () => import('@/components/views/BookManagement.vue') },
                { path: '/users',component: () => import('@/components/views/UserManagement.vue') },
                { path: '/records', component: () => import('@/components/views/BorrowRecords.vue') },
                { path: '/', redirect: '/books' }
            ]
        },

    ]
});

// 导出路由器
export default router;