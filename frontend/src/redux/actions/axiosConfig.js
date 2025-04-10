import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;

        if (userInfo) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosConfig; 