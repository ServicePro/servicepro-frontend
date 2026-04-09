const SortBar = ({ sort, setSort }) => {
  return (
    <div className="sort-bar">
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="" disabled>Sort By</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="popular">Most Popular</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
};

export default SortBar;