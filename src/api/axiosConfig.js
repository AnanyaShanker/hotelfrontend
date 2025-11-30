// src/api/axiosConfig.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:9193"; // Spring Boot backend

// List of public endpoints that don't require authentication
const publicEndpoints = [
  '/api/auth/login',
  '/api/users', // POST for signup
  '/api/auth/forgot-password',
  '/facilities/all',
  '/facilities/',
];

axios.interceptors.request.use((config) => {
  // Check if this request should skip authentication
  if (config.skipAuth) {
    return config;
  }

  // Check if endpoint is public (for POST to /api/users - signup)
  const isPublicEndpoint = publicEndpoints.some(endpoint => {
    if (config.method === 'post' && config.url?.includes('/api/users')) {
      return true; // Signup endpoint
    }
    return config.url?.startsWith(endpoint);
  });

  // Only add token if not a public endpoint
  if (!isPublicEndpoint) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axios;
