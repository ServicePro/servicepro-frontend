import { useState } from "react";
import { Link } from "react-router-dom";
import { getServiceCategoryIcon } from "../../constants/serviceCategories";
import { resolveAssetUrl } from "../../utils/media";

const ServiceCard = ({ service }) => {
  const [imgError, setImgError] = useState(false);
  const rawImg = service.image || service.image_url || service.cover;
  const imageSrc = resolveAssetUrl(rawImg);
  const hasImage = !!imageSrc && !imgError;
  const category = service.category || "General";
  const categoryIcon = getServiceCategoryIcon(category);
  const providerName = service.provider || service.providerId?.name || service.provider_id?.name || 'Trusted Expert';
  const serviceName = service.name || service.title || 'Service';
  const serviceId = service._id || service.id;
  const priceValue = Number(service.price);
  const priceText = Number.isFinite(priceValue) ? priceValue.toFixed(2) : 'N/A';
  const ratingValue = Number(service.rating ?? service.averageRating);
  const reviewsCount = Number(service.reviews_count ?? service.reviewsCount ?? 0);
  const ratingText = reviewsCount > 0 && Number.isFinite(ratingValue) && ratingValue > 0
    ? `⭐ ${ratingValue.toFixed(1)}`
    : 'No ratings yet';
  const rawLocation = service.location;
  const locationText = service.providerLocation
    || service.providerId?.area
    || (typeof rawLocation === 'string'
    ? rawLocation
    : [rawLocation?.city, rawLocation?.district].filter(Boolean).join(', '));

  return (
    <div className="service-card">
      {hasImage ? (
        <img src={imageSrc} alt={serviceName} onError={() => setImgError(true)} />
      ) : (
        <div className="service-img-placeholder">
          <span>{categoryIcon}</span>
        </div>
      )}

      <div className="service-content">
        <span className="service-category-badge">{category}</span>
        <h3 className="service-title">{serviceName}</h3>
        <p className="service-provider">{providerName}</p>
        <p className="service-location">📍 Provider location: {locationText || 'Location not specified'}</p>
        <p className="service-rating">{ratingText}</p>
        <p className="price">Rs. {priceText}</p>

        <Link to={`/services/${serviceId}`} className="service-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;