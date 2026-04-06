import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import servicesApi from '../../api/servicesApi';
import './BookingPage.css';

const timeSlots = ['09:00 AM - 10:00 AM', '10:30 AM - 11:30 AM', '01:00 PM - 02:00 PM', '02:30 PM - 03:30 PM'];

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ date: '', slot: '', address: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serviceId) return;
    const fetchService = async () => {
      try {
        const res = await servicesApi.getPublicById(serviceId);
        if (res.success && res.data && res.data.service) {
          setService(res.data.service);
        } else {
          setError(res.message || 'Service not found.');
        }
      } catch (e) {
        console.error(e);
        setError('Unable to load service details.');
      }
    };
    fetchService();
  }, [serviceId]);

  const totalAmount = useMemo(() => service?.price || 0, [service]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.date || !form.slot || !form.address) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!service) {
      setError('Service info not loaded yet.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        serviceId: service._id,
        providerId: service.providerId._id || service.providerId,
        date: form.date,
        time: form.slot,
        location: form.address,
        amount: totalAmount,
      };
      const res = await bookingApi.create(payload);
      if (res.success) {
        navigate(`/payment/${res.data._id}`);
      } else {
        setError(res.message || 'Booking could not be created.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !service) {
    return (
      <div className="booking-root">
        <div className="booking-card">
          <p className="booking-error">{error}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="booking-root">
        <div className="booking-card">Loading your booking page...</div>
      </div>
    );
  }

  return (
    <div className="booking-root">
      <div className="booking-card">
        <h1>Confirm Your Booking Details</h1>

        <section className="booking-section service-summary">
          <div className="service-header">Booking for {service.name}</div>
          <div className="service-subtitle">Service by {service.providerId?.name || service.providerId || 'Provider'}</div>
          <div className="service-row">
            <span>Service Type</span>
            <strong>{service.category}</strong>
          </div>
          <div className="service-row">
            <span>Price</span>
            <strong>${service.price.toFixed(2)}</strong>
          </div>
          <div className="service-row">
            <span>Duration</span>
            <strong>{service.duration_minutes} minutes</strong>
          </div>
        </section>

        <section className="booking-section schedule">
          <h2>Schedule Your Service</h2>

          <label>Preferred Date</label>
          <input
            type="date"
            value={form.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <label>Available Time Slots</label>
          <div className="slots-grid">
            {timeSlots.map((slot) => (
              <button
                type="button"
                key={slot}
                className={`slot-pill ${form.slot === slot ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, slot })}
              >
                {slot}
              </button>
            ))}
          </div>

          <label>Service Address</label>
          <input
            type="text"
            placeholder="123 Main Street, City, Country"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <label>Special Notes / Instructions</label>
          <textarea
            placeholder="e.g. Please use eco-friendly products, pay attention to the kitchen counter."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
          />

          <div className="booking-summary">
            <span>Total Cost</span>
            <strong>${totalAmount.toFixed(2)}</strong>
          </div>

          {error && <p className="booking-error">{error}</p>}

          <button className="booking-action" onClick={handleBook} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </section>
      </div>
    </div>
  );
}
