import axios from 'axios';

// 🔥 Backend URL (Render wala yaha daalna)
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend.onrender.com/api"  // 👉 yaha apna backend URL daal
    : "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const branchId = localStorage.getItem('selectedBranchId');
  if (branchId) {
    config.headers['x-branch-id'] = branchId;
  }

  return config;
});

export default api;