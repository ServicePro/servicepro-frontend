import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <img src={service.image} alt={service.name} />

      <div className="service-content">
        <h3>{service.name}</h3>
        <p>{service.provider || service.providerId?.name || 'Trusted Expert'}</p>
        <p>⭐ {service.rating ?? service.averageRating ?? '4.7'}</p>
        <p className="price">${service.price}</p>

        <Link to={`/services/${service._id}`} className="service-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;