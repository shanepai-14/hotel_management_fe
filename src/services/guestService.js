import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/guests`,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const guestService = {
    getGuests: () => axiosInstance.get(''),
    getGuest: (id) => axiosInstance.get(`/${id}`),
    createGuest: (data) => axiosInstance.post('', data),
    updateGuest: (id, data) => axiosInstance.put(`/${id}`, data),
    deleteGuest: (id) => axiosInstance.delete(`/${id}`)
};