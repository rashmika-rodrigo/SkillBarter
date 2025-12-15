import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://skillbarter-backend-5i7n.onrender.com/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Required for Django CSRF
api.defaults.xsrfCookieName = "csrftoken";
api.defaults.xsrfHeaderName = "X-CSRFToken";

// Force attach CSRF header on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('csrftoken');
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});

export default api;
