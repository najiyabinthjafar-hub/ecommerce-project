import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "./ProductCard";

import "./NewArrivals.css";

function NewArrivals() {
  const [activeFashion, setActiveFashion] =
    useState("MEN'S FASHION");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error(
          "New Arrivals API Error:",
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
    )
    .slice(0, 4);

  // ================= VIEW MORE =================

  const handleViewMore = () => {
    navigate("/new-arrivals", {
      state: {
        activeFashion: activeFashion,
      },
    });

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section
      className="new-arrivals"
      id="new-arrivals"
    >
      {/* ================= HEADING ================= */}

      <div className="new-arrivals-heading">
        <h2>New Arrivals</h2>

        <p className="new-arrivals-description">
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
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <p className="new-arrivals-message">
          Loading products...
        </p>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <p className="new-arrivals-message">
          Error: {error}
        </p>
      )}

      {/* ================= PRODUCTS ================= */}

      {!loading && !error && (
        <>
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))
            ) : (
              <p className="new-arrivals-message">
                No products found.
              </p>
            )}
          </div>

          {/* ================= VIEW MORE ================= */}

          <div className="view-more-wrapper">
            <button
              className="view-more-btn"
              onClick={handleViewMore}
            >
              View More
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default NewArrivals;