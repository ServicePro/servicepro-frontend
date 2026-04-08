import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import servicesApi from '../../api/servicesApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './BookingPage.css';

const timeSlots = ['09:00 AM - 10:00 AM', '10:30 AM - 11:30 AM', '01:00 PM - 02:00 PM', '02:30 PM - 03:30 PM'];

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ date: '', slot: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serviceId) return;
    const fetchService = async () => {
      try {
        const res = await servicesApi.getPublicById(serviceId);
        const fetchedService = res?.data?.service || res?.service || res?.data || null;
        if (res?.success && fetchedService?._id) {
          setService(fetchedService);
        } else {
          setError(res?.message || 'Service not found.');
        }
      } catch (e) {
        console.error(e);
        setError('Unable to load service details.');
      }
    };
    fetchService();
  }, [serviceId]);

  const totalAmount = useMemo(() => service?.price || 0, [service]);
  const priceText = Number(totalAmount).toFixed(2);
  const durationText = service?.duration_minutes ? `${service.duration_minutes} minutes` : 'Flexible duration';

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
        providerId: service.providerId?._id || service.providerId,
        date: form.date,
        time: form.slot,
        location: form.address,
        amount: totalAmount,
      };
      const res = await bookingApi.create(payload);
      if (res.success) {
        if (paymentMethod === 'cash') {
          const bookingId = res.data._id;
          const cashRes = await bookingApi.updatePayment(bookingId, {
            paymentState: 'UNPAID',
            paymentId: `cash_on_hand_${Date.now()}`,
          });

          if (cashRes.success) {
            navigate(`/booking-confirmation/${bookingId}`, {
              state: {
                paymentMethod: 'cash',
                loyaltyPointsEarned: cashRes.loyaltyPointsEarned || 0,
              },
            });
          } else {
            setError(cashRes.message || 'Unable to confirm cash booking.');
          }
          return;
        }

        navigate(`/payment/${res.data._id}`, {
          state: { paymentMethod: 'card' },
        });
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
        <UserNavbar />
        <div className="booking-card">
          <p className="booking-error">{error}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="booking-root">
        <UserNavbar />
        <div className="booking-card">Loading your booking page...</div>
      </div>
    );
  }

  return (
    <div className="booking-root">
      <UserNavbar />
      <div className="booking-card">
        <h1>Confirm Your Booking Details</h1>

        <section className="booking-section service-summary">
          <div className="service-header">Booking for {service.name}</div>
          <div className="service-subtitle">Service by {service.providerId?.name || 'Provider'}</div>
          <div className="service-row">
            <span>Service Type</span>
            <strong>{service.category}</strong>
          </div>
          <div className="service-row">
            <span>Price</span>
            <strong>Rs. {priceText}</strong>
          </div>
          <div className="service-row">
            <span>Duration</span>
            <strong>{durationText}</strong>
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

          <label>Payment Method</label>
          <div className="slots-grid">
            <button
              type="button"
              className={`slot-pill ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              Card Payment
            </button>
            <button
              type="button"
              className={`slot-pill ${paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              Cash on Hand
            </button>
          </div>

          <div className="booking-summary">
            <span>Total Cost</span>
            <strong>Rs. {priceText}</strong>
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