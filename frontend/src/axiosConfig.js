import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080', // URL đầy đủ của backend
});

export default instance;