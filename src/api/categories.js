// api/categories.js
import axios from 'axios'

export const getAll = async (params = {}) => {
    const response = await axios.get('/api/categories', { params })
    return response
}

export const getById = async (id) => {
    const response = await axios.get(`/api/categories/${id}`)
    return response
}

export const create = async (categoryData) => {
    const response = await axios.post('/api/categories', categoryData)
    return response
}

export const update = async (id, categoryData) => {
    const response = await axios.put(`/api/categories/${id}`, categoryData)
    return response
}

export const remove = async (id) => {
    const response = await axios.delete(`/api/categories/${id}`)
    return response
}

export const search = async (keyword) => {
    const response = await axios.get('/api/categories/search', {
        params: { q: keyword }
    })
    return response
}