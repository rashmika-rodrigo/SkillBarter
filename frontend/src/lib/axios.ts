import axios from 'axios';
import Cookies from 'js-cookie';

// Use Environment Variable if available, otherwise fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('csrftoken');
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;