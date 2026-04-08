import { useEffect, useRef, useState } from 'react';
import consultationApi from '../../api/consultationApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './VideoConsultation.css';

const TABS = ['Schedule Session', 'My Sessions', 'Join Call'];

const DURATION_OPTIONS = [15, 30, 45, 60];

const STATUS_CONFIG = {
  scheduled:   { label: 'Scheduled',   color: '#2563eb', bg: '#dbeafe', icon: 'scheduled' },
  in_progress: { label: 'In Progress', color: '#7c3aed', bg: '#ede9fe', icon: 'in_progress' },
  completed:   { label: 'Completed',   color: '#10b981', bg: '#d1fae5', icon: 'completed' },
  cancelled:   { label: 'Cancelled',   color: '#6b7280', bg: '#f1f5f9', icon: 'cancelled' },
};

const PROVIDER_STATUS_CONFIG = {
  pending:     { label: 'Awaiting Confirmation', color: '#d97706', bg: '#fef3c7' },
  accepted:    { label: 'Confirmed',             color: '#059669', bg: '#d1fae5' },
  rescheduled: { label: 'New Time Proposed',     color: '#7c3aed', bg: '#ede9fe' },
  declined:    { label: 'Declined',              color: '#dc2626', bg: '#fee2e2' },
};

