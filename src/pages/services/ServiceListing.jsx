import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import servicesApi from "../../api/servicesApi";
import FilterSidebar from "../../components/services/FilterSidebar";
import ServiceCard from "../../components/services/ServiceCard";
import SortBar from "../../components/services/SortBar";
import Footer from "../../components/userDashboard/UserFooter";
import Navbar from "../../components/userDashboard/UserNavbar";

import "./ServiceListing.css";

const ServiceListing = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");

  useEffect(() => {
    // Initialize filters from URL parameters
    const category = searchParams.get('category');
    const q        = searchParams.get('q');
    const initialFilters = {};
    if (category) initialFilters.category = category;
    if (q)        initialFilters.search   = q;
    setFilters(initialFilters);
  }, [searchParams]);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const res = await servicesApi.getAllPublic({ ...filters, sort });
        setServices(res.data?.services || res.services || res.data || res || []);
      } catch (err) {
        console.error(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
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