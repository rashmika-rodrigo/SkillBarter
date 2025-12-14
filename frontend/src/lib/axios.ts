import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
       localStorage.removeItem('user');
       if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
       }
    }
    return Promise.reject(error);
  }
);

export default api;