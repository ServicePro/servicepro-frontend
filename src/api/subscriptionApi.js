import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscriptions`;
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const subscriptionApi = {
  getPlans:         () => axios.get(`${BASE}/plans`),
  getRewards:       () => axios.get(`${BASE}/rewards`),
  getMy:            () => axios.get(`${BASE}/my`, headers()),
  subscribe:        (plan) => axios.post(`${BASE}/subscribe`, { plan }, headers()),
  redeem:           (rewardId) => axios.post(`${BASE}/redeem`, { rewardId }, headers()),
  consumeReward:    () => axios.patch(`${BASE}/consume-reward`, {}, headers()),
  earnPoints:       (points, description) => axios.post(`${BASE}/earn`, { points, description }, headers()),
};

export default subscriptionApi;
