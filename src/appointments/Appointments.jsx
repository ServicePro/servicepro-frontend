import { useCallback, useEffect, useState } from 'react';
import bookingApi from '../api/bookingApi';
import "../styles/provider.css";

const TABS = ['ALL', 'PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const STATUS_META = {
  PENDING:   { label: 'Pending',      badgeClass: 'badge badge-warning',   icon: '⏳' },
  ACCEPTED:  { label: 'Confirmed',    badgeClass: 'badge badge-info',      icon: '✅' },
  ONGOING:   { label: 'In Progress',  badgeClass: 'badge badge-info',      icon: '🔧' },
  COMPLETED: { label: 'Completed',    badgeClass: 'badge badge-success',   icon: '🏁' },
  CANCELLED: { label: 'Cancelled',    badgeClass: 'badge badge-danger',    icon: '✕'  },
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const Appointments = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [updating,     setUpdating]     = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingApi.getProviderBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (bookingId, status, extra = {}) => {
    setUpdating(bookingId + status);
    try {
      const res = await bookingApi.providerAction(bookingId, { status, ...extra });
      const updated = res.data;
      setBookings((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = activeFilter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === activeFilter);

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'ALL' ? bookings.length : bookings.filter((b) => b.status === t).length;
    return acc;
  }, {});

  if (loading) return <div style={{ padding: '2rem' }}>Loading appointments…</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Appointments</h1>
          <p>Manage your upcoming and past bookings.</p>
        </div>
        <button className="btn btn-secondary_1 btn-sm" onClick={load} style={{ alignSelf: 'center' }}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{error}</div>
      )}

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total',       count: bookings.length,        color: '#2563eb', bg: '#eff6ff' },
          { label: 'Pending',     count: counts.PENDING,         color: '#f59e0b', bg: '#fffbeb' },
          { label: 'In Progress', count: counts.ACCEPTED + counts.ONGOING, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Completed',   count: counts.COMPLETED,       color: '#10b981', bg: '#ecfdf5' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="appt-filters">
        {TABS.map((f) => (
          <button
            key={f}
            className={`filter-tab${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {STATUS_META[f]?.label || 'All'}{' '}
            {counts[f] > 0 && <span style={{ opacity: 0.75 }}>({counts[f]})</span>}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No {activeFilter === 'ALL' ? '' : (STATUS_META[activeFilter]?.label.toLowerCase() + ' ')}appointments</h3>
            <p>When clients book your services, they'll appear here.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((b) => {
            const meta        = STATUS_META[b.status] || STATUS_META.PENDING;
            const effectiveDate = b.scheduledDate || b.date;
            const effectiveTime = b.scheduledTime || b.time;
            const dateObj     = new Date(effectiveDate);
            const day         = isNaN(dateObj) ? '?' : dateObj.getDate();
            const monthShort  = isNaN(dateObj) ? '' : dateObj.toLocaleString('default', { month: 'short' });
            const customer    = b.userId;
            const service     = b.serviceId;

            return (
              <div
                key={b._id}
                style={{
                  display: 'flex', background: 'var(--white)', padding: '20px',
                  borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                  gap: '20px', alignItems: 'flex-start',
                }}
              >
                {/* Date box */}
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', width: '60px', height: '60px',
                  background: 'var(--light)', borderRadius: '12px', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--primary)' }}>{day}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>{monthShort}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                    {service?.name || 'Service'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '8px' }}>
                    👤 <strong>{customer?.name || 'Customer'}</strong>
                    {customer?.phone && <>&nbsp;·&nbsp; 📞 {customer.phone}</>}
                    {customer?.email && <>&nbsp;·&nbsp; ✉️ {customer.email}</>}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-light)', flexWrap: 'wrap' }}>
                    <span>🕐 {effectiveTime || 'No time set'}</span>
                    {b.location && <span>📍 {b.location}</span>}
                    <span>💰 <strong style={{ color: 'var(--primary)' }}>Rs. {b.amount}</strong></span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px',
                      fontSize: '0.75rem', fontWeight: 600,
                      background: b.paymentState === 'PAID' ? '#dcfce7' : '#fef9c3',
                      color:      b.paymentState === 'PAID' ? '#15803d' : '#a16207',
                    }}>
                      {b.paymentState === 'PAID' ? '✅ Paid' : '⏳ Unpaid'}
                    </span>
                  </div>
                  {b.providerNote && (
                    <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      📝 Note: {b.providerNote}
                    </div>
                  )}
                </div>

                {/* Status + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                  <span className={meta.badgeClass}>
                    {meta.icon} {meta.label}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {b.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          disabled={updating === b._id + 'ACCEPTED'}
                          onClick={() => handleAction(b._id, 'ACCEPTED', {
                            scheduledDate: b.date,
                            scheduledTime: b.time,
                          })}
                        >
                          {updating === b._id + 'ACCEPTED' ? '…' : '✅ Accept'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={updating === b._id + 'CANCELLED'}
                          onClick={() => handleAction(b._id, 'CANCELLED')}
                        >
                          {updating === b._id + 'CANCELLED' ? '…' : '✕ Decline'}
                        </button>
                      </>
                    )}
                    {b.status === 'ACCEPTED' && (
                      <>
                        <button
                          className="btn btn-secondary_1 btn-sm"
                          style={{ background: '#ede9fe', color: '#6d28d9', border: 'none' }}
                          disabled={updating === b._id + 'ONGOING'}
                          onClick={() => handleAction(b._id, 'ONGOING')}
                        >
                          {updating === b._id + 'ONGOING' ? '…' : '🔧 Start Work'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={updating === b._id + 'CANCELLED'}
                          onClick={() => handleAction(b._id, 'CANCELLED')}
                        >✕ Cancel</button>
                      </>
                    )}
                    {b.status === 'ONGOING' && (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={updating === b._id + 'COMPLETED'}
                        onClick={() => handleAction(b._id, 'COMPLETED')}
                      >
                        {updating === b._id + 'COMPLETED' ? 'Saving…' : '🏁 Mark as Completed'}
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

