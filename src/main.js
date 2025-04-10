import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import axios from 'axios';

// ���� Axios �Ļ��� URL
axios.defaults.baseURL = 'http://localhost:8443/api';

// ��������������������ǰ���� Authorization �ֶ�
axios.interceptors.request.use(
    (config) => {
        // �� localStorage ��ȡ JWT
        const token = localStorage.getItem('jwt');
        if (token) {
            // ������� JWT����������ͷ�е� Authorization �ֶ�
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const app = createApp(App);

// ��������
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

// �޸� ResizeObserver �ķ�������
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 200); // ���÷����ӳ�ʱ�䣬�� 200ms
        super(callback);
    }
};

// ȫ��ע�� axios
app.config.globalProperties.$axios = axios;

app.use(router);
app.use(ElementPlus);
app.mount('#app');