// api/books.js
import axios from 'axios'

export const getAll = async (params = {}) => {
    const token = localStorage.getItem('jwt');

    const response = await axios.get('/books', {
        params, // 保留原有查询参数
        headers: {
            Authorization: `Bearer ${token}` // 添加认证头
        }
    });

    return response;
};

export const getById = async (id) => {
    const response = await axios.get(`/api/books/${id}`)
    return response
}

export const create = async (bookData) => {
    const response = await axios.post('/api/books', bookData)
    return response
}

export const update = async (id, status, uid) => {
    const response = await axios.put(`/books/${id}/${status}/${uid}`, status)
    return response
}

export const remove = async (id) => {
    const response = await axios.delete(`/books/${id}`)
    return response
}