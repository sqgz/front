
import { createRouter, createWebHistory } from 'vue-router';

// ����һ��·�������������е�·��
const router = createRouter({
    history: createWebHistory(), // ʹ�� history ģʽ
    routes: [ // ����·�ɹ���
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

// ����·����
export default router;