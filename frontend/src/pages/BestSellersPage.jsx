import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./BestSellersPage.css";

const API_URL = "http://localhost:5000/api/products/best-sellers";

function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);

        console.log("BEST SELLERS RESPONSE:", response.data);

        setProducts(response.data.products || []);
      } catch (error) {
        console.error(
          "BEST SELLERS ERROR:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load best sellers."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

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

          {loading && (
            <div className="best-sellers-loading">
              Loading best sellers...
            </div>
          )}

          {error && (
            <div className="best-sellers-error">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="best-sellers-empty">
              No best selling products available yet.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="best-sellers-page-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default BestSellersPage;