import { Link } from "react-router-dom";
import {
    getServiceCategoryDisplayName,
    getServiceCategoryIcon,
} from "../../constants/serviceCategories";
import { resolveAssetUrl } from "../../utils/media";

const ServiceCard = ({ service }) => {
  const fallbackImage = `https://via.placeholder.com/520x320/FFE7D4/2B2D42?text=${encodeURIComponent(service.title || "Service")}`;
  const imageSrc = resolveAssetUrl(service.image || service.image_url) || fallbackImage;
  const serviceId = service._id || service.id;
  const ratingValue = Number(service.rating ?? service.averageRating);
  const ratingText = Number.isFinite(ratingValue) && ratingValue > 0
    ? `⭐ ${ratingValue.toFixed(1)}`
    : "No ratings yet";

  const categoryName = getServiceCategoryDisplayName(service.category);
  const categoryIcon = getServiceCategoryIcon(service.category);

  return (
    <div className="service-card">
      <div className="service-image-wrap">
        <img src={imageSrc} alt={service.title} />
        <span className="service-category-icon" title={categoryName}>{categoryIcon}</span>
      </div>

      <div className="service-content">
        <p className="service-category-text" title={categoryName}>{categoryName}</p>
        <h3 className="service-title">{service.title}</h3>
        <p className="service-provider" title={service.provider}>{service.provider}</p>

        <div className="meta service-rating">
          {ratingText}
        </div>

        <p className="price">Rs. {service.price || "0"}</p>

        {serviceId ? (
          <Link to={`/services/${serviceId}`} className="service-details-button">
            View Details
          </Link>
        ) : (
          <button className="service-details-button" type="button" disabled>
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;