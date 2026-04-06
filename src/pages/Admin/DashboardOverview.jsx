import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProviders: 0,
    pendingProviders: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Users</span>
            <span className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>👥</span>
          </div>
          <div className="stat-value">{loading ? '...' : stats.totalUsers}</div>
          <div className="stat-trend neutral">Registered users</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Providers</span>
            <span className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#10b981' }}>🛠️</span>
          </div>
          <div className="stat-value">{loading ? '...' : stats.activeProviders}</div>
          <div className="stat-trend positive">Serving platform</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Pending Approvals</span>
            <span className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>⚠️</span>
          </div>
          <div className="stat-value">{loading ? '...' : stats.pendingProviders}</div>
          <div className="stat-trend neutral">Needs review</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Platform Revenue</span>
            <span className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#a855f7' }}>💰</span>
          </div>
          <div className="stat-value">LKR {loading ? '...' : (stats.totalRevenue || 0).toLocaleString()}</div>
          <div className="stat-trend positive">From completed bookings</div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: '32px' }}>
        <div className="chart-card" style={{ gridColumn: 'span 2', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', color: '#111827' }}>Platform Activity Overview</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#6b7280' }}>
            [Interactive Chart Placeholder: Check Reports & Analytics]
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
