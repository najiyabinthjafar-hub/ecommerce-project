import ProductCard from "./ProductCard";
import "./NewArrivals.css";

function NewArrivals() {
  const products = [
    {
      id: 1,
      name: "White Adrenaline Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-1.png",
    },
    {
      id: 2,
      name: "Black Graphic Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-2.png",
    },
    {
      id: 3,
      name: "Oversized Graphic Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-3.png",
    },
    {
      id: 4,
      name: "White Printed Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-4.png",
    },
    {
      id: 5,
      name: "Classic Black Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-5.png",
    },
    {
      id: 6,
      name: "Essential White Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-6.png",
    },
    {
      id: 7,
      name: "Eagle Graphic Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-7.png",
    },
    {
      id: 8,
      name: "Vintage Graphic Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-8.png",
    },
  ];

  return (
    <section className="new-arrivals" id="new-arrivals">

      {/* Heading */}
      <div className="new-arrivals-heading">

        <h2>New Arrivals</h2>

        <p className="new-arrivals-description">
          Step into the latest drops that define the season.
          <br />
          From bold basics to fresh fits — just landed.
        </p>

        {/* Fashion Buttons */}
        <div className="fashion-buttons">

          <button className="fashion-btn active">
            Men's Fashion
          </button>

          <button className="fashion-btn">
            Women's Fashion
          </button>

        </div>

      </div>

      {/* Products */}
      <div className="products-grid">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

      {/* View More */}
      <div className="view-more-wrapper">

        <button className="view-more-btn">
          View More
        </button>

      </div>

    </section>
  );
}

export default NewArrivals;