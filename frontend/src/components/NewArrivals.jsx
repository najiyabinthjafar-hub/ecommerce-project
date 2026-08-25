import ProductCard from "./ProductCard";

function NewArrivals() {
  const products = [
    {
      id: 1,
      name: "Classic Oversized T-Shirt",
      category: "T-SHIRTS",
      price: 1299,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    },
    {
      id: 2,
      name: "Relaxed Fit Shirt",
      category: "SHIRTS",
      price: 1899,
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    },
    {
      id: 3,
      name: "Everyday Denim",
      category: "DENIM",
      price: 2499,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    },
    {
      id: 4,
      name: "Essential Jacket",
      category: "JACKETS",
      price: 2999,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    },
  ];

  return (
    <section className="new-arrivals">
      <div className="new-arrivals-heading">
        <div>
          <p className="section-label">JUST DROPPED</p>

          <h2>New Arrivals</h2>
        </div>

        <button className="view-all-btn">
          VIEW ALL →
        </button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;