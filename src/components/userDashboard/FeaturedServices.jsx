import { useEffect, useState } from "react";
import servicesApi from "../../api/servicesApi";
import ServiceCard from "./ServiceCard";

const FeaturedServices = ({ searchQuery = "", onSearchResult }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const FEATURED_LIMIT = 8;

  const normalizeService = (service) => {
    const image = service?.image || service?.image_url;
    const providerName =
      service?.provider ||
      service?.provider_name ||
      service?.providerId?.name ||
      "ServicePro Provider";

    return {
      ...service,
      _id: service?._id || service?.id,
      title: service?.title || service?.name || "Untitled Service",
      provider: providerName,
      image,
    };
  };

  const pickRandomServices = (inputServices, limit = FEATURED_LIMIT) => {
    if (!Array.isArray(inputServices) || inputServices.length === 0) return [];
    const shuffled = [...inputServices];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, limit);
  };

  useEffect(() => {
    const loadFeaturedServices = async () => {
      setLoading(true);
      const trimmedQuery = searchQuery.trim();
      try {
        const params = { limit: 24, sort: "popular" };
        if (trimmedQuery) {
          params.search = trimmedQuery;
        }

        const res = await servicesApi.getAllPublic(params);
        const allServices = res?.data?.services || res?.services || res?.data || res || [];
        const normalized = Array.isArray(allServices) ? allServices.map(normalizeService) : [];
        const selected = pickRandomServices(normalized, FEATURED_LIMIT);

        setServices(selected);
        onSearchResult?.({
          searched: Boolean(trimmedQuery),
          query: trimmedQuery,
          noResults: Boolean(trimmedQuery) && selected.length === 0,
          error: false,
        });
      } catch (err) {
        console.error("Failed to load featured services", err);
        setServices([]);
        onSearchResult?.({
          searched: Boolean(trimmedQuery),
          query: trimmedQuery,
          noResults: false,
          error: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedServices();
    const intervalId = setInterval(loadFeaturedServices, 15000);
    return () => clearInterval(intervalId);
  }, [searchQuery, onSearchResult]);

  return (
    <section className="featured">
      <div className="grid">
        {loading ? (
          <p>Loading featured services...</p>
        ) : Array.isArray(services) && services.length > 0 ? (
          services.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))
        ) : (
          <p>No services available</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;