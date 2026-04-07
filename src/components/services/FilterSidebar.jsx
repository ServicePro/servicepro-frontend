import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = ({ setFilters }) => {
  const [searchParams] = useSearchParams();
  const [localFilters, setLocalFilters] = useState({});

  useEffect(() => {
    // Initialize local filters from URL parameters
    const category = searchParams.get('category');
    if (category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalFilters({ category });
    }
  }, [searchParams]);

  const handleApply = () => {
    setFilters(localFilters);
  };

  return (
    <div className="filter-sidebar">
      <h3>Filter Services</h3>

      {/* CATEGORY */}
      <label>Category</label>
      <select
        value={localFilters.category || ""}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, category: e.target.value })
        }
      >
        <option value="">All</option>
        <option>Cleaning</option>
        <option>Plumbing</option>
        <option>Electrical</option>
        <option>Gardening</option>
        <option>Pet Care</option>
        <option>Beauty & Wellness</option>
        <option>Painting</option>
        <option>Moving</option>
        <option>Tutoring</option>
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
    </div>
  );
};

export default FilterSidebar;