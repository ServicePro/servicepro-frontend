import { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";

const FeaturedServices = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get("/api/services/featured")
      .then(res => {
        console.log(res.data);
        setServices(res.data.services || res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="featured">
      <h2>Featured Services</h2>

      <div className="grid">
        {Array.isArray(services) && services.length > 0 ? (
          services.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))
        ) : (
          <p>No featured services available</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;