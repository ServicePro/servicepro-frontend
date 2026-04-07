const SortBar = ({ setSort }) => {
  return (
    <div className="sort-bar">
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="rating">Popularity</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
};

export default SortBar;