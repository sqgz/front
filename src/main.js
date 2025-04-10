import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import axios from 'axios';

// 配置 Axios 的基础 URL
axios.defaults.baseURL = 'http://localhost:8443/api';

// 请求拦截器：在请求发送前设置 Authorization 字段
axios.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取 JWT
        const token = localStorage.getItem('jwt');
        if (token) {
            // 如果存在 JWT，设置请求头中的 Authorization 字段
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const app = createApp(App);

// 防抖函数
const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

// 修复 ResizeObserver 的防抖问题
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 200); // 设置防抖延迟时间，如 200ms
        super(callback);
    }
};

// 全局注册 axios
app.config.globalProperties.$axios = axios;

app.use(router);
app.use(ElementPlus);
app.mount('#app');