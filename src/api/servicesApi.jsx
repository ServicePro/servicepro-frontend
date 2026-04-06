import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

const servicesApi = {
  create: async (formData) => {
    const response = await API.post('/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await API.get('/services', { params });
    return response.data;
  },

  getAllPublic: async (params = {}) => {
    const response = await API.get("/services/public", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/services/${id}`);
    return response.data;
  },

  getPublicById: async (id) => {
    const response = await API.get(`/services/public/${id}`);
    return response.data;
  },

  update: async (id, formData) => {
    const response = await API.put(`/services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/services/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await API.patch(`/services/${id}/toggle-status`);
    return response.data;
  },

  getProviderServices: async () => {
    const response = await API.get('/services/provider/my-services');
    return response.data;
  },
};

export default servicesApi;