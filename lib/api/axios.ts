import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : "";

const api = axios.create({
  baseURL: API_URL || "/", // Use root if not specified to ensure consistent behavior
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT if available
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // Check if token exists and is not the string "undefined" or "null"
  if (token && token !== "undefined" && token !== "null" && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;