import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./BestSellersPage.css";

import product1 from "../assets/product-8.png";
import product2 from "../assets/product-2.png";
import product3 from "../assets/product-1.png";
import product4 from "../assets/product-3.png";
import product5 from "../assets/product-4.png";
import product6 from "../assets/product-5.png";
import product7 from "../assets/product-6.png";
import product8 from "../assets/product-7.png";

function BestSellersPage() {
  const products = [
    {
      id: 8,
      name: "Vintage Graphic Tee",
      category: "BEST SELLER",
      price: 946,
      image: product1,
    },
    {
      id: 2,
      name: "Black Graphic Tee",
      category: "BEST SELLER",
      price: 946,
      image: product2,
    },
    {
      id: 1,
      name: "White Adrenaline Tee",
      category: "BEST SELLER",
      price: 946,
      image: product3,
    },
    {
      id: 3,
      name: "Oversized Graphic Tee",
      category: "BEST SELLER",
      price: 946,
      image: product4,
    },
    {
      id: 4,
      name: "White Printed Tee",
      category: "BEST SELLER",
      price: 946,
      image: product5,
    },
    {
      id: 5,
      name: "Classic Black Tee",
      category: "BEST SELLER",
      price: 946,
      image: product6,
    },
    {
      id: 6,
      name: "Essential White Tee",
      category: "BEST SELLER",
      price: 946,
      image: product7,
    },
    {
      id: 7,
      name: "Eagle Graphic Tee",
      category: "BEST SELLER",
      price: 946,
      image: product8,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="best-sellers-page">
        <section className="best-sellers-page-heading">
          <h1>Best Sellers</h1>

          <p className="best-sellers-page-description">
            Explore our most popular and trending collections.
          </p>
        </section>

        <section className="best-sellers-page-products">
          <div className="best-sellers-page-top">
            <h2>Best Sellers</h2>

            <p>{products.length} Products</p>
          </div>

          <div className="best-sellers-page-grid">
            {products.map((product) => (
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

export default BestSellersPage;