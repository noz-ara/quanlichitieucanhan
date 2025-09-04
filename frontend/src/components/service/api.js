// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // chỉnh URL backend của em
  withCredentials: true, // nếu backend dùng session/cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

