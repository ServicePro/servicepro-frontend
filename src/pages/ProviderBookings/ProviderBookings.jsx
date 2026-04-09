import { useCallback, useEffect, useState } from 'react';
import bookingApi from '../../api/bookingApi';
import './ProviderBookings.css';

// ── Helpers ────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:   { label: 'Pending',     color: '#a16207', bg: '#fef9c3', icon: '⏳' },
  ACCEPTED:  { label: 'Accepted',    color: '#1d4ed8', bg: '#dbeafe', icon: '✅' },
  ONGOING:   { label: 'In Progress', color: '#6d28d9', bg: '#ede9fe', icon: '🔧' },
  COMPLETED: { label: 'Completed',   color: '#15803d', bg: '#dcfce7', icon: '🏁' },
  CANCELLED: { label: 'Cancelled',   color: '#475569', bg: '#f1f5f9', icon: '✕'  },
};

const TABS = ['ALL', 'PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtTime = (t) => t || '—';

// ── Action modal state ─────────────────────────────────────────
const EMPTY_ACTION = {
  bookingId: null,
  type: null,         // 'approve' | 'reschedule' | 'ongoing' | 'complete' | 'cancel'
  scheduledDate: '',
  scheduledTime: '',
  providerNote: '',
};

export default function ProviderBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [action, setAction]       = useState(EMPTY_ACTION);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);

  // ── Data loading ────────────────────────────────────────────
  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getProviderBookings();
      setBookings(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load bookings.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  // ── Toast helper ────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Open action modal ───────────────────────────────────────
  const openAction = (booking, type) => {
    setAction({
      bookingId: booking._id,
      type,
      scheduledDate: booking.scheduledDate
        ? new Date(booking.scheduledDate).toISOString().split('T')[0]
        : booking.date
          ? new Date(booking.date).toISOString().split('T')[0]
          : '',
      scheduledTime: booking.scheduledTime || booking.time || '',
      providerNote: booking.providerNote || '',
    });
  };

  const closeAction = () => setAction(EMPTY_ACTION);

  // ── Submit action ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const statusMap = {
        approve:    'ACCEPTED',
        reschedule: 'ACCEPTED',
        ongoing:    'ONGOING',
        complete:   'COMPLETED',
        cancel:     'CANCELLED',
      };
      const payload = {
        status: statusMap[action.type],
        providerNote: action.providerNote,
      };
      if (action.type === 'approve' || action.type === 'reschedule') {
        payload.scheduledDate = action.scheduledDate;
        payload.scheduledTime = action.scheduledTime;
      }

      const res = await bookingApi.providerAction(action.bookingId, payload);
      const updated = res.data;
      setBookings((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));

      const msgs = {
        approve:    'Booking approved and customer notified.',
        reschedule: 'Booking rescheduled successfully.',
        ongoing:    'Marked as In Progress.',
        complete:   'Booking marked as Completed.',
        cancel:     'Booking cancelled.',
      };
      showToast(msgs[action.type]);
      closeAction();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Filter by tab ────────────────────────────────────────────
  const displayed = activeTab === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'ALL' ? bookings.length : bookings.filter((b) => b.status === t).length;
    return acc;
  }, {});

  // ── Action modal rendering ───────────────────────────────────
  const modalTitle = {
    approve:    '✅ Approve & Confirm Booking',
    reschedule: '📅 Reschedule Booking',
    ongoing:    '🔧 Mark as In Progress',
    complete:   '🏁 Mark as Completed',
    cancel:     '✕  Cancel Booking',
  }[action.type] || '';

  const needsSchedule = action.type === 'approve' || action.type === 'reschedule';
  const isDestructive = action.type === 'cancel';

  return (
    <div className="pb-root">
      {/* Toast */}
      {toast && (
        <div className={`pb-toast pb-toast-${toast.type}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="pb-header">
        <div>
          <h2>📋 Booking Requests</h2>
          <p>Review incoming bookings, approve, reschedule, or manage their progress</p>
        </div>
        <button className="pb-refresh-btn" onClick={loadBookings} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="pb-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`pb-tab ${activeTab === tab ? 'pb-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ALL' ? 'All' : STATUS_META[tab]?.label}
            {counts[tab] > 0 && (
              <span className={`pb-tab-badge ${tab === 'PENDING' ? 'pb-tab-badge-warn' : ''}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="pb-loading"><div className="pb-spinner" /> Loading bookings…</div>
      ) : displayed.length === 0 ? (
        <div className="pb-empty">
          <span style={{ fontSize: '2.8rem' }}>📭</span>
          <p>No {activeTab === 'ALL' ? '' : activeTab.toLowerCase() + ' '}bookings found</p>
        </div>
      ) : (
        <div className="pb-list">
          {displayed.map((booking) => {
            const meta = STATUS_META[booking.status] || STATUS_META.PENDING;
            const customer = booking.userId;
            const service  = booking.serviceId;
            const effectiveDate = booking.scheduledDate || booking.date;
            const effectiveTime = booking.scheduledTime || booking.time;
            const isRescheduled = booking.scheduledDate && booking.status === 'ACCEPTED';

            return (
              <div key={booking._id} className="pb-card">
                {/* Card header row */}
                <div className="pb-card-header">
                  <div className="pb-card-id">
                    <span className="pb-booking-ref">#{booking._id.slice(-6).toUpperCase()}</span>
                    {isRescheduled && <span className="pb-rescheduled-badge">Rescheduled</span>}
                  </div>
                  <span
                    className="pb-status-badge"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.icon} {meta.label}
                  </span>
                </div>

                {/* Info grid */}
                <div className="pb-info-grid">
                  <div className="pb-info-item">
                    <span>Customer</span>
                    <strong>{customer?.name || 'Unknown'}</strong>
                    <small>{customer?.phone || customer?.email || ''}</small>
                  </div>
                  <div className="pb-info-item">
                    <span>Service</span>
                    <strong>{service?.name || 'Service'}</strong>
                    <small>{service?.category || ''}</small>
                  </div>
                  <div className="pb-info-item">
                    <span>{isRescheduled ? 'Scheduled Date' : 'Requested Date'}</span>
                    <strong>{fmtDate(effectiveDate)}</strong>
                    <small>{fmtTime(effectiveTime)}</small>
                  </div>
                  <div className="pb-info-item">
                    <span>Location</span>
                    <strong>{booking.location || '—'}</strong>
                  </div>
                  <div className="pb-info-item">
                    <span>Amount</span>
                    <strong>Rs. {Number(booking.amount || 0).toFixed(2)}</strong>
                    <small>{booking.paymentState}</small>
                  </div>
                  <div className="pb-info-item">
                    <span>Booked</span>
                    <strong>{fmtDate(booking.createdAt)}</strong>
                  </div>
                </div>

                {/* Provider note if any */}
                {booking.providerNote && (
                  <div className="pb-note">
                    <span>📝 Your note:</span> {booking.providerNote}
                  </div>
                )}

                {/* Action buttons (only for actionable statuses) */}
                <div className="pb-actions">
                  {booking.status === 'PENDING' && (
                    <>
                      <button className="pb-btn pb-btn-primary" onClick={() => openAction(booking, 'approve')}>
                        ✅ Approve Booking
                      </button>
                      <button className="pb-btn pb-btn-outline" onClick={() => openAction(booking, 'reschedule')}>
                        📅 Approve & Reschedule
                      </button>
                      <button className="pb-btn pb-btn-danger-outline" onClick={() => openAction(booking, 'cancel')}>
                        ✕ Decline
                      </button>
                    </>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <>
                      <button className="pb-btn pb-btn-primary" onClick={() => openAction(booking, 'ongoing')}>
                        🔧 Start Service
                      </button>
                      <button className="pb-btn pb-btn-outline" onClick={() => openAction(booking, 'reschedule')}>
                        📅 Reschedule
                      </button>
                      <button className="pb-btn pb-btn-danger-outline" onClick={() => openAction(booking, 'cancel')}>
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'ONGOING' && (
                    <button className="pb-btn pb-btn-success" onClick={() => openAction(booking, 'complete')}>
                      🏁 Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {action.bookingId && (
        <div className="pb-modal-overlay" onClick={closeAction}>
          <div className="pb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pb-modal-header">
              <h3>{modalTitle}</h3>
              <button className="pb-modal-close" onClick={closeAction}>✕</button>
            </div>

            <div className="pb-modal-body">
              {needsSchedule && (
                <>
                  <label className="pb-label">
                    Scheduled Date
                    <input
                      type="date"
                      className="pb-input"
                      value={action.scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setAction((a) => ({ ...a, scheduledDate: e.target.value }))}
                    />
                  </label>
                  <label className="pb-label">
                    Scheduled Time
                    <input
                      type="time"
                      className="pb-input"
                      value={action.scheduledTime}
                      onChange={(e) => setAction((a) => ({ ...a, scheduledTime: e.target.value }))}
                    />
                  </label>
                </>
              )}

              <label className="pb-label">
                Note to Customer <span className="pb-optional">(optional)</span>
                <textarea
                  className="pb-input pb-textarea"
                  rows={3}
                  placeholder={
                    isDestructive
                      ? 'Reason for cancellation…'
                      : 'Instructions, preparation tips, or any message to the customer…'
                  }
                  value={action.providerNote}
                  onChange={(e) => setAction((a) => ({ ...a, providerNote: e.target.value }))}
                />
              </label>
            </div>

            <div className="pb-modal-footer">
              <button className="pb-btn pb-btn-ghost" onClick={closeAction} disabled={submitting}>
                Cancel
              </button>
              <button
                className={`pb-btn ${isDestructive ? 'pb-btn-danger' : 'pb-btn-primary'}`}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
