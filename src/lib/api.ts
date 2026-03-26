import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000,
});

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