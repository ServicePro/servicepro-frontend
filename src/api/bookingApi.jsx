import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const bookingApi = {
  create: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/bookings`, data, getHeaders());
    return response.data;
  },
  getMyBookings: async () => {
    const response = await axios.get(`${API_BASE_URL}/bookings`, getHeaders());
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}`, getHeaders());
    return response.data;
  },
  updatePayment: async (id, paymentData) => {
    const response = await axios.put(`${API_BASE_URL}/bookings/${id}/payment`, paymentData, getHeaders());
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await axios.put(`${API_BASE_URL}/bookings/${id}/status`, { status }, getHeaders());
    return response.data;
  }
};

export default bookingApi;