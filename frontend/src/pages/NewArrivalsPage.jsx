import { useEffect, useState } from "react";

import {
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./NewArrivalsPage.css";

function NewArrivalsPage() {
  const location = useLocation();

  // ================= ACTIVE CATEGORY =================

  const [activeFashion, setActiveFashion] = useState(
    location.state?.activeFashion ||
      "MEN'S FASHION"
  );

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ================= FETCH PRODUCTS =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await fetch(
          "http://localhost:5000/api/products?limit=100"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch products"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error(
          "New Arrivals Page API Error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= CATEGORY FILTER =================

  const filteredProducts = products
    .filter((product) => {
      if (!product.category) return false;

      if (typeof product.category === "object") {
        const categoryName =
          product.category.name
            ?.replace(/[’‘]/g, "'")
            .toUpperCase();

        const selectedCategory =
          activeFashion
            .replace(/[’‘]/g, "'")
            .toUpperCase();

        return categoryName === selectedCategory;
      }

      return false;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  return (
    <>
      <Navbar />

      <main className="new-arrivals-page">

        {/* ================= HEADING ================= */}

        <section className="new-arrivals-page-heading">
          <h1>New Arrivals</h1>

          <p className="new-arrivals-page-description">
            Step into the latest drops that define the season.
            <br />
            From bold basics to fresh fits — just landed.
          </p>

          {/* ================= FASHION BUTTONS ================= */}

          <div className="fashion-buttons">

            <button
              className={`fashion-btn ${
                activeFashion === "MEN'S FASHION"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFashion("MEN'S FASHION")
              }
            >
              Men's Fashion
            </button>

            <button
              className={`fashion-btn ${
                activeFashion === "WOMEN'S FASHION"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFashion("WOMEN'S FASHION")
              }
            >
              Women's Fashion
            </button>

          </div>
        </section>

        {/* ================= PRODUCTS ================= */}

        <section className="new-arrivals-page-products">

          <div className="new-arrivals-page-top">

            <h2>
              {activeFashion === "MEN'S FASHION"
                ? "Men's Fashion"
                : "Women's Fashion"}
            </h2>

            <p>
              {filteredProducts.length} Products
            </p>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <p className="new-arrivals-page-message">
              Loading products...
            </p>
          )}

          {/* ================= ERROR ================= */}

          {!loading && error && (
            <p className="new-arrivals-page-message">
              Error: {error}
            </p>
          )}

          {/* ================= PRODUCT GRID ================= */}

          {!loading && !error && (
            <>
              {filteredProducts.length > 0 ? (

                <div className="new-arrivals-page-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

              ) : (

                <p className="new-arrivals-page-message">
                  No products found.
                </p>

              )}
            </>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default NewArrivalsPage;