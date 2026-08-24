function CategorySection() {
  const categories = [
    {
      name: "T-SHIRTS",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    },
    {
      name: "SHIRTS",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    },
    {
      name: "WOMEN",
      image:
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600",
    },
  ];

  return (
    <section className="category-section">

      <div className="section-heading">
        <p>DISCOVER YOUR STYLE</p>

        <h2>
          Essentials by Category
        </h2>

        <span>
          Everything you need for your everyday wardrobe.
        </span>
      </div>

      <div className="category-grid">

        {categories.map((category) => (
          <div className="category-card" key={category.name}>

            <img
              src={category.image}
              alt={category.name}
            />

            <div className="category-overlay">
              <h3>{category.name}</h3>

              <button>
                SHOP NOW →
              </button>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default CategorySection;