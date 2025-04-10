import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const axiosConfig = axios.create({
    baseURL: BASE_URL,
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
export { BASE_URL }; 