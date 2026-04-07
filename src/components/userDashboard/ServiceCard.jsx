import { resolveAssetUrl } from "../../utils/media";

const categoryIcons = {
  Plumbing: "🛠️",
  Electrical: "💡",
  Cleaning: "🧹",
  Gardening: "🌿",
  "Pet Care": "🐾",
  "Beauty & Wellness": "💆",
  Painting: "🎨",
  Moving: "📦",
  Tutoring: "📘"
};

const ServiceCard = ({ service }) => {
  const fallbackImage = `https://via.placeholder.com/520x320/FFE7D4/2B2D42?text=${encodeURIComponent(service.title || "Service")}`;
  const imageSrc = resolveAssetUrl(service.image || service.image_url) || fallbackImage;

  const categoryIcon = categoryIcons[service.category] || "🔧";

  return (
    <div className="service-card">
      <div className="service-image-wrap">
        <img src={imageSrc} alt={service.title} />
        <span className="service-category-icon" title={service.category || "Service"}>{categoryIcon}</span>
      </div>

      <div className="service-content">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-provider">{service.provider}</p>

        <div className="meta service-rating">
          ⭐ {service.rating || "4.8"}
        </div>

        <p className="price">${service.price || "0"}</p>

        <button className="service-details-button">View Details</button>
      </div>
    </div>
  );
};

export default ServiceCard;