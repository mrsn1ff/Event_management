import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // Get admin token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Attach it
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
