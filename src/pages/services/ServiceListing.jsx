import { useEffect, useState } from "react";
import servicesApi from "../../api/servicesApi";import FilterSidebar from "../../components/services/FilterSidebar";
import ServiceCard from "../../components/services/ServiceCard";
import SortBar from "../../components/services/SortBar";
import Footer from "../../components/userDashboard/UserFooter";
import Navbar from "../../components/userDashboard/UserNavbar";

import "./ServiceListing.css";

const ServiceListing = () => {
  const [services, setServices] = useState([]);
  const [loading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");

  useEffect(() => {
  servicesApi.getAll({ ...filters, sort })
    .then(res => {
      // depends on backend structure
      setServices(res.data || res);
    })
    .catch(err => console.error(err));
}, [filters, sort]);

  return (
    <div className="service-page">
      <Navbar />

      <div className="main-container">
        <FilterSidebar setFilters={setFilters} />

        <div className="service-content">
          <SortBar setSort={setSort} />

          <div className="service-grid">
            {loading ? (
              <div className="loading">Loading services...</div>
            ) : Array.isArray(services) && services.length > 0 ? (
              services.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))
            ) : (
              <div className="no-services">No services found.</div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceListing;