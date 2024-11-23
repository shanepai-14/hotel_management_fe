import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/bookings`,
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


export const bookingService = {
    getBookings: () => axiosInstance.get(''),
    getBooking: (id) => axiosInstance.get(`/${id}`),
    createBooking: (data) => axiosInstance.post('', data),
    updateBooking: (id, data) => axiosInstance.put(`/${id}`, data),
    deleteBooking: (id) => axiosInstance.delete(`/${id}`)
};