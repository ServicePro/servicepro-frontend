import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import servicesApi from "../../api/servicesApi";
import "./ServiceListing.css";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    if (id) {
      loadService();
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
      <div className="service-details-root">
        <div className="service-details-card">Loading service details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-details-root">
        <div className="service-details-card">
          <p className="error-message">{error}</p>
          <button className="btn-primary" onClick={() => navigate("/services")}>Back to services</button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-details-root">
      <div className="service-details-card service-details-card-large">
        <div className="service-details-header">
          <div>
            <div className="service-breadcrumbs">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/services" className="breadcrumb-link">Services</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{service.name || service.title || "Service Details"}</span>
            </div>
            <span className="service-badge">{service.category || service.type || "Service"}</span>
            <h1>{service.name || service.title || "Service Details"}</h1>
            <p className="service-subtitle">
              Provided by <strong>{service.provider || service.providerName || service.provider_id?.name || "Trusted Expert"}</strong>
            </p>
          </div>

          <div className="service-actions">
            <Link to="/services" className="btn-outline">Back to services</Link>
            <button onClick={handleBookNow} className="btn-primary" disabled={loading || !service}>Book Now</button>
          </div>
        </div>

        <div className="service-details-grid">
          <div className="service-details-image">
            <img
              src={service.image || service.cover || "https://via.placeholder.com/680x420?text=Service+Image"}
              alt={service.name || service.title}
            />
          </div>

          <div className="service-details-summary">
            <div className="service-price-row">
              <div>
                <span className="service-price">${service.price?.toFixed?.(2) ?? service.price ?? "N/A"}</span>
                <span className="service-duration">{service.duration_minutes ? `${service.duration_minutes} min` : service.duration || "Flexible duration"}</span>
              </div>
              <span className="service-rating">⭐ {service.rating ?? service.averageRating ?? 4.8}</span>
            </div>

            <div className="service-summary-card">
              <div className="summary-row">
                <span>Provider</span>
                <strong>{service.provider || service.providerName || service.provider_id?.name || "Trusted Expert"}</strong>
              </div>
              <div className="summary-row">
                <span>Location</span>
                <strong>{service.location || service.area || "Not specified"}</strong>
              </div>
              <div className="summary-row">
                <span>Category</span>
                <strong>{service.category || service.type || "General"}</strong>
              </div>
              <div className="summary-row">
                <span>Booking</span>
                <strong>{service.bookingType || service.duration || "Online & in-person"}</strong>
              </div>
            </div>

            <section className="service-description">
              <h2>What this service includes</h2>
              <p>{service.description || service.summary || "No description available for this service."}</p>
            </section>

            <section className="service-meta">
              <div>
                <strong>Category</strong>
                <span>{service.category || service.type || "General"}</span>
              </div>
              <div>
                <strong>Provider location</strong>
                <span>{service.location || service.area || "Not specified"}</span>
              </div>
              <div>
                <strong>Available</strong>
                <span>{service.availability || "Check availability during booking"}</span>
              </div>
            </section>

            <section className="service-benefits">
              <h3>Why choose this service</h3>
              <ul>
                <li>{service.benefitOne || "Verified professionals"}</li>
                <li>{service.benefitTwo || "Secure payment"}</li>
                <li>{service.benefitThree || "Fast booking confirmation"}</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
