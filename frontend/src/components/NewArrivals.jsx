import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "./ProductCard";
import "./NewArrivals.css";

function NewArrivals() {
  const [activeFashion, setActiveFashion] = useState("MEN'S FASHION");

  const navigate = useNavigate();

  const products = [
    // ================= MEN'S FASHION =================

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
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-5.png",
    },
    {
      id: 6,
      name: "Essential White Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-6.png",
    },
    {
      id: 7,
      name: "Eagle Graphic Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-7.png",
    },
    {
      id: 8,
      name: "Vintage Graphic Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-8.png",
    },

    // ================= WOMEN'S FASHION =================

    {
      id: 9,
      name: "Women's White Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-1.png",
    },
    {
      id: 10,
      name: "Women's Black Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-2.png",
    },
    {
      id: 11,
      name: "Women's Oversized Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-3.png",
    },
    {
      id: 12,
      name: "Women's Printed Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-4.png",
    },
    {
      id: 13,
      name: "Women's Classic Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-5.png",
    },
    {
      id: 14,
      name: "Women's Essential Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-6.png",
    },
    {
      id: 15,
      name: "Women's Eagle Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-7.png",
    },
    {
      id: 16,
      name: "Women's Vintage Collection",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-8.png",
    },
  ];

  const filteredProducts = products.filter(
    (product) => product.category === activeFashion
  );

  const handleViewMore = () => {
    navigate("/new-arrivals");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 100);
  };

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
          <button
            className={`fashion-btn ${
              activeFashion === "MEN'S FASHION" ? "active" : ""
            }`}
            onClick={() => setActiveFashion("MEN'S FASHION")}
          >
            Men's Fashion
          </button>

          <button
            className={`fashion-btn ${
              activeFashion === "WOMEN'S FASHION" ? "active" : ""
            }`}
            onClick={() => setActiveFashion("WOMEN'S FASHION")}
          >
            Women's Fashion
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* View More */}
      <div className="view-more-wrapper">
        <button
          className="view-more-btn"
          onClick={handleViewMore}
        >
          View More
        </button>
      </div>
    </section>
  );
}

export default NewArrivals;