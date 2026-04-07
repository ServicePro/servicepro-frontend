import { Search } from "lucide-react";

const SearchBar = ({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Search plumbing, cleaning...",
}) => {
  const handleClickSearch = () => {
    onSubmit?.(value);
  };

  return (
    <div className="search-input-wrap">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="search-input"
      />
      <button
        type="button"
        className="search-submit-btn"
        aria-label="Search services"
        onClick={handleClickSearch}
      >
        <Search size={16} />
      </button>
    </div>
  );
};

export default SearchBar;