import axios from 'axios';

// Vite environment variable with clean default fallback for Spring Boot API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token when integrated with Spring Boot Security
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rescuebite_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is not running or returns 404/ECONNREFUSED, services gracefully fall back to local reactive storage
    return Promise.reject(error);
  }
);
