const categories = [
  { name: "Plumbing", icon: "🛠️" },
  { name: "Electrical", icon: "💡" },
  { name: "Cleaning", icon: "🧹" },
  { name: "Gardening", icon: "🌿" },
  { name: "Pet Care", icon: "🐾" },
  { name: "Painting", icon: "🎨" },
  { name: "Moving", icon: "📦" },
  { name: "Tutoring", icon: "📘" }
];

const Categories = () => {
  return (
    <section className="categories">
      <h2>Explore Service Categories</h2>

      <div className="grid">
        {categories.map((cat, i) => (
          <div className="card" key={i}>
            <div className="category-icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;