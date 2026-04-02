import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import dashboardApi from '../api/dashboardApi';

// Custom tooltip for revenue chart
const RevenueTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'white', border: '1px solid #e2e8f0',
        borderRadius: '10px', padding: '12px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontWeight: 700, marginBottom: '6px' }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontSize: '0.85rem' }}>
            {p.name === 'revenue' ? '💰 Revenue' : '🎯 Target'}: <strong>${p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const mapPeriodToMonths = (period) => {
  if (period === '1m') return 1;
  if (period === '3m') return 3;
  if (period === '6m') return 6;
  if (period === '1y') return 12;
  return 6;
};

const ProviderAnalytics = () => {
  const [period, setPeriod] = useState('6m');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const months = mapPeriodToMonths(period);
        const result = await dashboardApi.getAnalytics(months);
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch analytics.');
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading && !data) return <div style={{ padding: '2rem' }}>Loading analytics...</div>;
  if (error) return <div className="alert alert-danger" style={{ margin: '2rem', padding: '1rem', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c' }}>{error}</div>;
  if (!data) return null;

  // Reconstruct KPI Cards from real data summary
  const kpiCards = [
    { label: 'Total Revenue', value: `$${data.kpi.totalRevenue}`, change: 'Overall', positive: true, icon: '💰', color: '#2563eb', bg: '#eff6ff' },
    { label: 'Total Appointments', value: data.kpi.totalAppointments, change: 'All time', positive: true, icon: '📅', color: '#10b981', bg: '#ecfdf5' },
    { label: 'Avg. Rating', value: `${data.kpi.avgRating} ⭐`, change: 'Current', positive: true, icon: '⭐', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Cancellation Rate', value: `${data.kpi.cancellationRate}%`, change: 'Overall', positive: false, icon: '📉', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Analytics</h1>
          <p>Track your performance, revenue, and client satisfaction.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['1m', '3m', '6m', '1y'].map((p) => (
            <button
              key={p}
              className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Updating charts...</div>}

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="stat-card"
            style={{ borderLeft: `4px solid ${k.color}` }}
          >
            <div className="stat-icon" style={{ background: k.bg }}>
              {k.icon}
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: k.color }}>{k.value}</div>
              <div className="stat-label">{k.label}</div>
              <div className={`stat-change ${k.positive ? 'positive' : 'negative'}`} style={{ color: 'var(--text-muted)' }}>
                {k.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + Appointments Charts */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Revenue Line Chart */}
        <div className="card">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Revenue Overview</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly revenue vs target</p>
            </div>
          </div>
          {data.monthlyData.length === 0 ? (
            <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No revenue data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<RevenueTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Line
                  type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3}
                  dot={{ r: 5, fill: '#2563eb' }} name="revenue"
                />
                <Line
                  type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2}
                  strokeDasharray="5 5" dot={false} name="target"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Service Popularity Pie */}
        <div className="card">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Service Popularity</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bookings by service type</p>
            </div>
          </div>
          {data.servicePopularity.length === 0 ? (
            <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No booking data to display</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', height: '260px', alignItems: 'center' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={data.servicePopularity}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.servicePopularity.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} bookings`]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '40%' }}>
                {data.servicePopularity.map((s) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: s.color, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '0.78rem', flex: 1, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.name}>{s.name}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointments Bar + Rating Line */}
      <div className="grid-2" style={{ gap: '20px' }}>
        {/* Appointments Bar Chart */}
        <div className="card">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Appointments Breakdown</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status counts per month</p>
            </div>
          </div>
          {data.monthlyData.length === 0 ? (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No appointment data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.monthlyData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#3b82f6" name="Pending" />
                <Bar dataKey="cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Rating Trend */}
        <div className="card">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Rating Trend</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average rating over time</p>
            </div>
          </div>
          {data.monthlyData.length === 0 ? (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No rating data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip formatter={(v) => [`${v} ⭐`]} />
                <Line
                  type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3}
                  dot={{ r: 5, fill: '#f59e0b' }} name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;
