import { useEffect, useState } from 'react';
import emergencyApi from '../../api/emergencyApi';
import './ProviderEmergencyRequests.css';

const STATUS_CONFIG = {
  pending:   { label: 'Awaiting Acceptance', color: '#f59e0b', bg: '#fef3c7', icon: '🔍' },
  assigned:  { label: 'Accepted',            color: '#2563eb', bg: '#dbeafe', icon: '👷' },
  en_route:  { label: 'En Route',            color: '#7c3aed', bg: '#ede9fe', icon: '🚗' },
  completed: { label: 'Completed',           color: '#10b981', bg: '#d1fae5', icon: '✅' },
  cancelled: { label: 'Cancelled',           color: '#6b7280', bg: '#f1f5f9', icon: '❌' },
};

const formatType = (t) =>
  t?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Service';

export default function ProviderEmergencyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await emergencyApi.getForProvider();
      setRequests(res.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      const res = await emergencyApi.acceptRequest(id);
      const updated = res.data?.data;
      setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
      showToast('Request accepted! The customer has been notified.');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to accept request', 'error');
    } finally {
      setAccepting(null);
    }
  };

  const pending  = requests.filter((r) => r.status === 'pending');
  const active   = requests.filter((r) => ['assigned', 'en_route'].includes(r.status));
  const history  = requests.filter((r) => ['completed', 'cancelled'].includes(r.status));

  return (
    <div className="per-root">
      {toast && <div className={`per-toast per-toast-${toast.type}`}>{toast.msg}</div>}

      <div className="per-header">
        <div>
          <h2>🚨 Emergency Requests</h2>
          <p>Review and accept incoming emergency service requests from customers</p>
        </div>
        <button className="per-refresh-btn" onClick={loadRequests}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="per-loading"><div className="per-spinner" />Loading requests…</div>
      ) : requests.length === 0 ? (
        <div className="per-empty">
          <span style={{ fontSize: '3rem' }}>✅</span>
          <p>No emergency requests at the moment</p>
          <p className="per-empty-sub">New requests will appear here when customers request emergency service</p>
        </div>
      ) : (
        <>
          {/* ── Pending (need acceptance) ── */}
          {pending.length > 0 && (
            <section>
              <h3 className="per-section-title">
                <span className="per-count-badge per-count-pending">{pending.length}</span>
                Awaiting Your Acceptance
              </h3>
              <div className="per-cards">
                {pending.map((r) => (
                  <div key={r._id} className="per-card per-card-pending">
                    <div className="per-card-top">
                      <div>
                        <p className="per-svc-type">🔧 {formatType(r.serviceType)}</p>
                        <p className="per-date">{new Date(r.createdAt).toLocaleString()}</p>
                      </div>
                      <span
                        className="per-urg-badge"
                        style={{
                          background: r.urgency === 'critical' ? '#fee2e2' : '#fef3c7',
                          color:      r.urgency === 'critical' ? '#991b1b' : '#92400e',
                        }}
                      >
                        {r.urgency === 'critical' ? '🚨 Critical' : '🔥 High Priority'}
                      </span>
                    </div>

                    <p className="per-desc">{r.description}</p>

                    <div className="per-meta">
                      <span>📍 {r.location}</span>
                      <span>💸 ${r.finalPrice}</span>
                      <span>⏱ ETA ~{r.urgency === 'critical' ? '15–30' : '25–45'} min</span>
                    </div>

                    <button
                      className="per-accept-btn"
                      onClick={() => handleAccept(r._id)}
                      disabled={accepting === r._id}
                    >
                      {accepting === r._id ? 'Accepting…' : '✅ Accept Emergency Request'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Active (already accepted) ── */}
          {active.length > 0 && (
            <section>
              <h3 className="per-section-title">
                <span className="per-count-badge per-count-active">{active.length}</span>
                Active — Accepted
              </h3>
              <div className="per-cards">
                {active.map((r) => {
                  const st = STATUS_CONFIG[r.status];
                  return (
                    <div key={r._id} className="per-card">
                      <div className="per-card-top">
                        <div>
                          <p className="per-svc-type">🔧 {formatType(r.serviceType)}</p>
                          <p className="per-date">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>
                        <span
                          className="per-status-badge"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="per-desc">{r.description}</p>
                      <div className="per-meta">
                        <span>📍 {r.location}</span>
                        <span>💸 ${r.finalPrice}</span>
                        <span>⏱ ETA: {r.eta}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── History ── */}
          {history.length > 0 && (
            <section>
              <h3 className="per-section-title">History</h3>
              <div className="per-cards">
                {history.map((r) => {
                  const st = STATUS_CONFIG[r.status];
                  return (
                    <div key={r._id} className="per-card per-card-history">
                      <div className="per-card-top">
                        <div>
                          <p className="per-svc-type">🔧 {formatType(r.serviceType)}</p>
                          <p className="per-date">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>
                        <span
                          className="per-status-badge"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="per-desc">{r.description}</p>
                      <div className="per-meta">
                        <span>📍 {r.location}</span>
                        <span>💸 ${r.finalPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
