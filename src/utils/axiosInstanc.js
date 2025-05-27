import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            // If the token exists, set it in the Authorization header
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // If the token is expired or invalid, redirect to login page
            window.location.href = '/login';
        } else if (error.response.status === 500) {
            console.error('Server error:', error.response.data);
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
