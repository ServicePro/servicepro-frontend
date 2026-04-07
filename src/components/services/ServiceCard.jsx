import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../../utils/media";

const ServiceCard = ({ service }) => {
  const imageSrc = resolveAssetUrl(service.image || service.image_url);
  const category = service.category || "General";

  return (
    <div className="service-card">
      <img src={imageSrc} alt={service.name} />

      <div className="service-content">
        <span className="service-category-badge">{category}</span>
        <h3 className="service-title">{service.name}</h3>
        <p className="service-provider">{service.provider || service.providerId?.name || 'Trusted Expert'}</p>
        <p className="service-rating">⭐ {service.rating ?? service.averageRating ?? '4.7'}</p>
        <p className="price">${service.price}</p>

        <Link to={`/services/${service._id}`} className="service-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;