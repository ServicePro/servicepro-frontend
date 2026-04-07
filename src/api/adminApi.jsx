import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

// Helper to get auth header 
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

const adminApi = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`, getHeaders());
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, getHeaders());
    return response.data;
  },

  toggleUserStatus: async (id, type) => {
    const response = await axios.patch(`${API_BASE_URL}/users/${id}/status`, { type }, getHeaders());
    return response.data;
  },

  getAnalytics: async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics`, getHeaders());
    return response.data;
  },

  getPendingProviders: async () => {
    const response = await axios.get(`${API_BASE_URL}/providers/pending`, getHeaders());
    return response.data;
  },

  approveProvider: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/providers/approve/${id}`, {}, getHeaders());
    return response.data;
  },

  rejectProvider: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/providers/reject/${id}`, {}, getHeaders());
    return response.data;
  },
};

export default adminApi;