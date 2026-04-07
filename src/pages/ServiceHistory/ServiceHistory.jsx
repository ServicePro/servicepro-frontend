import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import reviewsApi from '../../api/reviewsApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './ServiceHistory.css';

const TABS = ['All Bookings', 'Completed', 'Payment History', 'Favourite Providers'];

const STATUS_COLOR = {
  PENDING:   { bg: '#fef3c7', text: '#92400e' },
  ACCEPTED:  { bg: '#dbeafe', text: '#1e40af' },
  ONGOING:   { bg: '#ede9fe', text: '#5b21b6' },
  COMPLETED: { bg: '#d1fae5', text: '#065f46' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
};

const PAYMENT_COLOR = {
  PAID:   { bg: '#d1fae5', text: '#065f46' },
  UNPAID: { bg: '#fef3c7', text: '#92400e' },
  FAILED: { bg: '#fee2e2', text: '#991b1b' },
};

function getFavourites() {
  try { return JSON.parse(localStorage.getItem('sp_fav_providers') || '[]'); }
  catch { return []; }
}

function saveFavourites(favs) {
  localStorage.setItem('sp_fav_providers', JSON.stringify(favs));
}

function generateInvoiceHTML(booking) {
  const date = new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const invoiceNo = booking._id.slice(-8).toUpperCase();
  return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${invoiceNo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; padding: 48px; color: #1e293b; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .brand h1 { font-size: 2rem; color: #2563eb; font-weight: 800; }
    .brand p { color: #64748b; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 1.5rem; color: #0f172a; }
    .invoice-meta p { color: #64748b; margin-top: 4px; font-size: 0.9rem; }
    .divider { border: none; border-top: 2px solid #e2e8f0; margin: 24px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { background: #f1f5f9; padding: 12px 16px; text-align: left; font-size: 0.85rem; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    .total-row td { font-weight: 700; font-size: 1.05rem; color: #0f172a; border-top: 2px solid #e2e8f0; }
    .paid-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 0.85rem; margin-top: 16px; }
    .footer { margin-top: 48px; text-align: center; color: #94a3b8; font-size: 0.82rem; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand"><h1>ServicePro</h1><p>Professional Service Platform</p></div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>Invoice #: ${invoiceNo}</p>
      <p>Date: ${date}</p>
    </div>
  </div>
  <hr class="divider" />
  <table>
    <thead>
      <tr><th>Service</th><th>Provider</th><th>Date</th><th>Time</th><th>Location</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${booking.serviceId?.name || 'Service'}</td>
        <td>${booking.providerId?.name || 'Provider'}</td>
        <td>${date}</td>
        <td>${booking.time}</td>
        <td>${booking.location}</td>
        <td>$${Number(booking.amount).toFixed(2)}</td>
      </tr>
      <tr class="total-row"><td colspan="5">Total Paid</td><td>$${Number(booking.amount).toFixed(2)}</td></tr>
    </tbody>
  </table>
  <div><span class="paid-badge">✓ Payment Confirmed</span></div>
  <div class="footer">Thank you for choosing ServicePro · servicepro.com</div>
</body>
</html>`;
}

function downloadInvoice(booking) {
  const html = generateInvoiceHTML(booking);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${booking._id.slice(-8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function StarDisplay({ rating, size = '1.1rem' }) {
  return (
    <span style={{ fontSize: size, letterSpacing: '1px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#e2e8f0' }}>★</span>
      ))}
    </span>
  );
}

function BookingCard({ booking, isFav, onToggleFav, onRebook, existingReview }) {
  const provId = booking.providerId?._id;
  const provName = booking.providerId?.name || 'Provider';
  const sColor = STATUS_COLOR[booking.status] || STATUS_COLOR.PENDING;
  const pColor = PAYMENT_COLOR[booking.paymentState] || PAYMENT_COLOR.UNPAID;
  const isCompleted = ['ACCEPTED', 'ONGOING', 'COMPLETED'].includes(booking.status);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const handleStarClick = (star) => {
    setRating(star);
    setReviewError('');
  };

  const handleSubmitReview = async () => {
    if (rating === 0) { setReviewError('Please select a star rating.'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      await reviewsApi.create({
        providerId: booking.providerId?._id,
        serviceId: booking.serviceId?._id,
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit review. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sh-card">
      <div className="sh-card-top">
        <div className="sh-card-icon">🔧</div>
        <div className="sh-card-title-block">
          <h3 className="sh-card-service">{booking.serviceId?.name || 'Service'}</h3>
          <p className="sh-card-provider">{provName}</p>
        </div>
        <button
          className={`sh-fav-btn ${isFav ? 'active' : ''}`}
          title={isFav ? 'Remove from favourites' : 'Save as favourite'}
          onClick={() => onToggleFav(provId, provName)}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="sh-card-details">
        <div className="sh-detail"><span className="sh-detail-label">📅 Date</span><span>{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
        <div className="sh-detail"><span className="sh-detail-label">⏰ Time</span><span>{booking.time}</span></div>
        <div className="sh-detail"><span className="sh-detail-label">📍 Location</span><span>{booking.location}</span></div>
        <div className="sh-detail"><span className="sh-detail-label">💰 Amount</span><span className="sh-amount">${Number(booking.amount).toFixed(2)}</span></div>
        <div className="sh-detail">
          <span className="sh-detail-label">Status</span>
          <span className="sh-badge" style={{ background: sColor.bg, color: sColor.text }}>{booking.status}</span>
        </div>
        <div className="sh-detail">
          <span className="sh-detail-label">Payment</span>
          <span className="sh-badge" style={{ background: pColor.bg, color: pColor.text }}>{booking.paymentState}</span>
        </div>
      </div>

      {/* ── Review Section (COMPLETED only, toggled) ── */}
      {isCompleted && reviewOpen && (
        <div className="sh-inline-review">
          {existingReview ? (
            <div className="sh-review-existing">
              <p className="sh-review-prompt">Your review</p>
              <div className="sh-star-row">
                <StarDisplay rating={existingReview.rating} size="1.8rem" />
                <span className="sh-star-label">{RATING_LABELS[existingReview.rating]}</span>
              </div>
              {existingReview.comment && (
                <p className="sh-review-existing-comment">"{existingReview.comment}"</p>
              )}
            </div>
          ) : submitted ? (
            <div className="sh-review-thanks">
              <span className="sh-review-thanks-icon">🎉</span>
              <div>
                <strong>Thank you for your review!</strong>
                <p>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)} · {RATING_LABELS[rating]}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="sh-review-prompt">How was your experience?</p>
              <div className="sh-star-row" onMouseLeave={() => setHovered(0)}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`sh-star ${(hovered || rating) >= star ? 'lit' : ''}`}
                    onMouseEnter={() => setHovered(star)}
                    onClick={() => handleStarClick(star)}
                    type="button"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                {(hovered || rating) > 0 && (
                  <span className="sh-star-label">{RATING_LABELS[hovered || rating]}</span>
                )}
              </div>

              {rating > 0 && (
                <div className="sh-review-comment-row">
                  <textarea
                    className="sh-review-textarea"
                    rows={2}
                    placeholder="Add a comment (optional)…"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={500}
                  />
                  {reviewError && <p className="sh-review-error">{reviewError}</p>}
                  <button
                    className="sh-review-submit"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                </div>
              )}
              {reviewError && rating === 0 && (
                <p className="sh-review-error">{reviewError}</p>
              )}
            </>
          )}
        </div>
      )}

      <div className="sh-card-actions">
        <button className="sh-btn sh-btn-rebook" onClick={() => onRebook(booking.serviceId?._id)}>
          🔄 Rebook
        </button>
        {booking.paymentState === 'PAID' && (
          <button className="sh-btn sh-btn-invoice" onClick={() => downloadInvoice(booking)}>
            📄 Invoice
          </button>
        )}
        {isCompleted && !submitted && (
          <button
            className={`sh-btn sh-btn-review${reviewOpen ? ' sh-btn-review-open' : ''}`}
            onClick={() => setReviewOpen(v => !v)}
          >
            {existingReview ? '⭐ Review' : '✍️ Review'}
          </button>
        )}
        {isCompleted && submitted && (
          <span className="sh-review-done-badge">🎉 Reviewed</span>
        )}
      </div>
    </div>
  );
}

export default function ServiceHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'All Bookings');
  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState({});  // keyed by bookingId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favourites, setFavourites] = useState(getFavourites());

  useEffect(() => {
    (async () => {
      try {
        const [bookRes, revRes] = await Promise.allSettled([
          bookingApi.getMyBookings(),
          reviewsApi.getMyReviews(),
        ]);
        if (bookRes.status === 'fulfilled' && bookRes.value.success)
          setBookings(bookRes.value.data);
        else if (bookRes.status === 'rejected')
          setError(bookRes.reason?.response?.data?.message || 'Unable to load service history.');

        if (revRes.status === 'fulfilled' && revRes.value.success) {
          const map = {};
          (revRes.value.data || []).forEach(r => {
            const key = r.bookingId?._id?.toString() || r.bookingId?.toString();
            if (key) map[key] = r;
          });
          setMyReviews(map);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFav = (providerId, providerName) => {
    if (!providerId) return;
    const updated = [...getFavourites()];
    const idx = updated.findIndex(f => f.id === providerId);
    if (idx >= 0) updated.splice(idx, 1);
    else updated.push({ id: providerId, name: providerName });
    saveFavourites(updated);
    setFavourites([...updated]);
  };

  const isFav = (providerId) => favourites.some(f => f.id === providerId);

  const visibleBookings = () => {
    if (activeTab === 'Completed') return bookings.filter(b => b.status === 'COMPLETED');
    if (activeTab === 'Payment History') return bookings.filter(b => b.paymentState === 'PAID');
    return bookings;
  };

  const counts = {
    'All Bookings': bookings.length,
    'Completed': bookings.filter(b => b.status === 'COMPLETED').length,
    'Payment History': bookings.filter(b => b.paymentState === 'PAID').length,
    'Favourite Providers': favourites.length,
  };

  return (
    <>
      <UserNavbar />
      <div className="sh-root">
        {/* Page Header */}
        <div className="sh-page-header">
          <div>
            <h1>Service History</h1>
            <p>Track your bookings, payments, and favourite providers</p>
          </div>
          <div className="sh-stats-row">
            <div className="sh-stat"><span className="sh-stat-num">{bookings.length}</span><span>Total</span></div>
            <div className="sh-stat"><span className="sh-stat-num">{counts['Completed']}</span><span>Completed</span></div>
            <div className="sh-stat"><span className="sh-stat-num">{counts['Payment History']}</span><span>Paid</span></div>
            <div className="sh-stat"><span className="sh-stat-num">{favourites.length}</span><span>Favourites</span></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sh-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`sh-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {counts[tab] > 0 && <span className="sh-tab-badge">{counts[tab]}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="sh-content">
          {loading && (
            <div className="sh-state">
              <div className="sh-spinner" />
              <p>Loading your history…</p>
            </div>
          )}

          {error && !loading && (
            <div className="sh-state sh-error">
              <div className="sh-empty-icon">⚠️</div>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && activeTab !== 'Favourite Providers' && (
            visibleBookings().length === 0
              ? (
                <div className="sh-state sh-empty">
                  <div className="sh-empty-icon">📋</div>
                  <p>No {activeTab.toLowerCase()} found.</p>
                  {activeTab === 'All Bookings' && (
                    <button className="sh-btn sh-btn-rebook" style={{ marginTop: 16 }} onClick={() => navigate('/services')}>
                      Browse Services
                    </button>
                  )}
                </div>
              )
              : (
                <div className="sh-grid">
                  {visibleBookings().map(b => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      isFav={isFav(b.providerId?._id)}
                      onToggleFav={toggleFav}
                      onRebook={(sId) => navigate(`/book/${sId}`)}
                      existingReview={myReviews[b._id?.toString()] || null}
                    />
                  ))}
                </div>
              )
          )}

          {!loading && !error && activeTab === 'Favourite Providers' && (
            favourites.length === 0
              ? (
                <div className="sh-state sh-empty">
                  <div className="sh-empty-icon">💖</div>
                  <p>No favourite providers yet.</p>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: 8 }}>
                    Tap the 🤍 heart icon on any booking card to save a provider.
                  </p>
                </div>
              )
              : (
                <div className="sh-fav-grid">
                  {favourites.map(prov => (
                    <div key={prov.id} className="sh-fav-card">
                      <div className="sh-fav-avatar">{prov.name.charAt(0).toUpperCase()}</div>
                      <div className="sh-fav-info">
                        <h3>{prov.name}</h3>
                        <p>Service Provider</p>
                      </div>
                      <button
                        className="sh-fav-remove"
                        onClick={() => toggleFav(prov.id, prov.name)}
                      >
                        Remove ✕
                      </button>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
