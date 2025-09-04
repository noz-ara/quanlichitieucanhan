// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // chỉnh URL backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn JWT token vào tất cả request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
