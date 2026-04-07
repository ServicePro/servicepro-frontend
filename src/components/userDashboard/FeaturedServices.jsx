import { useEffect, useState } from "react";
import servicesApi from "../../api/servicesApi";
import ServiceCard from "./ServiceCard";

const FeaturedServices = ({ searchQuery = "", onSearchResult }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const FEATURED_LIMIT = 6;

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

  const pickDiverseServices = (inputServices, limit = FEATURED_LIMIT) => {
    if (!Array.isArray(inputServices) || inputServices.length === 0) return [];

    const buckets = new Map();

    inputServices.forEach((service) => {
      const category = service?.category || "Other";
      if (!buckets.has(category)) {
        buckets.set(category, []);
      }
      buckets.get(category).push(service);
    });

    const picked = [];

    // Round-robin across categories to maximize visible variety.
    while (picked.length < limit) {
      let addedInRound = false;

      for (const servicesInCategory of buckets.values()) {
        if (servicesInCategory.length > 0 && picked.length < limit) {
          picked.push(servicesInCategory.shift());
          addedInRound = true;
        }
      }

      if (!addedInRound) break;
    }

    return picked;
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
        const selected = trimmedQuery
          ? normalized.slice(0, FEATURED_LIMIT)
          : pickDiverseServices(normalized, FEATURED_LIMIT);

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
  }, [searchQuery, onSearchResult]);

  return (
    <section className="featured">
      <h2>Featured Services</h2>

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