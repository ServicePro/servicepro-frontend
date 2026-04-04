import React, { useState, useEffect } from 'react';
import appointmentsApi from '../api/appointmentsApi';

const statusFilters = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const badgeMap = {
  pending:   'badge badge-warning',
  confirmed: 'badge badge-info',
  completed: 'badge badge-success',
  cancelled: 'badge badge-danger',
};

const Appointments = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentsApi.getAll();
      if (res.success) {
        setAppointments(res.data.appointments);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = appointments.filter(
    (a) => activeFilter === 'All' || (a.status || '').toLowerCase() === activeFilter.toLowerCase()
  );

  const updateStatus = async (id, newStatus) => {
    try {
      await appointmentsApi.updateStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const counts = statusFilters.reduce((acc, f) => {
    acc[f] =
      f === 'All'
        ? appointments.length
        : appointments.filter((a) => (a.status || '').toLowerCase() === f.toLowerCase()).length;
    return acc;
  }, {});

  if (loading) return <div style={{padding:'2rem'}}>Loading Appointments...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Appointments</h1>
          <p>Manage your upcoming and past bookings.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="form-select" style={{ width: 'auto' }}>
            <option>All Services</option>
            {Array.from(new Set(appointments.map(a => a.service_name))).filter(Boolean).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{marginBottom:'20px'}}>{error}</div>}

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total', count: appointments.length, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Pending', count: counts.Pending, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Confirmed', count: counts.Confirmed, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Completed', count: counts.Completed, color: '#10b981', bg: '#ecfdf5' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="appt-filters">
        {statusFilters.map((f) => (
          <button
            key={f}
            className={`filter-tab${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f} {counts[f] > 0 && <span style={{ opacity: 0.75 }}>({counts[f]})</span>}
          </button>
        ))}
      </div>

      {/* Appointments list */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No {activeFilter.toLowerCase()} appointments</h3>
            <p>When clients book your services, they'll appear here.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((a) => {
            const dateObj = new Date(a.appointment_date);
            const day = dateObj.getDate();
            const monthObj = dateObj.toLocaleString('default', { month: 'short' });

            return (
              <div key={a.id} className="appt-card" style={{ display: 'flex', background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', gap: '20px', alignItems: 'center' }}>
                {/* Date box */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'var(--bg-main)', borderRadius: '12px', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--brand-blue)' }}>{day || '?'}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{monthObj || ''}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{a.service_name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    👤 <strong>{a.client_name}</strong> &nbsp;·&nbsp; 📞 {a.client_phone || 'No phone provided'}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div>🕐 {a.appointment_time || 'No time set'}</div>
                    {a.client_address && <div>📍 {a.client_address}</div>}
                    <div>
                      💰 <strong style={{ color: 'var(--brand-blue)' }}>${a.amount}</strong>
                    </div>
                  </div>
                </div>

                {/* Status + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <span className={badgeMap[a.status] || 'badge badge-muted'}>
                    {(a.status || 'unknown').charAt(0).toUpperCase() + (a.status || 'unknown').slice(1)}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {a.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateStatus(a.id, 'confirmed')}
                        >
                          ✅ Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(a.id, 'cancelled')}
                        >
                          ✕ Decline
                        </button>
                      </>
                    )}

                    {a.status === 'confirmed' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateStatus(a.id, 'completed')}
                      >
                        ✔ Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments;
