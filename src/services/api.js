import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);


export const apiService = {
    login: async (credentials) => {
        try {
            return await axiosInstance.post('/login', credentials);
        } catch (error) {
            throw error?.message || 'Login failed';
        }
    },

    logout: async () => {
        try {
            return await axiosInstance.post('/logout');
        } catch (error) {
            throw error?.message || 'Logout failed';
        }
    },

    // Add this method to create admin (remove in production)
    createAdmin: async () => {
        try {
            return await axiosInstance.post('/create-admin');
        } catch (error) {
            throw error?.message || 'Failed to create admin';
        }
    }
};