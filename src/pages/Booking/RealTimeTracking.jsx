import { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import './RealTimeTracking.css';

const statusDefinitions = [
  { key: 'PENDING', label: 'Pending confirmation', desc: 'Your booking request is being reviewed.' },
  { key: 'ACCEPTED', label: 'Accepted by provider', desc: 'Cleaner has approved your booking.' },
  { key: 'ONGOING', label: 'Service in progress', desc: 'Provider is currently working on your request.' },
  { key: 'COMPLETED', label: 'Service completed', desc: 'Your service has been finished successfully.' }
];

export default function RealTimeTracking() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await bookingApi.getById(bookingId);
        if (res.success) setBooking(res.data);
        else setError(res.message || 'Unable to fetch booking.');
      } catch (err) {
        setError(err.response?.data?.message || 'Connection error fetching booking.');
      }
    };

    loadBooking();
    const interval = setInterval(loadBooking, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (error) {
    return <div className="tracking-root"><div className="tracking-card"><p className="tracking-error">{error}</p></div></div>;
  }

  if (!booking) {
    return <div className="tracking-root"><div className="tracking-card">Connecting to tracker...</div></div>;
  }

  const currentIndex = statusDefinitions.findIndex((item) => item.key === booking.status);

  return (
    <div className="tracking-root">
      <div className="tracking-card">
        <h1>Booking Tracking</h1>
        <p className="tracking-id">Order #{booking._id.slice(-6).toUpperCase()}</p>

        <div className="stepper-list">
          {statusDefinitions.map((step, index) => {
            const completed = index < currentIndex;
            const active = index === currentIndex;
            return (
              <div key={step.key} className={`stepper-item ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}>
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
          <p>Current status: <strong>{booking.status}</strong></p>
          <small>Last updated: {new Date(booking.updatedAt).toLocaleString()}</small>
        </div>
      </div>
    </div>
  );
}