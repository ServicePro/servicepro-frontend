import { useNavigate } from "react-router-dom";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/services?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="categories">
      <h2>Explore Service Categories</h2>

      <div className="grid">
        {SERVICE_CATEGORIES.map((cat) => (
          <div className="card" key={cat.value} onClick={() => handleCategoryClick(cat.value)} style={{ cursor: 'pointer' }}>
            <div className="category-icon">{cat.icon}</div>
            <p>{cat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;