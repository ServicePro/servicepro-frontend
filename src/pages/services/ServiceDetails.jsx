import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import reviewsApi from "../../api/reviewsApi";
import servicesApi from "../../api/servicesApi";
import Navbar from "../../components/userDashboard/UserNavbar";
import { getServiceCategoryIcon } from "../../constants/serviceCategories";
import { resolveAssetUrl } from "../../utils/media";
import "./ServiceListing.css";

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function StarRow({ rating, size = '1rem' }) {
  return (
    <span style={{ fontSize: size, letterSpacing: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#e2e8f0' }}>★</span>
      ))}
    </span>
  );
}

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsAvg, setReviewsAvg] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      try {
        const response = await servicesApi.getPublicById(id);
        const fetchedService = response?.data?.service || response?.service || response?.data || response;
        if (!fetchedService || !fetchedService._id) {
          throw new Error("Service not found.");
        }
        setService(fetchedService);
      } catch (err) {
        setError(err.message || "Unable to load service details.");
      } finally {
        setLoading(false);
      }
    };

    const loadReviews = async () => {
      try {
        const res = await reviewsApi.getServiceReviews(id);
        if (res.success) {
          setReviews(res.data || []);
          setReviewsAvg(res.averageRating);
        }
      } catch {
        // silently ignore — reviews are supplementary
      }
    };

    if (id) {
      loadService();
      loadReviews();
    } else {
      setError("Invalid service identifier.");
      setLoading(false);
    }
  }, [id]);

  const handleBookNow = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }
    
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role?.toLowerCase() !== 'user') {
        navigate('/login', { state: { from: `/services/${id}` } });
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    if (!service || !service._id) {
      setError('Service not loaded yet. Please try again.');
      return;
    }
    navigate(`/book/${service._id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="service-details-root">
          <div className="service-details-card">Loading service details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="service-details-root">
          <div className="service-details-card">
            <p className="error-message">{error}</p>
            <button className="btn-primary" onClick={() => navigate("/services")}>Back to services</button>
          </div>
        </div>
      </>
    );
  }

  const serviceName = service.name || service.title || "Service Details";
  const providerName =
    service.providerId?.name
    || service.provider_id?.name
    || service.provider
    || service.providerName
    || "Trusted Expert";
  const categoryName = service.category || service.type || "General";
  const priceValue = Number(service.price);
  const priceText = Number.isFinite(priceValue) ? priceValue.toFixed(2) : "N/A";
  const durationText = service.duration_minutes ? `${service.duration_minutes} min` : (service.duration || "Flexible duration");
  const locationText = typeof service.location === "string"
    ? service.location
    : [service.location?.city, service.location?.district].filter(Boolean).join(", ") || service.area || "Not specified";
  const availabilityText = Array.isArray(service.available_days) && service.available_days.length > 0
    ? service.available_days.join(", ")
    : (service.availability || "Check availability during booking");
  const bookingText = service.bookingType || durationText;
  const resolvedRating = reviewsAvg !== null ? reviewsAvg : Number(service.rating ?? service.averageRating);
  const resolvedRatingText = Number.isFinite(resolvedRating) && resolvedRating > 0 && reviews.length > 0
    ? `⭐ ${resolvedRating.toFixed(1)}`
    : reviews.length === 0 ? 'No reviews yet' : `⭐ ${resolvedRating.toFixed(1)}`;
  const imageSrc = resolveAssetUrl(service.image || service.image_url || service.cover);
  const hasServiceImage = !!imageSrc && !imgError;
  const detailCategoryIcon = getServiceCategoryIcon(service.category);

  return (
    <>
      <Navbar />
      <div className="service-details-root">
        <div className="service-details-card service-details-card-large">
        <div className="service-details-header">
          <div>
            <div className="service-breadcrumbs">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/services" className="breadcrumb-link">Services</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{serviceName}</span>
            </div>
            <span className="service-badge">{categoryName}</span>
            <h1>{serviceName}</h1>
            <p className="service-subtitle">
              Provided by <strong>{providerName}</strong>
            </p>
          </div>

          <div className="service-actions">
            <Link to="/services" className="btn-outline">Back to services</Link>
            <button onClick={handleBookNow} className="btn-primary" disabled={loading || !service}>Book Now</button>
          </div>
        </div>

        <div className="service-details-grid">
          <div className="service-details-image">
            {hasServiceImage ? (
              <img
                src={imageSrc}
                alt={serviceName}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="service-img-placeholder service-img-placeholder-lg">
                <span>{detailCategoryIcon}</span>
              </div>
            )}
          </div>

          <div className="service-details-summary">
            <div className="service-summary-row">
              {/* Left column: price box + quick facts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="service-price-row">
                  <div>
                    <span className="service-price">Rs. {priceText}</span>
                    <span className="service-duration">{durationText}</span>
                  </div>
                  <span className="service-rating">{resolvedRatingText}</span>
                </div>

                <div className="service-summary-card">
                  <div className="summary-row">
                    <span>Provider</span>
                    <strong>{providerName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Location</span>
                    <strong>{locationText}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Category</span>
                    <strong>{categoryName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Booking</span>
                    <strong>{bookingText}</strong>
                  </div>
                </div>

                <section className="service-benefits">
                  <h3>Why choose this service</h3>
                  <ul>
                    <li>{service.benefitOne || "Verified professionals"}</li>
                    <li>{service.benefitTwo || "Secure payment"}</li>
                    <li>{service.benefitThree || "Fast booking confirmation"}</li>
                  </ul>
                </section>
              </div>

              {/* Right column: description + meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <section className="service-description">
                  <h2>What this service includes</h2>
                  <p>{service.description || service.summary || "No description available for this service."}</p>
                </section>

                <section className="service-meta">
                  <div>
                    <strong>Category</strong>
                    <span>{categoryName}</span>
                  </div>
                  <div>
                    <strong>Provider location</strong>
                    <span>{locationText}</span>
                  </div>
                  <div>
                    <strong>Available</strong>
                    <span>{availabilityText}</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews ── */}
        <div className="sd-reviews-section">
          <div className="sd-reviews-header">
            <h2>Customer Reviews</h2>
            {reviews.length > 0 && (
              <div className="sd-reviews-summary">
                <span className="sd-reviews-avg">{reviewsAvg?.toFixed(1) ?? '—'}</span>
                <div>
                  <StarRow rating={reviewsAvg ?? 0} size="1.2rem" />
                  <p>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="sd-reviews-empty">No reviews yet. Be the first to review this service!</p>
          ) : (
            <div className="sd-reviews-list">
              {reviews.map(r => (
                <div key={r._id} className="sd-review-card">
                  <div className="sd-review-top">
                    <div className="sd-review-avatar">
                      {(r.clientId?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="sd-review-meta">
                      <span className="sd-review-name">{r.clientId?.name || 'Anonymous'}</span>
                      <span className="sd-review-date">{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      {!r.bookingId && (
                        <span className="sd-review-emergency-badge">🚨 Emergency service</span>
                      )}
                    </div>
                    <div className="sd-review-stars">
                      <StarRow rating={r.rating} size="1rem" />
                      <span className="sd-review-label">{RATING_LABELS[r.rating]}</span>
                    </div>
                  </div>
                  {r.comment && <p className="sd-review-comment">{r.comment}</p>}
                  {r.providerResponse && (
                    <div className="sd-review-response">
                      <span className="sd-review-response-label">Provider reply:</span>
                      <p>{r.providerResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
