// src/services/api.js

import axios from "axios";
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL || "https://upi-cryptoconnect-backend.onrender.com";
  }
  return "http://localhost:6900";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401:
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          // Handle token refresh or logout here
          Cookies.remove("token");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        break;
      case 403:
        toast.error('Access denied. You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 422:
        toast.error('Validation error. Please check your input.');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (!error.response.data?.message) {
          toast.error('An unexpected error occurred.');
        }
    }

    return Promise.reject(error);
  }
);

export default api;
