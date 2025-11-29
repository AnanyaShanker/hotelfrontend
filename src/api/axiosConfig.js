// src/api/axiosConfig.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:9193"; // Spring Boot backend

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
