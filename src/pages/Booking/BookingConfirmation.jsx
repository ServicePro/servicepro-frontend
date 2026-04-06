import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import './BookingConfirmation.css';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

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
    return <div className="confirmation-root"><div className="confirmation-card"><p className="confirmation-error">{error}</p></div></div>;
  }

  if (!booking) {
    return <div className="confirmation-root"><div className="confirmation-card">Loading...</div></div>;
  }

  return (
    <div className="confirmation-root">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h1>Booking Confirmed Successfully!</h1>
        <p className="confirmation-subtitle">Your appointment is scheduled and we’ve sent a confirmation email to the registered address.</p>

        <div className="details-box">
          <div className="detail-row"><span>Service</span><strong>{booking.serviceId?.name || 'Service'}</strong></div>
          <div className="detail-row"><span>Provider</span><strong>{booking.providerId?.name || 'Provider'}</strong></div>
          <div className="detail-row"><span>Date</span><strong>{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
          <div className="detail-row"><span>Time</span><strong>{booking.time}</strong></div>
          <div className="detail-row"><span>Location</span><strong>{booking.location}</strong></div>
          <div className="detail-row"><span>Total Cost</span><strong>${booking.amount.toFixed(2)}</strong></div>
        </div>

        <div className="confirmation-actions">
          <Link className="btn-outline" to="/bookings">View My Bookings</Link>
          <Link className="btn-primary" to="/">Go to Home</Link>
        </div>

        <Link className="track-link" to={`/tracking/${bookingId}`}>Track Service Real-Time</Link>
      </div>
    </div>
  );
}