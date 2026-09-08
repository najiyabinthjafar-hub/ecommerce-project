import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./NewArrivalsPage.css";

function NewArrivalsPage() {
  const [activeFashion, setActiveFashion] = useState("MEN'S FASHION");

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

  // നിലവിൽ select ചെയ്ത category മാത്രം കാണിക്കാൻ
  const filteredProducts = products.filter(
    (product) => product.category === activeFashion
  );

  return (
    <>
      <Navbar />

      <main className="new-arrivals-page">
        {/* Heading */}
        <section className="new-arrivals-page-heading">
          
          <h1>New Arrivals</h1>

          <p className="new-arrivals-page-description">
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
        </section>

        {/* Products */}
        <section className="new-arrivals-page-products">
          <div className="new-arrivals-page-top">
            <h2>
              {activeFashion === "MEN'S FASHION"
                ? "Men's Fashion"
                : "Women's Fashion"}
            </h2>

            <p>{filteredProducts.length} Products</p>
          </div>

          <div className="new-arrivals-page-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default NewArrivalsPage;