import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import servicesApi from "../../api/servicesApi";
import FilterSidebar from "../../components/services/FilterSidebar";
import ServiceCard from "../../components/services/ServiceCard";
import SortBar from "../../components/services/SortBar";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";
import Footer from "../../components/userDashboard/UserFooter";
import Navbar from "../../components/userDashboard/UserNavbar";

import "./ServiceListing.css";

const ServiceListing = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    // Read URL params synchronously so the first API call already has the category
    const params = new URLSearchParams(window.location.search);
    const initial = {};
    const category = params.get('category');
    const q = params.get('q');
    if (category) initial.category = category;
    if (q) initial.search = q;
    return initial;
  });
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    // Sync filters when the URL changes (e.g. browser back/forward)
    const category = searchParams.get('category');
    const q        = searchParams.get('q');
    const next = {};
    if (category) next.category = category;
    if (q)        next.search   = q;
    setFilters(prev => {
      // Only update if URL-driven params actually changed to avoid overriding sidebar filters
      const sameCategory = prev.category === (next.category ?? prev.category);
      const sameSearch   = prev.search   === (next.search   ?? prev.search);
      if (sameCategory && sameSearch) return prev;
      return { ...prev, ...next };
    });
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

  // Group services by category (preserving canonical order)
  const groupedByCategory = useMemo(() => {
    const map = {};
    for (const s of sortedServices) {
      const cat = s.category || 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    }
    // Follow canonical category order, put unknowns last
    const ordered = [];
    for (const { value, label, icon } of SERVICE_CATEGORIES) {
      if (map[value]?.length) ordered.push({ value, label, icon, services: map[value] });
    }
    // Append any categories not in canonical list
    for (const [cat, svcs] of Object.entries(map)) {
      if (!SERVICE_CATEGORIES.find(c => c.value === cat)) {
        ordered.push({ value: cat, label: cat, icon: '🔨', services: svcs });
      }
    }
    return ordered;
  }, [sortedServices]);

  const isCategoryFiltered = !!(filters?.category);

  return (
    <div className="service-page">
      <Navbar />

      <div className="main-container">
        <FilterSidebar setFilters={setFilters} />

        <div className="service-content">
          <SortBar sort={sort} setSort={setSort} />

          {loading ? (
            <div className="loading">Loading services...</div>
          ) : sortedServices.length === 0 ? (
            <div className="no-services">No services found.</div>
          ) : isCategoryFiltered ? (
            /* ── Flat grid (filtered) ── */
            <div className="service-grid">
              {sortedServices.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            /* ── Category-grouped view ── */
            <div className="sl-category-groups">
              {groupedByCategory.map(({ value, label, icon, services: catServices }) => (
                <div key={value} className="sl-category-section">
                  <div className="sl-category-heading">
                    <span className="sl-category-icon">{icon}</span>
                    <h2>{label}</h2>
                    <span className="sl-category-count">{catServices.length} service{catServices.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="service-grid">
                    {catServices.map(service => (
                      <ServiceCard key={service._id} service={service} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceListing;