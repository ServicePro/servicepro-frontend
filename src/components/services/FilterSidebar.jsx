import { useState } from "react";

const FilterSidebar = ({ setFilters }) => {
  const [localFilters, setLocalFilters] = useState({});

  const handleApply = () => {
    setFilters(localFilters);
  };

  return (
    <div className="filter-sidebar">
      <h3>Filter Services</h3>

      {/* CATEGORY */}
      <label>Category</label>
      <select
        onChange={(e) =>
          setLocalFilters({ ...localFilters, category: e.target.value })
        }
      >
        <option value="">All</option>
        <option>Cleaning</option>
        <option>Plumbing</option>
        <option>Electrical</option>
      </select>

      {/* PRICE */}
      <label>Max Price</label>
      <input
        type="number"
        onChange={(e) =>
          setLocalFilters({ ...localFilters, maxPrice: e.target.value })
        }
      />

      {/* LOCATION */}
      <label>Location</label>
      <input
        type="text"
        placeholder="Enter location"
        onChange={(e) =>
          setLocalFilters({ ...localFilters, location: e.target.value })
        }
      />

      <button onClick={handleApply}>Apply Filters</button>
    </div>
  );
};

export default FilterSidebar;