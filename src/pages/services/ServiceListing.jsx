import { useEffect, useMemo, useState } from "react";
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
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    // Initialize filters from URL parameters
    const category = searchParams.get('category');
    const q        = searchParams.get('q');
    const initialFilters = {};
    if (category) initialFilters.category = category;
    if (q)        initialFilters.search   = q;
    setFilters(initialFilters);
  }, [searchParams]);

  const requestParams = useMemo(() => {
    const cleaned = Object.entries(filters || {}).reduce((acc, [key, value]) => {
      const normalized = typeof value === 'string' ? value.trim() : value;
      if (normalized !== '' && normalized !== null && normalized !== undefined) {
        acc[key] = normalized;
      }
      return acc;
    }, {});

    return {
      ...cleaned,
      sort,
      page: 1,
      limit: 200,
    };
  }, [filters, sort]);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const res = await servicesApi.getAllPublic(requestParams);
        setServices(res.data?.services || res.services || res.data || res || []);
      } catch (err) {
        console.error(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [requestParams]);

  const locationFilteredServices = useMemo(() => {
    const list = Array.isArray(services) ? [...services] : [];
    const locationNeedle = String(filters?.location || '').trim().toLowerCase();
    if (!locationNeedle) return list;

    return list.filter((service) => {
      const rawLocation = service?.location;
      const serviceLocation = typeof rawLocation === 'string'
        ? rawLocation.toLowerCase()
        : [rawLocation?.city, rawLocation?.district].filter(Boolean).join(' ').toLowerCase();

      const providerLocation = String(
        service?.providerLocation || service?.providerId?.area || ''
      ).toLowerCase();

      return serviceLocation.includes(locationNeedle) || providerLocation.includes(locationNeedle);
    });
  }, [services, filters?.location]);

  const sortedServices = useMemo(() => {
    const list = [...locationFilteredServices];

    switch (sort) {
      case "price_low":
        return list.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
      case "price_high":
        return list.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
      case "newest":
        return list.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
      case "popular":
      default:
        return list.sort((a, b) => {
          const aPopularity = Number(a?.total_bookings ?? a?.rating ?? 0);
          const bPopularity = Number(b?.total_bookings ?? b?.rating ?? 0);
          return bPopularity - aPopularity;
        });
    }
  }, [locationFilteredServices, sort]);

  return (
    <div className="service-page">
      <Navbar />

      <div className="main-container">
        <FilterSidebar setFilters={setFilters} />

        <div className="service-content">
          <SortBar sort={sort} setSort={setSort} />

          <div className="service-grid">
            {loading ? (
              <div className="loading">Loading services...</div>
            ) : sortedServices.length > 0 ? (
              sortedServices.map(service => (
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