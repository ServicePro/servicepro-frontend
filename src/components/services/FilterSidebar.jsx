import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SERVICE_CATEGORY_OPTIONS } from "../../constants/serviceCategories";

const FilterSidebar = ({ setFilters }) => {
  const [searchParams] = useSearchParams();
  const [localFilters, setLocalFilters] = useState(() => {
    // Read URL param synchronously on first render so no effect needed
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    return category ? { category } : {};
  });

  // Keep ServiceListing in sync when navigating back to page with category param
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters({ category });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleCategoryChange = (value) => {
    const next = { ...localFilters, category: value };
    setLocalFilters(next);
    setFilters(next);   // immediate apply
  };

  const applyQuickLocation = (location) => {
    const next = { ...localFilters, location };
    setLocalFilters(next);
    setFilters(next);
  };

  return (
    <div className="filter-sidebar">
      <h3>Filter Services</h3>

      {/* CATEGORY */}
      <label>Category</label>
      <select
        value={localFilters.category || ""}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">All</option>
        {SERVICE_CATEGORY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {/* PRICE */}
      <label>Max Price</label>
      <input
        type="number"
        value={localFilters.maxPrice || ""}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, maxPrice: e.target.value })
        }
      />

      {/* LOCATION */}
      <label>Location</label>
      <input
        type="text"
        placeholder="Enter location"
        value={localFilters.location || ""}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, location: e.target.value })
        }
      />

      <button onClick={handleApply}>Apply Filters</button>

      <div className="filter-fill-card">
        <h4>Quick Locations</h4>
        <div className="quick-location-chips">
          {['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Kurunegala'].map((city) => (
            <button
              key={city}
              type="button"
              className="location-chip"
              onClick={() => applyQuickLocation(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-fill-card filter-highlight-card">
        <h4>Why Book with ServicePro</h4>
        <ul>
          <li>Verified providers with ratings</li>
          <li>Transparent pricing before booking</li>
          <li>Real-time booking status tracking</li>
          <li>In-app support and chat assistance</li>
        </ul>
      </div>

      <div className="filter-fill-card">
        <h4>Need Help Choosing?</h4>
        <p>
          Use category + max price + location together to quickly narrow down to the most relevant services.
        </p>
      </div>
    </div>
  );
};

export default FilterSidebar;