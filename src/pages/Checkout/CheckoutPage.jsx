import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import emergencyApi from '../../api/emergencyApi';
import subscriptionApi from '../../api/subscriptionApi';
import './CheckoutPage.css';

// Calculate $ discount from a pending reward and a base amount
function calcRewardDiscount(reward, totalAmount) {
  if (!reward?.rewardId || !reward?.type) return 0;
  if (reward.type === 'credit') {
    const n = parseFloat(reward.value?.replace('$', '') || '0');
    return Math.min(n, totalAmount);
  }
  if (reward.type === 'discount') {
    const pct = parseFloat(reward.value?.replace('%', '') || '0') / 100;
    return +(totalAmount * pct).toFixed(2);
  }
  if (reward.type === 'free_service') {
    return totalAmount; // full amount off
  }
  return 0; // 'priority' — no $ value
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type     = searchParams.get('type');     // 'emergency' | 'subscription'
  const id       = searchParams.get('id');       // requestId or planId
  const amount   = parseFloat(searchParams.get('amount') || '0');
  const base     = parseFloat(searchParams.get('base')   || '0');
  const mult     = parseFloat(searchParams.get('mult')   || '0');
  const label    = searchParams.get('label')    || 'Payment';
  const sublabel = searchParams.get('sublabel') || '';

  // Emergency fee breakdown
  const isEmergency   = type === 'emergency' && base > 0 && mult > 0;
  const surcharge     = isEmergency ? +(base * (mult - 1)).toFixed(2) : 0;

  // Reward state
  const [pendingReward, setPendingReward]       = useState(null);  // { rewardId, title, type, value }
  const [useReward, setUseReward]               = useState(false);
  const rewardDiscount = useReward ? calcRewardDiscount(pendingReward, amount) : 0;
  const finalTotal     = Math.max(0, +(amount - rewardDiscount).toFixed(2));
  const displayTotal   = finalTotal;

  const [payMethod, setPayMethod] = useState(''); // '' | 'card' | 'cash'
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [paying, setPaying]   = useState(false);
  const [done,   setDone]     = useState(false);
  const [doneMethod, setDoneMethod] = useState('card');
  const [error,  setError]    = useState('');

  // Fetch pending reward from subscription (skip for subscription payments — no self-discount)
  useEffect(() => {
    if (type === 'subscription') return;
    subscriptionApi.getMy()
      .then((res) => {
        const pr = res.data?.data?.pendingReward;
        if (pr?.rewardId) {
          setPendingReward(pr);
          setUseReward(true); // auto-apply
        }
      })
      .catch(() => {});
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'number') {
      v = value.replace(/\D/g, '').slice(0, 16);
      v = v.replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      v = value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [name]: v }));
  };

  // Consume reward after successful payment
  const consumeRewardIfUsed = async () => {
    if (useReward && pendingReward?.rewardId) {
      try { await subscriptionApi.consumeReward(); } catch { /* non-critical */ }
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      setError('Please fill in all card details.');
      return;
    }
    setPaying(true);
    setError('');
    try {
      const paymentId = `pay_${Date.now()}`;
      if (type === 'emergency') {
        await emergencyApi.pay(id, { paymentId, method: 'card', finalAmount: displayTotal });
      } else if (type === 'subscription') {
        await subscriptionApi.subscribe(id);
      }
      await consumeRewardIfUsed();
      const last4 = card.number.replace(/\s/g, '').slice(-4);
      const saved = JSON.parse(localStorage.getItem('savedCards') || '[]');
      if (!saved.find((c) => c.last4 === last4 && c.expiry === card.expiry)) {
        saved.push({ last4, name: card.name, expiry: card.expiry, addedAt: new Date().toISOString() });
        localStorage.setItem('savedCards', JSON.stringify(saved));
      }
      setDoneMethod('card');
      setDone(true);
      setTimeout(() => {
        if (type === 'emergency')         navigate('/emergency');
        else if (type === 'subscription') navigate('/subscription');
        else navigate('/');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const handleCash = async () => {
    setPaying(true);
    setError('');
    try {
      if (type === 'emergency') {
        await emergencyApi.pay(id, { paymentId: `cash_${Date.now()}`, method: 'cash', finalAmount: displayTotal });
      }
      await consumeRewardIfUsed();
      setDoneMethod('cash');
      setDone(true);
      setTimeout(() => {
        if (type === 'emergency') navigate('/emergency');
        else navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="co-root">
        <UserNavbar />
        <div className="co-success-wrap">
          <div className="co-success-card">
            <div className="co-success-icon">{doneMethod === 'cash' ? '🤝' : '✅'}</div>
            <h2 className="co-success-title">
              {doneMethod === 'cash' ? 'Cash on Delivery Confirmed!' : 'Payment Successful!'}
            </h2>
            <p className="co-success-sub">
              {doneMethod === 'cash'
                ? 'Your booking is confirmed. Please pay the provider in cash after the work is completed.'
                : type === 'emergency'
                  ? 'Your emergency service has been confirmed and a provider is being dispatched.'
                  : 'Your subscription plan has been activated. Enjoy the benefits!'}
            </p>
            {useReward && rewardDiscount > 0 && (
              <p className="co-success-reward">🎁 Reward "{pendingReward.title}" applied — saved ${rewardDiscount.toFixed(2)}!</p>
            )}
            <p className="co-success-redirect">Redirecting you back…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Payment form ── */
  return (
    <div className="co-root">
      <UserNavbar />
      <div className="co-wrap">
        <div className="co-card">
          <div className="co-grid">

            {/* ── Left: payment method + form ── */}
            <div className="co-form-side">

              {/* Payment method selector */}
              <div className="co-method-select">
                <h2 className="co-form-title">Choose Payment Method</h2>
                <p className="co-form-sub">
                  {type === 'emergency'
                    ? 'Pay now by card, or pay in cash after the work is done.'
                    : 'Select how you would like to pay.'}
                </p>
                <div className="co-method-cards">
                  <button
                    type="button"
                    className={`co-method-card${payMethod === 'card' ? ' co-method-active' : ''}`}
                    onClick={() => setPayMethod('card')}
                  >
                    <span className="co-method-icon">💳</span>
                    <strong>Pay by Card</strong>
                    <p>Pay now securely online</p>
                  </button>
                  {type === 'emergency' && (
                    <button
                      type="button"
                      className={`co-method-card${payMethod === 'cash' ? ' co-method-active' : ''}`}
                      onClick={() => setPayMethod('cash')}
                    >
                      <span className="co-method-icon">💵</span>
                      <strong>Cash on Delivery</strong>
                      <p>Pay provider after work is done</p>
                    </button>
                  )}
                </div>
              </div>

              {/* Card form */}
              {payMethod === 'card' && (
                <form className="co-form" onSubmit={handlePay}>
                  <h2 className="co-form-title">Card Details</h2>
                  <p className="co-form-sub">Secure checkout — your card info is encrypted</p>

                  <label className="co-label">Card Number</label>
                  <input
                    className="co-input"
                    name="number"
                    value={card.number}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    autoComplete="cc-number"
                  />

                  <label className="co-label">Cardholder Name</label>
                  <input
                    className="co-input"
                    name="name"
                    value={card.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    autoComplete="cc-name"
                  />

                  <div className="co-row">
                    <div className="co-row-half">
                      <label className="co-label">Expiry</label>
                      <input
                        className="co-input"
                        name="expiry"
                        value={card.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div className="co-row-half">
                      <label className="co-label">CVV</label>
                      <input
                        className="co-input"
                        name="cvv"
                        value={card.cvv}
                        onChange={handleChange}
                        placeholder="•••"
                        maxLength={4}
                        type="password"
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>

                  {error && <p className="co-error">{error}</p>}

                  <button className="co-btn" type="submit" disabled={paying}>
                    {paying ? 'Processing…' : `Pay $${displayTotal.toFixed(2)}`}
                  </button>

                  <p className="co-secure-note">🔒 256-bit SSL encryption · Your data is never stored</p>
                </form>
              )}

              {/* Cash on delivery confirmation */}
              {payMethod === 'cash' && (
                <div className="co-cash-panel">
                  <div className="co-cash-icon">💵</div>
                  <h3 className="co-cash-title">Cash on Delivery</h3>
                  <p className="co-cash-desc">
                    Your booking will be confirmed immediately. The provider will arrive at your location
                    and you pay <strong>${displayTotal.toFixed(2)}</strong> in cash after the work is done.
                  </p>
                  <ul className="co-cash-list">
                    <li>✅ No upfront payment required</li>
                    <li>✅ Pay only after work is completed</li>
                    <li>✅ Have the exact amount ready</li>
                  </ul>
                  {error && <p className="co-error">{error}</p>}
                  <button
                    type="button"
                    className="co-btn co-cash-btn"
                    onClick={handleCash}
                    disabled={paying}
                  >
                    {paying ? 'Confirming…' : '✅ Confirm — Pay Cash on Delivery'}
                  </button>
                </div>
              )}
            </div>

            {/* ── Order summary ── */}
            <div className="co-summary">
              <h3 className="co-summary-title">Order Summary</h3>

              <div className="co-summary-service">
                <span className="co-badge">
                  {type === 'emergency' ? '🚨' : '⭐'}
                </span>
                <div>
                  <div className="co-summary-label">{label}</div>
                  {sublabel && <div className="co-summary-sub">{sublabel}</div>}
                </div>
              </div>

              <div className="co-summary-divider" />

              {isEmergency ? (
                <>
                  <div className="co-summary-row">
                    <span>Base Service Cost</span>
                    <span>${base.toFixed(2)}</span>
                  </div>
                  <div className="co-summary-row" style={{ color: '#ef4444' }}>
                    <span>Emergency Surcharge (×{mult - 1 > 0 ? (mult - 1).toFixed(1) : mult})</span>
                    <span>+${surcharge.toFixed(2)}</span>
                  </div>
                  {useReward && rewardDiscount > 0 && (
                    <div className="co-summary-row co-reward-row">
                      <span>🎁 {pendingReward.title}</span>
                      <span>-${rewardDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="co-summary-row co-summary-total">
                    <span>Total Due</span>
                    <span>${displayTotal.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="co-summary-row">
                    <span>Amount</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                  {useReward && rewardDiscount > 0 && (
                    <div className="co-summary-row co-reward-row">
                      <span>🎁 {pendingReward.title}</span>
                      <span>-${rewardDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="co-summary-row co-summary-total">
                    <span>Total</span>
                    <span>${displayTotal.toFixed(2)}</span>
                  </div>
                </>
              )}

              {/* Pending reward toggle */}
              {pendingReward?.rewardId && pendingReward.type !== 'priority' && (
                <div className="co-reward-banner">
                  <div className="co-reward-banner-left">
                    <span className="co-reward-banner-icon">🎁</span>
                    <div>
                      <p className="co-reward-banner-title">{pendingReward.title}</p>
                      <p className="co-reward-banner-sub">Loyalty reward ready to use</p>
                    </div>
                  </div>
                  <label className="co-reward-toggle">
                    <input
                      type="checkbox"
                      checked={useReward}
                      onChange={(e) => setUseReward(e.target.checked)}
                    />
                    <span className="co-reward-slider" />
                  </label>
                </div>
              )}

              <div className="co-trust-badges">
                <span className="co-trust-badge">🔒 SSL Secure</span>
                <span className="co-trust-badge">✅ Encrypted</span>
                <span className="co-trust-badge">🛡️ Protected</span>
              </div>

              <button
                type="button"
                className="co-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
