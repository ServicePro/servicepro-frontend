import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardApi from '../api/dashboardApi';

// ── Badge helper ───────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    confirmed: 'badge badge-info',
    pending:   'badge badge-warning',
    completed: 'badge badge-success',
    cancelled: 'badge badge-danger',
  };
  return map[status] || 'badge badge-muted';
};

// ── Component ──────────────────────────────────────────────────
const ProviderDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await dashboardApi.getStats();
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch dashboard data.');
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Error connecting to server. Please ensure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger" style={{padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', margin: '1rem'}}>{error}</div>;
  if (!data) return null;

  // Construct stats array for UI from the API response
  const uiStats = [
    {
      label: 'Total Services',
      value: data.stats.totalServices,
      change: 'Active listings',
      positive: true,
      icon: '🛠️',
      iconClass: 'stat-icon-blue',
    },
    {
      label: "Today's Appointments",
      value: data.stats.todayAppointments,
      change: 'Scheduled today',
      positive: true,
      icon: '📅',
      iconClass: 'stat-icon-green',
    },
    {
      label: 'Monthly Revenue',
      value: `$${data.stats.monthlyRevenue}`,
      change: `${data.stats.revenueChange}% vs last month`,
      positive: data.stats.revenueChange >= 0,
      icon: '💰',
      iconClass: 'stat-icon-purple',
    },
    {
      label: 'Avg. Rating',
      value: data.stats.rating,
      change: `${data.stats.totalReviews} reviews`,
      positive: true,
      icon: '⭐',
      iconClass: 'stat-icon-orange',
    },
  ];

  const quickActions = [
    { to: '/provider/add-service', icon: '➕', iconBg: '#eff6ff', title: 'Add Service', desc: 'List a new service' },
    { to: '/provider/appointments', icon: '📅', iconBg: '#ecfdf5', title: 'View Appointments', desc: `${data.statusBreakdown?.pending || 0} pending` },
    { to: '/provider/manage-services', icon: '🛠️', iconBg: '#f5f3ff', title: 'Manage Services', desc: 'Edit your listings' },
    { to: '/provider/analytics', icon: '📊', iconBg: '#fff7ed', title: 'View Analytics', desc: 'Track performance' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Welcome back 👋</h1>
          <p>{today}</p>
        </div>
        <Link to="/provider/add-service" className="btn btn-primary">
          <span>➕</span> Add New Service
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {uiStats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.iconClass}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
                {s.positive ? '▲' : '▼'} {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to} className="quick-action-btn">
            <div className="quick-action-icon" style={{ background: a.iconBg }}>
              {a.icon}
            </div>
            <div className="quick-action-text">
              <strong>{a.title}</strong>
              <span>{a.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-grid">
        {/* LEFT — Recent Appointments */}
        <div className="card">
          <div className="section-header">
            <h2>Recent Appointments</h2>
            <Link to="/provider/appointments" className="btn btn-secondary btn-sm">
              View All →
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="appointment-row-avatar">
                        <div className="avatar avatar-sm">{appt.client_name.charAt(0)}</div>
                        <div className="appointment-row-info">
                          <strong>{appt.client_name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{appt.service_name}</td>
                    <td>
                      <div className="appointment-row-info">
                        <strong>{appt.appointment_date.substring(0, 10)}</strong>
                        <span>{appt.appointment_time}</span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--brand-blue)' }}>${appt.amount}</strong>
                    </td>
                    <td>
                      <span className={statusBadge(appt.status)}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentAppointments.length === 0 && (
                <div style={{padding: '1rem', textAlign: 'center'}}>No recent appointments.</div>
            )}
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Appointment Status Summary */}
          <div className="card">
            <div className="section-header">
              <h2>Booking Status</h2>
            </div>
            <div className="status-widget">
              {Object.entries(data.statusBreakdown).map(([status, count]) => (
                <div key={status} className="status-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={statusBadge(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="card">
            <div className="section-header">
              <h2>Top Services</h2>
              <Link to="/provider/manage-services" style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 600 }}>
                Manage →
              </Link>
            </div>
            {data.topServices.map((s, i) => (
              <div key={s.name} className="top-service-item">
                <div className="top-service-rank">#{i + 1}</div>
                <div className="top-service-info">
                  <strong>{s.name}</strong>
                  <span>{s.total_bookings} bookings</span>
                </div>
                <div className="top-service-revenue">${s.revenue}</div>
              </div>
            ))}
          </div>

          {/* Provider Rating Card */}
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-blue-dark)' }}>
              {parseFloat(data.stats.rating || 0).toFixed(1)} / 5.0
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Based on <strong>{data.stats.totalReviews} reviews</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
