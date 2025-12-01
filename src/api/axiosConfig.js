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
  console.log('🔍 Axios Request:', {
    method: config.method,
    url: config.url,
    skipAuth: config.skipAuth,
    hasToken: !!localStorage.getItem("token")
  });

  // Check if this request should skip authentication
  if (config.skipAuth) {
    console.log('✅ Skipping auth for this request');
    return config;
  }

  // Check if endpoint is public (for POST to /api/users - signup)
  const isPublicEndpoint = publicEndpoints.some(endpoint => {
    if (config.method === 'post' && config.url?.includes('/api/users')) {
      return true; // Signup endpoint
    }
    return config.url?.startsWith(endpoint);
  });

  if (isPublicEndpoint) {
    console.log('✅ Public endpoint - no auth required');
  } else {
    console.log('🔒 Protected endpoint - adding auth');
  }

  // Only add token if not a public endpoint
  if (!isPublicEndpoint) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    } else {
      console.log('⚠️ No token found in localStorage');
    }
  }

  return config;
});

// Add response interceptor to log errors
axios.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default axios;