export default function VideoConsultation() {
  const [activeTab, setActiveTab] = useState('Schedule Session');
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [services, setServices]         = useState([]);
  const [sessions, setSessions]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [toast, setToast]               = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({ providerId: '', serviceId: '', topic: '', scheduledAt: '', duration: 30, notes: '' });

  const [activeCall, setActiveCall]   = useState(null);
  const [callStarted, setCallStarted] = useState(false);
  const [micOn, setMicOn]             = useState(true);
  const [camOn, setCamOn]             = useState(true);
  const [elapsed, setElapsed]         = useState(0);
  const timerRef                      = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const [svcRes, sessRes] = await Promise.all([
          consultationApi.getServices(),
          consultationApi.getMy(),
        ]);
        setServices(svcRes.data?.data  || []);
        setSessions(sessRes.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Step 1: category chosen → fetch providers for that category from API
  const handleCategoryChange = async (cat) => {
    setSelectedCategory(cat);
    setForm((f) => ({ ...f, providerId: '', serviceId: '' }));
    if (!cat) { setFilteredProviders([]); return; }
    try {
      const res = await consultationApi.getProviders(cat);
      setFilteredProviders(res.data?.data || []);
    } catch {
      setFilteredProviders([]);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!form.providerId || !form.topic || !form.scheduledAt) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.serviceId) delete payload.serviceId;
      await consultationApi.schedule(payload);
      // Re-fetch all sessions so populate returns fresh provider data
      const fresh = await consultationApi.getMy();
      setSessions(fresh.data?.data || []);
      showToast('Session scheduled! Waiting for provider confirmation.');
      setForm({ providerId: '', serviceId: '', topic: '', scheduledAt: '', duration: 30, notes: '' });
      setSelectedCategory('');
      setFilteredProviders([]);
      setActiveTab('My Sessions');
    } catch (e) {
      showToast(e.response?.data?.message || 'Scheduling failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await consultationApi.cancel(id);
      setSessions((prev) => prev.map((s) => s._id === id ? res.data?.data : s));
      showToast('Session cancelled');
    } catch (e) {
      showToast(e.response?.data?.message || 'Cancel failed', 'error');
    }
  };

  const handleConfirmReschedule = async (id) => {
    try {
      const res = await consultationApi.confirmReschedule(id);
      setSessions((prev) => prev.map((s) => s._id === id ? res.data?.data : s));
      showToast('New time confirmed! Meet link is ready.');
    } catch (e) {
      showToast(e.response?.data?.message || 'Confirm failed', 'error');
    }
  };

  const startCall = (session) => {
    setActiveCall(session);
    setCallStarted(false);
    setElapsed(0);
    setActiveTab('Join Call');
  };

  const handleJoinCall = () => {
    setCallStarted(true);
    timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
  };

  const handleEndCall = () => {
    clearInterval(timerRef.current);
    setCallStarted(false);
    setActiveCall(null);
    showToast('Call ended. Session saved.');
    setActiveTab('My Sessions');
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const upcoming = sessions.filter((s) => s.status === 'scheduled');
  const past     = sessions.filter((s) => ['completed','cancelled'].includes(s.status));

  const minDateTime = (() => {
    const d = new Date(Date.now() + 30 * 60 * 1000);
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  })();

  return (
    <>
      <UserNavbar />
      <div className="vc-root">
        {toast && <div className={`vc-toast vc-toast-${toast.type}`}>{toast.msg}</div>}

        <div className="vc-page-header">
          <div>
            <h1>Video Consultation</h1>
            <p>Virtual inspections and expert advice — from the comfort of your home</p>
          </div>
          <div className="vc-header-features">
            <span>HD Video</span>
            <span>Encrypted</span>
            <span>Screen Share</span>
            <span>Recording</span>
          </div>
        </div>

        <div className="vc-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`vc-tab${activeTab === t ? ' vc-tab-active' : ''}`}
              onClick={async () => {
                setActiveTab(t);
                if (t === 'My Sessions') {
                  try {
                    const fresh = await consultationApi.getMy();
                    setSessions(fresh.data?.data || []);
                  } catch { /* keep existing */ }
                }
              }}
            >
              {t}
              {t === 'My Sessions' && upcoming.length > 0 && (
                <span className="vc-badge">{upcoming.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="vc-loading"><div className="vc-spinner" />Loading...</div>
        ) : (
          <>
            {/* SCHEDULE SESSION */}
            {activeTab === 'Schedule Session' && (
              <div className="vc-schedule-root">
                <div className="vc-info-banner">
                  <div className="vc-info-item"><span>Virtual Inspection</span><small>Let the provider diagnose remotely</small></div>
                  <div className="vc-info-item"><span>Expert Advice</span><small>Get professional guidance before booking</small></div>
                  <div className="vc-info-item"><span>Flexible Duration</span><small>15 to 60 minute sessions</small></div>
                  <div className="vc-info-item"><span>Free with Premium</span><small>Standard: Rs. 5/session</small></div>
                </div>

                <form className="vc-form" onSubmit={handleSchedule}>
                  {/* Step 1: Select Category */}
                  <div className="vc-form-group">
                    <label>Step 1 — Select Service Category *</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      required
                    >
                      <option value="">Choose a category</option>
                      {[...new Set(services.map((s) => s.category).filter(Boolean))].sort().map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Select Provider (filtered by category) */}
                  <div className="vc-form-group">
                    <label>Step 2 — Select Service Provider *</label>
                    <select
                      value={form.providerId}
                      onChange={(e) => setForm((f) => ({ ...f, providerId: e.target.value }))}
                      required
                      disabled={!selectedCategory}
                    >
                      <option value="">
                        {!selectedCategory
                          ? 'Please select a category first'
                          : filteredProviders.length === 0
                            ? `No providers available for ${selectedCategory}`
                            : 'Select a provider'}
                      </option>
                      {filteredProviders.map((p) => (
                        <option key={p._id} value={p._id}>{p.name} — {p.category || p.email}</option>
                      ))}
                    </select>
                    {selectedCategory && filteredProviders.length > 0 && (
                      <p className="vc-category-hint">{filteredProviders.length} provider{filteredProviders.length > 1 ? 's' : ''} available in <strong>{selectedCategory}</strong></p>
                    )}
                  </div>

                  <div className="vc-form-group">
                    <label>Session Topic *</label>
                    <input
                      type="text"
                      placeholder="e.g. Diagnose water leak under kitchen sink"
                      value={form.topic}
                      onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="vc-form-row">
                    <div className="vc-form-group">
                      <label>Preferred Date and Time *</label>
                      <input
                        type="datetime-local"
                        min={minDateTime}
                        value={form.scheduledAt}
                        onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="vc-form-group">
                      <label>Duration</label>
                      <div className="vc-duration-pills">
                        {DURATION_OPTIONS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            className={`vc-duration-pill${form.duration === d ? ' vc-duration-active' : ''}`}
                            onClick={() => setForm((f) => ({ ...f, duration: d }))}
                          >
                            {d} min
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="vc-form-group">
                    <label>Notes (optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Any additional context you would like to share..."
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    />
                  </div>

                  <button type="submit" className="vc-schedule-btn" disabled={submitting}>
                    {submitting ? 'Scheduling...' : 'Schedule Video Session'}
                  </button>
                </form>
              </div>
            )}

            {/* MY SESSIONS */}
            {activeTab === 'My Sessions' && (
              <div className="vc-sessions-root">
                {upcoming.length > 0 && (
                  <>
                    <h3 className="vc-section-heading">Upcoming Sessions</h3>
                    <div className="vc-sessions-list">
                      {upcoming.map((s) => (
                        <SessionCard
                          key={s._id}
                          session={s}
                          onJoin={startCall}
                          onCancel={handleCancel}
                          onConfirm={handleConfirmReschedule}
                        />
                      ))}
                    </div>
                  </>
                )}
                {past.length > 0 && (
                  <>
                    <h3 className="vc-section-heading" style={{ marginTop: '28px' }}>Past Sessions</h3>
                    <div className="vc-sessions-list">
                      {past.map((s) => <SessionCard key={s._id} session={s} />)}
                    </div>
                  </>
                )}
                {sessions.length === 0 && (
                  <div className="vc-empty">
                    <span style={{ fontSize: '3rem' }}>video</span>
                    <p>No sessions yet</p>
                    <button className="vc-cta-btn" onClick={() => setActiveTab('Schedule Session')}>
                      Schedule Your First Session
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* JOIN CALL */}
            {activeTab === 'Join Call' && (
              <div className="vc-call-root">
                {!activeCall ? (
                  <div className="vc-no-call">
                    <p>No active session selected</p>
                    <p className="vc-no-call-sub">Go to <strong>My Sessions</strong> and click <em>Join Now</em> on a confirmed session.</p>
                    {upcoming.filter((s) => s.providerStatus === 'accepted').length > 0 && (
                      <div className="vc-upcoming-quick">
                        <h4>Ready to Join</h4>
                        {upcoming.filter((s) => s.providerStatus === 'accepted').map((s) => (
                          <button key={s._id} className="vc-quick-join-btn" onClick={() => startCall(s)}>
                            {s.topic} — {new Date(s.scheduledAt).toLocaleString()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : !callStarted ? (
                  <div className="vc-pre-call">
                    <div className="vc-pre-call-preview">
                      <div className="vc-camera-preview">
                        <div className="vc-camera-off-icon">Camera</div>
                        <p>Camera Preview</p>
                      </div>
                    </div>
                    <div className="vc-pre-call-info">
                      <h2>{activeCall.topic}</h2>
                      <p>Provider: <strong>{activeCall.providerId?.name || 'Provider'}</strong></p>
                      <p>Service: <strong>{activeCall.serviceId?.name || 'Service'}</strong></p>
                      <p>Duration: <strong>{activeCall.duration} minutes</strong></p>
                      {activeCall.meetLink && (
                        <a className="vc-external-meet-link" href={activeCall.meetLink} target="_blank" rel="noreferrer">
                          Open in Jitsi Meet (new tab)
                        </a>
                      )}
                      <div className="vc-pre-call-controls">
                        <button className={`vc-media-btn${micOn ? '' : ' vc-media-off'}`} onClick={() => setMicOn(!micOn)}>
                          {micOn ? 'Mic On' : 'Mic Off'}
                        </button>
                        <button className={`vc-media-btn${camOn ? '' : ' vc-media-off'}`} onClick={() => setCamOn(!camOn)}>
                          {camOn ? 'Cam On' : 'Cam Off'}
                        </button>
                      </div>
                      <button className="vc-join-btn" onClick={handleJoinCall}>Join Now</button>
                    </div>
                  </div>
                ) : (
                  <div className="vc-active-call">
                    <div className="vc-call-header">
                      <div className="vc-call-title">{activeCall.topic}</div>
                      <div className="vc-call-timer">
                        <span className="vc-timer-dot" />
                        {formatTime(elapsed)}
                      </div>
                    </div>
                    <div className="vc-video-area">
                      <div className="vc-video-main">
                        <div className="vc-video-placeholder">
                          <span>Provider</span>
                          <p>{activeCall.providerId?.name || 'Provider'}</p>
                          <small>Video feed simulation</small>
                        </div>
                      </div>
                      <div className="vc-video-self">
                        <span>{camOn ? 'You' : 'Cam Off'}</span>
                        <small>You</small>
                      </div>
                    </div>
                    <div className="vc-call-toolbar">
                      <button className={`vc-tool-btn${micOn ? '' : ' vc-tool-off'}`} onClick={() => setMicOn(!micOn)}>
                        {micOn ? 'Mute' : 'Unmute'}
                      </button>
                      <button className={`vc-tool-btn${camOn ? '' : ' vc-tool-off'}`} onClick={() => setCamOn(!camOn)}>
                        {camOn ? 'Stop Cam' : 'Start Cam'}
                      </button>
                      <button className="vc-tool-btn">Chat</button>
                      <button className="vc-tool-btn">Screen</button>
                      <button className="vc-end-btn" onClick={handleEndCall}>End Call</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function SessionCard({ session, onJoin, onCancel, onConfirm }) {
  const st = STATUS_CONFIG[session.status] || STATUS_CONFIG.scheduled;
  const ps = PROVIDER_STATUS_CONFIG[session.providerStatus] || PROVIDER_STATUS_CONFIG.pending;
  const isUpcoming   = session.status === 'scheduled';
  const isAccepted   = session.providerStatus === 'accepted';
  const isRescheduled = session.providerStatus === 'rescheduled';

  return (
    <div className="vc-session-card">
      <div className="vc-session-top">
        <div>
          <p className="vc-session-topic">{session.topic}</p>
          <p className="vc-session-meta">
            {session.providerId?.name || 'Provider'} &middot; {session.providerId?.category || 'Consultation'}
          </p>
        </div>
        <div className="vc-session-badges">
          <span className="vc-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>
          {isUpcoming && (
            <span className="vc-status-badge" style={{ background: ps.bg, color: ps.color }}>
              {ps.label}
            </span>
          )}
        </div>
      </div>

      <div className="vc-session-details">
        <span>Category: {session.providerId?.category || '—'}</span>
        <span>Date: {new Date(session.scheduledAt).toLocaleString()}</span>
        <span>Duration: {session.duration} min</span>
      </div>

      {/* Provider proposed new time */}
      {isRescheduled && session.proposedAt && (
        <div className="vc-reschedule-notice">
          <strong>Provider proposed a new time:</strong>
          <span>{new Date(session.proposedAt).toLocaleString()}</span>
          {onConfirm && (
            <button className="vc-confirm-btn" onClick={() => onConfirm(session._id)}>
              Accept New Time
            </button>
          )}
        </div>
      )}

      {/* Meet link when accepted */}
      {isAccepted && session.meetLink && (
        <div className="vc-meet-link-box">
          <span className="vc-meet-link-label">Your meeting is ready</span>
          <a
            className="vc-meet-link-btn"
            href={session.meetLink}
            target="_blank"
            rel="noreferrer"
          >
            Join Video Consultation
          </a>
        </div>
      )}

      {session.notes && <p className="vc-session-notes">{session.notes}</p>}

      {isUpcoming && (
        <div className="vc-session-actions">
          {onJoin && isAccepted && (
            <button className="vc-join-session-btn" onClick={() => onJoin(session)}>
              Join Now
            </button>
          )}
          {onCancel && (
            <button className="vc-cancel-session-btn" onClick={() => onCancel(session._id)}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}