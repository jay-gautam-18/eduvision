import axios from 'axios';
// import 'dotenv/config';
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
