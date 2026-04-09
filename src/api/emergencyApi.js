import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/emergency`;
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const emergencyApi = {
  getServiceTypes:  ()           => axios.get(`${BASE}/services`),
  getProviders:     (type)       => axios.get(`${BASE}/providers${type ? '?type=' + type : ''}`),
  create:           (data)       => axios.post(`${BASE}`,               data, headers()),
  getMy:            ()           => axios.get(`${BASE}/my`,                   headers()),
  cancel:           (id)         => axios.patch(`${BASE}/${id}/cancel`, {},   headers()),
  pay:              (id, data)   => axios.patch(`${BASE}/${id}/pay`,    data, headers()),
  // Polling: user checks their own request status
  getById:          (id)         => axios.get(`${BASE}/${id}`,                headers()),
  // Provider: list requests directed at them
  getForProvider:   ()           => axios.get(`${BASE}/for-provider`,         headers()),
  // Provider: accept a request
  acceptRequest:    (id)         => axios.patch(`${BASE}/${id}/accept`,   {}, headers()),
  // Provider: mark completed
  completeRequest:  (id)         => axios.patch(`${BASE}/${id}/complete`,  {}, headers()),
  // User: rate a completed emergency
  rateRequest:      (id, data)   => axios.patch(`${BASE}/${id}/rate`, data, headers()),
};

export default emergencyApi;
