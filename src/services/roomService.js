import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/rooms`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const roomService = {
    getRooms: () => axiosInstance.get(''),
    getRoom: (id) => axiosInstance.get(`/${id}`),
    createRoom: (data) => axiosInstance.post('', data),
    updateRoom: (id, data) => axiosInstance.put(`/${id}`, data),
    deleteRoom: (id) => axiosInstance.delete(`/${id}`)
};