import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import emergencyApi from '../../api/emergencyApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './EmergencyServices.css';

const TABS = ['Request Service', 'Active Requests', 'Priority History'];

const URGENCY_CONFIG = {
  high:     { label: 'High Priority',   mult: 1.5, color: '#f59e0b', badge: '🔥', eta: '25–45 min' },
  critical: { label: 'Critical / ASAP', mult: 2.0, color: '#ef4444', badge: '🚨', eta: '15–30 min' },
};

const STATUS_CONFIG = {
  pending:   { label: 'Finding Provider',  color: '#f59e0b', bg: '#fef3c7', icon: '🔍' },
  assigned:  { label: 'Provider Assigned', color: '#2563eb', bg: '#dbeafe', icon: '👷' },
  en_route:  { label: 'En Route',          color: '#7c3aed', bg: '#ede9fe', icon: '🚗' },
  completed: { label: 'Completed',         color: '#10b981', bg: '#d1fae5', icon: '✅' },
  cancelled: { label: 'Cancelled',         color: '#6b7280', bg: '#f1f5f9', icon: '❌' },
};

const STEP_LABELS = ['Select Service', 'Choose Provider', 'Confirm & Request'];

export default function EmergencyServices() {
  const [activeTab, setActiveTab]           = useState('Request Service');
  const [serviceTypes, setServiceTypes]     = useState([]);
  const [myRequests, setMyRequests]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [toast, setToast]                   = useState(null);

  // Wizard
  const [step, setStep]                     = useState(0);
  const [urgency, setUrgency]               = useState('high');
  const [selectedSvc, setSelectedSvc]       = useState(null);
  const [providers, setProviders]           = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [form, setForm]                     = useState({ description: '', location: '' });
  const [submitting, setSubmitting]         = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [waitPhase, setWaitPhase]           = useState(false);
  const [accepted, setAccepted]             = useState(false);

  const pollRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Initial data load ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [stRes, myRes] = await Promise.all([
          emergencyApi.getServiceTypes(),
          emergencyApi.getMy(),
        ]);
        const types = stRes.data?.data || [];
        setServiceTypes(types);
        setMyRequests(myRes.data?.data || []);

        const qParam = searchParams.get('q');
        if (qParam) {
          const match = types.find((s) => s.id === qParam);
          if (match) loadProviders(match);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  // ── Poll for provider acceptance ──────────────────────────
  useEffect(() => {
    if (!waitPhase || !submittedRequest) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await emergencyApi.getById(submittedRequest._id);
        const req = res.data?.data;
        if (req?.status === 'assigned' || req?.status === 'en_route') {
          setSubmittedRequest(req);
          setAccepted(true);
          setWaitPhase(false);
          setMyRequests((prev) => [req, ...prev.filter((r) => r._id !== req._id)]);
          clearInterval(pollRef.current);
        }
      } catch { /* ignore poll error */ }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [waitPhase, submittedRequest]);

  // ── Helpers ───────────────────────────────────────────────
  const loadProviders = (svc) => {
    setSelectedSvc(svc);
    setStep(1);
    setLoadingProviders(true);
    setProviders([]);
    emergencyApi.getProviders(svc.id)
      .then((res) => setProviders(res.data?.data || []))
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false));
  };

  const handleProviderSelect = (p) => {
    setSelectedProvider(p);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.location) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await emergencyApi.create({
        serviceType: selectedSvc.id,
        description: form.description,
        location:    form.location,
        urgency,
        providerId:  selectedProvider._id,
        basePrice:   selectedProvider.baseServicePrice,
      });
      const newReq = res.data?.data;
      setSubmittedRequest(newReq);
      setMyRequests((prev) => [newReq, ...prev]);
      setWaitPhase(true);
    } catch (e) {
      showToast(e.response?.data?.message || 'Request failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!submittedRequest) return;
    const mult     = URGENCY_CONFIG[urgency]?.mult || 1.5;
    const svcLabel = selectedSvc?.label || submittedRequest.serviceType;
    const urgLabel = URGENCY_CONFIG[urgency]?.label || urgency;
    navigate(
      `/checkout?type=emergency` +
      `&id=${submittedRequest._id}` +
      `&amount=${submittedRequest.finalPrice}` +
      `&base=${submittedRequest.basePrice}` +
      `&mult=${mult}` +
      `&label=${encodeURIComponent(svcLabel)}` +
      `&sublabel=${encodeURIComponent(urgLabel + ' • ETA ' + submittedRequest.eta)}`
    );
  };

  const handleCancelAndReset = async () => {
    if (submittedRequest) {
      try { await emergencyApi.cancel(submittedRequest._id); } catch { /* ignore */ }
      setMyRequests((prev) => prev.filter((r) => r._id !== submittedRequest._id));
    }
    clearInterval(pollRef.current);
    resetWizard();
  };

  const resetWizard = () => {
    setStep(0);
    setSelectedSvc(null);
    setSelectedProvider(null);
    setProviders([]);
    setForm({ description: '', location: '' });
    setSubmittedRequest(null);
    setWaitPhase(false);
    setAccepted(false);
  };

  const handleCancel = async (id) => {
    try {
      const res = await emergencyApi.cancel(id);
      setMyRequests((prev) => prev.map((r) => (r._id === id ? res.data?.data : r)));
      showToast('Request cancelled');
    } catch (e) {
      showToast(e.response?.data?.message || 'Cancel failed', 'error');
    }
  };

  const activeRequests  = myRequests.filter((r) => ['pending', 'assigned', 'en_route'].includes(r.status));
  const historyRequests = myRequests.filter((r) => ['completed', 'cancelled'].includes(r.status));
  const mult            = URGENCY_CONFIG[urgency]?.mult || 1.5;

  return (
    <>
      <UserNavbar />
      <div className="em-root">
        {toast && <div className={`em-toast em-toast-${toast.type}`}>{toast.msg}</div>}

        <div className="em-page-header">
          <div>
            <h1>🚨 Emergency Services</h1>
            <p>Get urgent help fast — priority dispatch available 24/7</p>
          </div>
          <div className="em-header-stats">
            <div className="em-stat"><span className="em-stat-num">24 / 7</span><span>Availability</span></div>
            <div className="em-stat"><span className="em-stat-num">~30 min</span><span>Avg Response</span></div>
            <div className="em-stat"><span className="em-stat-num">100+</span><span>Providers</span></div>
          </div>
        </div>

        <div className="em-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`em-tab${activeTab === t ? ' em-tab-active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'Request Service'  && '🆘 '}
              {t === 'Active Requests'  && '⚡ '}
              {t === 'Priority History' && '📋 '}
              {t}
              {t === 'Active Requests' && activeRequests.length > 0 && (
                <span className="em-badge">{activeRequests.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="em-loading"><div className="em-spinner" />Loading...</div>
        ) : (
          <>
            {/* ────────────────── REQUEST SERVICE ────────────────── */}
            {activeTab === 'Request Service' && (
              <div className="em-request-root">

                {/* Step progress bar */}
                <div className="em-step-bar">
                  {STEP_LABELS.map((label, i) => (
                    <div
                      key={i}
                      className={`em-step-item${i === step ? ' em-step-active' : i < step ? ' em-step-done' : ''}`}
                    >
                      <div className="em-step-dot">{i < step ? '✔' : i + 1}</div>
                      <span className="em-step-label">{label}</span>
                    </div>
                  ))}
                </div>

                {/* ── STEP 0: Urgency + Service type ── */}
                {step === 0 && (
                  <>
                    <div className="em-urgency-cards">
                      {Object.entries(URGENCY_CONFIG).map(([key, cfg]) => (
                        <div
                          key={key}
                          className={`em-urgency-card${urgency === key ? ' em-urgency-active' : ''}`}
                          style={{ '--urg-color': cfg.color }}
                          onClick={() => setUrgency(key)}
                        >
                          <span className="em-urg-badge">{cfg.badge}</span>
                          <strong>{cfg.label}</strong>
                          <p>ETA: {cfg.eta}</p>
                          <p className="em-urg-mult">Price ×{cfg.mult}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="em-section-title">Select Service Type</h3>
                    <div className="em-svc-grid">
                      {serviceTypes.map((svc) => (
                        <div
                          key={svc.id}
                          className="em-svc-card"
                          onClick={() => loadProviders(svc)}
                        >
                          <span className="em-svc-icon">{svc.icon}</span>
                          <p className="em-svc-label">{svc.label}</p>
                          <p className="em-svc-price">from Rs. {svc.basePrice}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── STEP 1: Choose a provider ── */}
                {step === 1 && (
                  <>
                    <div className="em-step-header">
                      <button className="em-back-btn" onClick={() => setStep(0)}>← Back</button>
                      <h3 className="em-section-title">
                        {selectedSvc?.icon} {selectedSvc?.label} Providers
                        <span
                          className="em-urgency-tag"
                          style={{ background: URGENCY_CONFIG[urgency].color }}
                        >
                          {URGENCY_CONFIG[urgency].badge} {URGENCY_CONFIG[urgency].label} ×{URGENCY_CONFIG[urgency].mult}
                        </span>
                      </h3>
                    </div>

                    {loadingProviders ? (
                      <div className="em-loading"><div className="em-spinner" />Finding providers...</div>
                    ) : providers.length === 0 ? (
                      <div className="em-empty">
                        <span style={{ fontSize: '3rem' }}>🔍</span>
                        <p>No providers found for this category yet.</p>
                        <button className="em-cta-btn" onClick={() => setStep(0)}>Try Another Service</button>
                      </div>
                    ) : (
                      <div className="em-providers-grid">
                        {providers.map((p) => {
                          const emPrice = (p.baseServicePrice * mult).toFixed(2);
                          return (
                            <div
                              key={p._id}
                              className="em-provider-card em-provider-accepts em-provider-clickable"
                              onClick={() => handleProviderSelect(p)}
                            >
                              <div className="em-prov-avatar">
                                {p.profile_image
                                  ? <img src={p.profile_image} alt={p.name} />
                                  : <span>{p.name?.[0]?.toUpperCase()}</span>}
                              </div>
                              <div className="em-prov-info">
                                <p className="em-prov-name">{p.name}</p>
                                <p className="em-prov-service">{p.serviceName}</p>
                                <p className="em-prov-area">📍 {p.area || 'Local Area'}</p>
                              </div>
                              <div className="em-prov-right">
                                <span className="em-prov-rating">⭐ {p.rating?.toFixed(1) || '4.5'}</span>
                                <span className="em-prov-base-price">Rs. {p.baseServicePrice}/hr</span>
                                <span className="em-prov-em-price">🚨 Rs. {emPrice} emergency</span>
                                <span className="em-prov-badge">✅ Accepts Emergency</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* ── STEP 2: Confirm form / Waiting / Accepted ── */}
                {step === 2 && (
                  <>
                    {/* Waiting for provider acceptance */}
                    {waitPhase && (
                      <div className="em-wait-screen">
                        <div className="em-wait-spinner" />
                        <h2>Waiting for Provider Acceptance…</h2>
                        <p>
                          Your request has been sent to <strong>{selectedProvider?.name}</strong>.
                          They are reviewing it now.
                        </p>
                        <p className="em-wait-sub">This usually takes 1–3 minutes.</p>
                        <button className="em-cancel-btn" onClick={handleCancelAndReset}>
                          Cancel Request
                        </button>
                      </div>
                    )}

                    {/* Provider accepted */}
                    {accepted && submittedRequest && (
                      <div className="em-accepted-screen">
                        <div className="em-accepted-icon">✅</div>
                        <h2 className="em-accepted-title">Provider Accepted!</h2>
                        <p className="em-accepted-sub">
                          <strong>{selectedProvider?.name}</strong> has accepted your emergency request.
                        </p>
                        <div className="em-accepted-eta">
                          <span>⏱ ETA:</span>
                          <strong>{submittedRequest.eta}</strong>
                        </div>
                        <p className="em-accepted-msg">
                          They are on their way. Please be available at the provided location.
                        </p>
                        <button className="em-submit-btn" onClick={handleProceedToPayment}>
                          Proceed to Payment →
                        </button>
                        <button className="em-back-btn em-back-small" onClick={resetWizard}>
                          Request Another Service
                        </button>
                      </div>
                    )}

                    {/* Confirmation form (shown before submit) */}
                    {!waitPhase && !accepted && (
                      <>
                        <div className="em-step-header">
                          <button className="em-back-btn" onClick={() => setStep(1)}>← Back</button>
                          <h3 className="em-section-title">Confirm Emergency Request</h3>
                        </div>

                        {/* Selected provider summary */}
                        <div className="em-confirm-provider">
                          <div className="em-prov-avatar em-prov-avatar-lg">
                            {selectedProvider?.profile_image
                              ? <img src={selectedProvider.profile_image} alt={selectedProvider.name} />
                              : <span>{selectedProvider?.name?.[0]?.toUpperCase()}</span>}
                          </div>
                          <div className="em-confirm-prov-info">
                            <p className="em-prov-name">{selectedProvider?.name}</p>
                            <p className="em-prov-service">{selectedProvider?.serviceName}</p>
                            <p className="em-prov-area">📍 {selectedProvider?.area || 'Local Area'}</p>
                            <span className="em-prov-rating">
                              ⭐ {selectedProvider?.rating?.toFixed(1) || '4.5'}
                            </span>
                          </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="em-price-preview">
                          <div className="em-price-row">
                            <span>Provider Base Price</span>
                            <span>Rs. {selectedProvider?.baseServicePrice}/hr</span>
                          </div>
                          <div className="em-price-row">
                            <span>
                              Emergency Surcharge ({URGENCY_CONFIG[urgency]?.label} ×{URGENCY_CONFIG[urgency]?.mult})
                            </span>
                            <span>
                              +Rs. {((mult - 1) * (selectedProvider?.baseServicePrice || 0)).toFixed(2)}
                            </span>
                          </div>
                          <div className="em-price-row em-price-total">
                            <span>Total Emergency Price</span>
                            <span>Rs. {((selectedProvider?.baseServicePrice || 0) * mult).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Form */}
                        <form className="em-form" onSubmit={handleSubmit}>
                          <div className="em-form-group">
                            <label>Location / Address *</label>
                            <input
                              type="text"
                              placeholder="e.g. 45 Main Street, Colombo 03"
                              value={form.location}
                              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="em-form-group">
                            <label>Describe the problem *</label>
                            <textarea
                              rows={4}
                              placeholder="Briefly describe the emergency — e.g. pipe burst under kitchen sink, water flooding..."
                              value={form.description}
                              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className={`em-submit-btn${urgency === 'critical' ? ' em-submit-critical' : ''}`}
                            disabled={submitting}
                          >
                            {submitting
                              ? 'Sending Request…'
                              : `${URGENCY_CONFIG[urgency]?.badge} Send Emergency Request to ${selectedProvider?.name}`}
                          </button>
                        </form>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ────────────────── ACTIVE REQUESTS ────────────────── */}
            {activeTab === 'Active Requests' && (
              <div className="em-list">
                {activeRequests.length === 0 ? (
                  <div className="em-empty">
                    <span style={{ fontSize: '3rem' }}>✅</span>
                    <p>No active emergency requests</p>
                    <button className="em-cta-btn" onClick={() => setActiveTab('Request Service')}>
                      Request Emergency Service
                    </button>
                  </div>
                ) : (
                  activeRequests.map((r) => (
                    <RequestCard key={r._id} request={r} serviceTypes={serviceTypes} onCancel={handleCancel} />
                  ))
                )}
              </div>
            )}

            {/* ────────────────── PRIORITY HISTORY ───────────────── */}
            {activeTab === 'Priority History' && (
              <div className="em-list">
                {historyRequests.length === 0 ? (
                  <div className="em-empty">
                    <span style={{ fontSize: '3rem' }}>📋</span>
                    <p>No history yet</p>
                  </div>
                ) : (
                  historyRequests.map((r) => (
                    <RequestCard key={r._id} request={r} serviceTypes={serviceTypes} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function RequestCard({ request, serviceTypes, onCancel }) {
  const navigate = useNavigate();
  const svc = serviceTypes.find((s) => s.id === request.serviceType) || {};
  const st  = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
  const urg = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.high;

  const canPay = ['assigned', 'en_route'].includes(request.status) &&
    request.paymentStatus === 'unpaid';

  const handlePay = () => {
    const multVal = URGENCY_CONFIG[request.urgency]?.mult || 1.5;
    navigate(
      `/checkout?type=emergency` +
      `&id=${request._id}` +
      `&amount=${request.finalPrice}` +
      `&base=${request.basePrice}` +
      `&mult=${multVal}` +
      `&label=${encodeURIComponent(svc.label || request.serviceType)}` +
      `&sublabel=${encodeURIComponent((urg.label || request.urgency) + ' • ETA ' + request.eta)}`
    );
  };

  return (
    <div className="em-req-card">
      <div className="em-req-top">
        <div className="em-req-svc">
          <span className="em-req-icon">{svc.icon || '🔧'}</span>
          <div>
            <p className="em-req-name">{svc.label || request.serviceType}</p>
            <p className="em-req-date">{new Date(request.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="em-req-badges">
          <span className="em-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.icon} {st.label}
          </span>
          <span className="em-urg-pill" style={{ background: urg.color + '22', color: urg.color }}>
            {urg.badge} {urg.label}
          </span>
        </div>
      </div>

      <p className="em-req-desc">{request.description}</p>

      <div className="em-req-meta">
        <span>📍 {request.location}</span>
        <span>⏱ ETA: {request.eta}</span>
        <span>💸 Rs. {request.finalPrice}</span>
        {request.paymentStatus === 'cash_pending' && (
          <span className="em-pay-cash-badge">💵 Cash on Delivery</span>
        )}
        {request.paymentStatus === 'paid' && (
          <span className="em-pay-done-badge">✅ Paid</span>
        )}
      </div>

      <div className="em-req-actions">
        {onCancel && request.status === 'pending' && (
          <button className="em-cancel-btn" onClick={() => onCancel(request._id)}>
            ✕ Cancel Request
          </button>
        )}
        {canPay && (
          <button className="em-pay-btn" onClick={handlePay}>
            💳 Pay Now — Rs. {request.finalPrice}
          </button>
        )}
      </div>
    </div>
  );
}
