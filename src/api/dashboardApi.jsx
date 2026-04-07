import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const dashboardApi = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  getAnalytics: async (months = 6) => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    
    try {
      // Use the user's existing api/analytics endpoints instead of dashboard/analytics!
      const [revRes, apptRes, popRes, ratRes, kpiRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/analytics/revenue?months=${months}`, { headers }),
        axios.get(`${API_BASE_URL}/analytics/appointments?months=${months}`, { headers }),
        axios.get(`${API_BASE_URL}/analytics/service-popularity`, { headers }),
        axios.get(`${API_BASE_URL}/analytics/rating?months=${months}`, { headers }),
        axios.get(`${API_BASE_URL}/analytics/kpi?months=${months}`, { headers })
      ]);

      // Merge the time-series arrays into a single monthlyData array
      const monthMap = {};
      
      const revenues = revRes.data.data.revenue || [];
      revenues.forEach(r => {
        monthMap[r.month_key] = { 
          month_key: r.month_key,
          month: r.month, 
          revenue: parseFloat(r.revenue), 
          target: parseFloat(r.revenue) > 0 ? parseFloat(r.revenue) * 1.1 : 1000 
        };
      });

      const appts = apptRes.data.data.appointments || [];
      appts.forEach(a => {
        if (!monthMap[a.month_key]) monthMap[a.month_key] = { month_key: a.month_key, month: a.month };
        monthMap[a.month_key].completed = parseInt(a.completed || 0);
        monthMap[a.month_key].pending = parseInt(a.pending || 0);
        monthMap[a.month_key].cancelled = parseInt(a.cancelled || 0);
      });

      const ratings = ratRes.data.data.ratingTrend || [];
      ratings.forEach(r => {
        if (!monthMap[r.month_key]) monthMap[r.month_key] = { month_key: r.month_key, month: r.month };
        monthMap[r.month_key].rating = parseFloat(r.avg_rating || 0);
      });

      // Sort chronologically by month_key (e.g., '2023-10', '2023-11')
      const monthlyData = Object.values(monthMap).sort((a, b) => a.month_key.localeCompare(b.month_key));

      // Map service popularity colors
      const colors = ['#2563eb', '#06b6d4', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
      const popData = popRes.data.data.servicePopularity || [];
      const servicePopularity = popData.slice(0, 6).map((s, i) => ({
        name: s.name,
        value: parseInt(s.bookings || 0),
        color: colors[i % colors.length]
      }));

      // Extract KPI summary
      const kpiData = kpiRes.data.data.kpi;
      
      return {
        success: true,
        data: {
          kpi: {
            totalRevenue: kpiData.totalRevenue || 0,
            totalAppointments: kpiData.totalAppointments || 0,
            avgRating: kpiData.avgRating || '4.5',
            cancellationRate: kpiData.cancellationRate || 0,
          },
          monthlyData,
          servicePopularity
        }
      };
    } catch (err) {
      console.error("Dashboard analytics aggregation failed:", err);
      throw err;
    }
  },
};

export default dashboardApi;
