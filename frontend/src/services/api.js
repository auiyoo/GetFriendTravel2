import axios from 'axios';

// In production (Railway), frontend & backend run on same origin
// In development, Vite proxy handles /api → localhost:5000
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gft-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
