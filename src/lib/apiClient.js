import axios from 'axios';
import { API_BASE, STORAGE_KEYS } from './constants';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: normalize errors
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Token expired/invalid - clear and redirect to auth
      const wasAuthed = !!localStorage.getItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (wasAuthed && typeof window !== 'undefined') {
        // Redirect to auth page using hash router
        window.location.hash = '#/auth';
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;

