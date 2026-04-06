import { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      const res = await axios.get(`/api/services?search=${query}`);
      console.log(res.data);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search plumbing, cleaning..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleSearch}
      className="search-input"
    />
  );
};

export default SearchBar;