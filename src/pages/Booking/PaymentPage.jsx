import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import './PaymentPage.css';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingApi.getById(bookingId);
        if (res.success) setBooking(res.data);
      } catch (err) {
        setError('Unable to load booking details.');
      }
    };
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'user') {
      navigate('/login');
    }
  }, [navigate]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      setError('Please fill all card details.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await bookingApi.updatePayment(bookingId, {
        paymentState: 'PAID',
        paymentId: `card_${Date.now()}`
      });

      if (res.success) {
        navigate(`/booking-confirmation/${bookingId}`, {
          state: { loyaltyPointsEarned: res.loyaltyPointsEarned || 0 }
        });
      } else {
        setError(res.message || 'Payment failed at gateway.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return <div className="payment-root"><div className="payment-card">Loading your payment details...</div></div>;
  }

  const serviceFee = Math.max(booking.amount * 0.1, 5);
  const total = booking.amount + serviceFee;

  return (
    <div className="payment-root">
      <div className="payment-card">
        <h1>Complete Your Payment</h1>

        <div className="payment-grid">
          <form className="payment-form" onSubmit={handlePay}>
            <label>Card Number</label>
            <input autoComplete="cc-number" type="text" maxLength={19} placeholder="XXXX XXXX XXXX XXXX" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />

            <label>Cardholder Name</label>
            <input autoComplete="cc-name" type="text" placeholder="John P. Doe" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />

            <div className="payment-row">
              <div>
                <label>Expiry</label>
                <input autoComplete="cc-exp" type="text" maxLength={5} placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
              </div>
              <div>
                <label>CVV</label>
                <input autoComplete="cc-csc" type="password" maxLength={4} placeholder="123" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
              </div>
            </div>

            {error && <div className="payment-error">{error}</div>}

            <button className="payment-btn" type="submit" disabled={loading}>
              {loading ? 'Processing…' : 'Pay Now'}
            </button>
          </form>

          <aside className="payment-summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Service</span><span>{booking.serviceId?.name || 'Service'}</span></div>
            <div className="summary-row"><span>Provider</span><span>{booking.providerId?.name || 'Provider'}</span></div>
            <div className="summary-row"><span>Date</span><span>{new Date(booking.date).toLocaleDateString()}</span></div>
            <div className="summary-row"><span>Time</span><span>{booking.time}</span></div>
            <div className="summary-row"><span>Subtotal</span><span>${booking.amount.toFixed(2)}</span></div>
            <div className="summary-row"><span>Service Fee</span><span>${serviceFee.toFixed(2)}</span></div>
            <div className="summary-total"><span>Total Due</span><span>${total.toFixed(2)}</span></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
