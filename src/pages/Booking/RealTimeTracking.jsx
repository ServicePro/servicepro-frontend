import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './RealTimeTracking.css';

// Only the 4 normal progression steps — CANCELLED is handled as a banner
const statusDefinitions = [
  { key: 'PENDING',   label: 'Pending confirmation', desc: 'Your booking request is being reviewed by the provider.' },
  { key: 'ACCEPTED',  label: 'Accepted by provider',  desc: 'Your provider has accepted your booking request.' },
  { key: 'ONGOING',   label: 'Service in progress',   desc: 'The provider is currently working on your request.' },
  { key: 'COMPLETED', label: 'Service completed',     desc: 'The service has been completed successfully.' },
];

const statusMeta = {
  PENDING: { label: 'Pending', tone: 'pending' },
  ACCEPTED: { label: 'Accepted', tone: 'accepted' },
  ONGOING: { label: 'In Progress', tone: 'ongoing' },
  COMPLETED: { label: 'Completed', tone: 'completed' },
  CANCELLED: { label: 'Cancelled', tone: 'cancelled' },
};

export default function RealTimeTracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'user') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await bookingApi.getById(bookingId);
        if (res.success) {
          setBooking(res.data);
          setLastUpdated(new Date());
          setError('');
        }
        else setError(res.message || 'Unable to fetch booking.');
      } catch (err) {
        setError(err.response?.data?.message || 'Connection error fetching booking.');
      }
    };

    loadBooking();
    const interval = setInterval(loadBooking, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const currentStatus = booking?.status || 'PENDING';
  const isCancelled = currentStatus === 'CANCELLED';
  // currentIndex is always within the 4 normal steps; -1 when cancelled
  const currentIndex = statusDefinitions.findIndex((item) => item.key === currentStatus);
  const statusConfig = statusMeta[currentStatus] || statusMeta.PENDING;
  const progressPercent = useMemo(() => {
    if (isCancelled) return 0; // progress bar hidden for cancelled
    const idx = statusDefinitions.findIndex((s) => s.key === currentStatus);
    if (idx < 0) return 0;
    return Math.round((idx / (statusDefinitions.length - 1)) * 100);
  }, [currentStatus, isCancelled]);

  if (error) {
    return (
      <div className="tracking-root">
        <UserNavbar />
        <div className="tracking-shell">
          <div className="tracking-card">
            <h1>Live Tracking</h1>
            <p className="tracking-error">{error}</p>
            <div className="tracking-actions">
              <Link className="track-btn track-btn-primary" to="/service-history">Back to My Bookings</Link>
              <button className="track-btn track-btn-ghost" onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="tracking-root">
        <UserNavbar />
        <div className="tracking-shell">
          <div className="tracking-card">Connecting to tracker...</div>
        </div>
      </div>
    );
  }

  const displayService = booking.serviceId?.name || 'Service';
  const displayProvider = booking.providerId?.name || 'Provider';
  const displayDate = booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A';
  const displayTime = booking.time || 'N/A';
  const displayLocation = booking.location || 'N/A';
  const displayAmount = Number(booking.amount || 0).toFixed(2);

  return (
    <div className="tracking-root">
      <UserNavbar />
      <div className="tracking-shell">
        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <h1>Track Service In Real Time</h1>
              <p className="tracking-id">Booking #{booking._id.slice(-6).toUpperCase()}</p>
            </div>
            <span className={`tracking-status-badge tracking-status-${statusConfig.tone}`}>{statusConfig.label}</span>
          </div>

          {!isCancelled && (
            <div className="tracking-progress-wrap">
              <div className="tracking-progress-bar">
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <small>{progressPercent}% complete</small>
            </div>
          )}

          <div className="tracking-overview">
            <div className="overview-item"><span>Service</span><strong>{displayService}</strong></div>
            <div className="overview-item"><span>Provider</span><strong>{displayProvider}</strong></div>
            <div className="overview-item"><span>Date & Time</span><strong>{displayDate} • {displayTime}</strong></div>
            <div className="overview-item"><span>Location</span><strong>{displayLocation}</strong></div>
            <div className="overview-item"><span>Total</span><strong>Rs. {displayAmount}</strong></div>
            <div className="overview-item"><span>Last update</span><strong>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Syncing...'}</strong></div>
          </div>

          {isCancelled && (
            <div className="cancelled-banner">
              <span className="cancelled-icon">✕</span>
              <div>
                <strong>Booking Cancelled</strong>
                <p>This booking has been cancelled. Please contact support if you have questions.</p>
              </div>
            </div>
          )}

          <div className="stepper-list">
            {statusDefinitions.map((step, index) => {
              // When cancelled, show all 4 steps as neutral (no green/active)
              const completed = !isCancelled && index < currentIndex;
              const active    = !isCancelled && index === currentIndex;

              return (
                <div
                  key={step.key}
                  className={[
                    'stepper-item',
                    completed ? 'completed' : '',
                    active    ? 'active'    : '',
                    isCancelled ? 'step-neutral' : '',
                  ].join(' ').trim()}
                >
                  <div className="step-dot">{completed ? '✓' : index + 1}</div>
                  <div className="step-text">
                    <strong>{step.label}</strong>
                    <p>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="tracking-footer">
            <p>Auto-refresh every 5 seconds to keep your service status up to date.</p>
            <div className="tracking-actions">
              <Link className="track-btn track-btn-primary" to="/service-history">View My Bookings</Link>
              <Link className="track-btn track-btn-ghost" to={`/chat?bookingId=${booking._id}`}>Chat with Provider</Link>
              <button className="track-btn track-btn-ghost" onClick={() => navigate('/user-dashboard')}>Go to Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
