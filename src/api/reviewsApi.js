import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const reviewsApi = {
  create: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/reviews`, data, getHeaders());
    return response.data;
  },
  getMyReviews: async () => {
    const response = await axios.get(`${API_BASE_URL}/reviews/my`, getHeaders());
    return response.data;
  },
  getProviderReviews: async (providerId) => {
    const response = await axios.get(`${API_BASE_URL}/reviews/provider/${providerId}`);
    return response.data;
  },
  getServiceReviews: async (serviceId) => {
    const response = await axios.get(`${API_BASE_URL}/reviews/service/${serviceId}`);
    return response.data;
  },
};

export default reviewsApi;
