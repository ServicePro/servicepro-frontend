const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <img src={service.image} alt={service.name} />

      <div className="service-content">
        <h3>{service.name}</h3>
        <p>{service.provider}</p>
        <p>⭐ {service.rating}</p>
        <p className="price">${service.price}</p>

        <button>View Details</button>
      </div>
    </div>
  );
};

export default ServiceCard;