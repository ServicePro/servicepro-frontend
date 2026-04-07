import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import chatApi from '../../api/chatApi';
import bookingApi from '../../api/bookingApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './BookingConfirmation.css';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pointsEarned = location.state?.loyaltyPointsEarned || 0;
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleChatWithProvider = async () => {
    try {
      setChatLoading(true);
      const res = await chatApi.createThread({
        providerId: booking.providerId?._id,
        bookingId: booking._id,
        serviceName: booking.serviceId?.name || 'Service',
      });
      const threadId = res.data?._id || res._id;
      navigate(`/chat?threadId=${threadId}`);
    } catch (err) {
      console.error('Failed to open chat:', err);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await bookingApi.getById(bookingId);
        if (res.success) setBooking(res.data);
        else setError(res.message || 'Booking not found.');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load booking details.');
      }
    };
    loadBooking();
  }, [bookingId]);

  if (error) {
    return (
      <div className="confirmation-root">
        <UserNavbar />
        <div className="confirmation-card"><p className="confirmation-error">{error}</p></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="confirmation-root">
        <UserNavbar />
        <div className="confirmation-card confirmation-loading">Loading booking details...</div>
      </div>
    );
  }

  return (
    <div className="confirmation-root">
      <UserNavbar />
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your appointment is scheduled. A confirmation email has been sent to your registered address.
        </p>

        {pointsEarned > 0 && (
          <div className="confirmation-points-banner">
            <span className="confirmation-points-icon">⭐</span>
            <div>
              <strong>+{pointsEarned} Loyalty Points Earned!</strong>
              <p>Points have been added to your subscription rewards.</p>
            </div>
          </div>
        )}

        <div className="details-box">
          <div className="detail-row">
            <span className="detail-label">Service</span>
            <strong>{booking.serviceId?.name || 'Service'}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Provider</span>
            <strong>{booking.providerId?.name || 'Provider'}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <strong>{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time</span>
            <strong>{booking.time}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location</span>
            <strong>{booking.location}</strong>
          </div>
          <div className="detail-row detail-row--total">
            <span className="detail-label">Total Cost</span>
            <strong className="detail-amount">${booking.amount.toFixed(2)}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link className="btn-primary" to="/service-history">View My Bookings</Link>
          <button className="btn-chat" onClick={handleChatWithProvider} disabled={chatLoading}>
            {chatLoading ? 'Opening Chat...' : 'Chat with Provider'}
          </button>
          <Link className="btn-track" to={`/tracking/${bookingId}`}>Track Service Real-Time</Link>
          <Link className="btn-outline" to="/user-dashboard">Go to Home</Link>
        </div>
      </div>
    </div>
  );
}