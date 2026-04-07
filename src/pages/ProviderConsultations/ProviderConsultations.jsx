import { useEffect, useState } from 'react';
import consultationApi from '../../api/consultationApi';
import './ProviderConsultations.css';

const PROVIDER_STATUS_CONFIG = {
  pending:     { label: 'Awaiting Response', color: '#d97706', bg: '#fef3c7' },
  accepted:    { label: 'Confirmed',          color: '#059669', bg: '#d1fae5' },
  rescheduled: { label: 'Reschedule Sent',    color: '#7c3aed', bg: '#ede9fe' },
  declined:    { label: 'Declined',           color: '#dc2626', bg: '#fee2e2' },
};

export default function ProviderConsultations() {
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [proposedAt, setProposedAt]     = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await consultationApi.getProviderSessions();
        setSessions(res.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await consultationApi.accept(id);
      setSessions((prev) => prev.map((s) => s._id === id ? res.data?.data : s));
      showToast('Session accepted. Meet link sent to user.');
    } catch (e) {
      showToast(e.response?.data?.message || 'Accept failed', 'error');
    }
  };

  const handleReschedule = async (id) => {
    if (!proposedAt) { showToast('Please pick a new date/time', 'error'); return; }
    try {
      const res = await consultationApi.proposeReschedule(id, proposedAt);
      setSessions((prev) => prev.map((s) => s._id === id ? res.data?.data : s));
      setRescheduleId(null);
      setProposedAt('');
      showToast('New time proposed to user.');
    } catch (e) {
      showToast(e.response?.data?.message || 'Reschedule failed', 'error');
    }
  };

  const pending    = sessions.filter((s) => s.providerStatus === 'pending'     && s.status === 'scheduled');
  const active     = sessions.filter((s) => s.providerStatus === 'accepted'    && s.status === 'scheduled');
  const rescheduled = sessions.filter((s) => s.providerStatus === 'rescheduled' && s.status === 'scheduled');
  const past       = sessions.filter((s) => ['completed', 'cancelled'].includes(s.status));

  const minDateTime = (() => {
    const d = new Date(Date.now() + 30 * 60 * 1000);
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  })();

  return (
    <div className="pc-root">
      {toast && <div className={`pc-toast pc-toast-${toast.type}`}>{toast.msg}</div>}

      <div className="pc-header">
        <h1>Video Consultation Requests</h1>
        <p>Manage incoming session requests from users</p>
      </div>

      {loading ? (
        <div className="pc-loading">Loading...</div>
      ) : (
        <>
          {/* Pending — needs action */}
          {pending.length > 0 && (
            <section className="pc-section">
              <h2 className="pc-section-title pc-pending-title">
                Pending Requests
                <span className="pc-count-badge">{pending.length}</span>
              </h2>
              <div className="pc-cards">
                {pending.map((s) => (
                  <div key={s._id} className="pc-card pc-card--pending">
                    <div className="pc-card-top">
                      <div>
                        <p className="pc-topic">{s.topic}</p>
                        <p className="pc-meta">
                          User: <strong>{s.userId?.name || 'User'}</strong> &middot; {s.topic}
                        </p>
                      </div>
                      <span className="pc-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                        Pending
                      </span>
                    </div>
                    <div className="pc-details">
                      <span>Requested: {new Date(s.scheduledAt).toLocaleString()}</span>
                      <span>Duration: {s.duration} min</span>
                    </div>
                    {s.notes && <p className="pc-notes">{s.notes}</p>}

                    {rescheduleId === s._id ? (
                      <div className="pc-reschedule-form">
                        <label>Propose New Date &amp; Time</label>
                        <input
                          type="datetime-local"
                          min={minDateTime}
                          value={proposedAt}
                          onChange={(e) => setProposedAt(e.target.value)}
                        />
                        <div className="pc-reschedule-actions">
                          <button className="pc-btn-propose" onClick={() => handleReschedule(s._id)}>
                            Send Proposal
                          </button>
                          <button className="pc-btn-cancel-form" onClick={() => setRescheduleId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pc-actions">
                        <button className="pc-btn-accept" onClick={() => handleAccept(s._id)}>
                          Accept &amp; Generate Link
                        </button>
                        <button className="pc-btn-reschedule" onClick={() => { setRescheduleId(s._id); setProposedAt(''); }}>
                          Propose New Time
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rescheduled — waiting for user to confirm */}
          {rescheduled.length > 0 && (
            <section className="pc-section">
              <h2 className="pc-section-title">Awaiting User Confirmation</h2>
              <div className="pc-cards">
                {rescheduled.map((s) => (
                  <div key={s._id} className="pc-card pc-card--rescheduled">
                    <div className="pc-card-top">
                      <div>
                        <p className="pc-topic">{s.topic}</p>
                        <p className="pc-meta">User: <strong>{s.userId?.name || 'User'}</strong></p>
                      </div>
                      <span className="pc-badge" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                        Reschedule Sent
                      </span>
                    </div>
                    <div className="pc-details">
                      <span>Original: {new Date(s.scheduledAt).toLocaleString()}</span>
                      <span>Proposed: {s.proposedAt ? new Date(s.proposedAt).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Accepted / confirmed */}
          {active.length > 0 && (
            <section className="pc-section">
              <h2 className="pc-section-title">Confirmed Sessions</h2>
              <div className="pc-cards">
                {active.map((s) => (
                  <div key={s._id} className="pc-card pc-card--accepted">
                    <div className="pc-card-top">
                      <div>
                        <p className="pc-topic">{s.topic}</p>
                        <p className="pc-meta">User: <strong>{s.userId?.name || 'User'}</strong> &middot; {s.topic}</p>
                      </div>
                      <span className="pc-badge" style={{ background: '#d1fae5', color: '#059669' }}>
                        Confirmed
                      </span>
                    </div>
                    <div className="pc-details">
                      <span>Date: {new Date(s.scheduledAt).toLocaleString()}</span>
                      <span>Duration: {s.duration} min</span>
                    </div>
                    {s.meetLink && (
                      <a className="pc-meet-link" href={s.meetLink} target="_blank" rel="noreferrer">
                        Join Video Consultation
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section className="pc-section">
              <h2 className="pc-section-title">Past Sessions</h2>
              <div className="pc-cards">
                {past.map((s) => (
                  <div key={s._id} className="pc-card pc-card--past">
                    <div className="pc-card-top">
                      <div>
                        <p className="pc-topic">{s.topic}</p>
                        <p className="pc-meta">User: <strong>{s.userId?.name || 'User'}</strong></p>
                      </div>
                      <span className="pc-badge" style={
                        s.status === 'completed'
                          ? { background: '#d1fae5', color: '#059669' }
                          : { background: '#f1f5f9', color: '#6b7280' }
                      }>
                        {s.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                    <div className="pc-details">
                      <span>{new Date(s.scheduledAt).toLocaleString()}</span>
                      <span>{s.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sessions.length === 0 && (
            <div className="pc-empty">
              <p>No consultation requests yet.</p>
              <small>Requests from users will appear here once they schedule a session with you.</small>
            </div>
          )}
        </>
      )}
    </div>
  );
}
