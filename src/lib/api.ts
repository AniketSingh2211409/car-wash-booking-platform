import axios from "axios";

// 🔥 FIX: Vite me process.env nahi hota
const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://car-wash-booking-platform.onrender.com/api"
    : "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const branchId = localStorage.getItem("selectedBranchId");
  if (branchId) {
    config.headers["x-branch-id"] = branchId;
  }

  return config;
});

export default api;