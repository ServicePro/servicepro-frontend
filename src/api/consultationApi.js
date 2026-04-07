import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/consultations`;
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const consultationApi = {
  // User
  getProviders:     (category) => axios.get(`${BASE}/providers${category ? `?category=${encodeURIComponent(category)}` : ''}`, headers()),
  getServices:      ()         => axios.get(`${BASE}/services`,  headers()),
  getMy:            ()         => axios.get(`${BASE}/my`,         headers()),
  schedule:         (data)     => axios.post(`${BASE}`,  data,   headers()),
  cancel:           (id)       => axios.patch(`${BASE}/${id}/cancel`,  {}, headers()),
  confirmReschedule:(id)       => axios.patch(`${BASE}/${id}/confirm`, {}, headers()),

  // Provider
  getProviderSessions: ()           => axios.get(`${BASE}/provider`,                headers()),
  accept:              (id)         => axios.patch(`${BASE}/${id}/accept`,     {},   headers()),
  proposeReschedule:   (id, time)   => axios.patch(`${BASE}/${id}/reschedule`, { proposedAt: time }, headers()),
};

export default consultationApi;
