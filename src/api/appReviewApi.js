import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const appReviewApi = {
  create: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/app-reviews`, data, getHeaders());
    return res.data;
  },
  getMyReviews: async () => {
    const res = await axios.get(`${API_BASE_URL}/app-reviews/my`, getHeaders());
    return res.data;
  },
  getAll: async () => {
    const res = await axios.get(`${API_BASE_URL}/app-reviews`);
    return res.data;
  },
};

export default appReviewApi;
