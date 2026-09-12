import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./NewArrivalsPage.css";

function NewArrivalsPage() {
  const location = useLocation();

  // ================= ACTIVE FASHION =================

  const [activeFashion, setActiveFashion] = useState(
    location.state?.activeFashion || "MEN'S FASHION"
  );

  const [products, setProducts] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/categories/tree"),
            fetch("http://localhost:5000/api/products?limit=100"),
          ]);

        const categoryData = await categoryResponse.json();
        const productData = await productResponse.json();

        if (!categoryResponse.ok) {
          throw new Error(
            categoryData.message || "Failed to fetch categories"
          );
        }

        if (!productResponse.ok) {
          throw new Error(
            productData.message || "Failed to fetch products"
          );
        }

        setCategoryTree(categoryData.categories || []);
        setProducts(productData.products || []);
      } catch (error) {
        console.error("New Arrivals Page API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= FIND SELECTED CATEGORY =================

  const selectedCategory = categoryTree.find((category) => {
    if (activeFashion === "MEN'S FASHION") {
      return category.slug === "men-s-fashion";
    }

    return category.slug === "womens-fashion";
  });

  // ================= GET ALL CHILD CATEGORY IDS =================

  const childCategoryIds = (
    selectedCategory?.children || []
  ).map((category) => String(category._id));

  // ================= FILTER PRODUCTS =================

  const filteredProducts = products
    .filter((product) => {
      // Active products മാത്രം

      if (product.status !== "active") {
        return false;
      }

      if (!product.category) {
        return false;
      }

      // Product category populated object അല്ലെങ്കിൽ ID

      const productCategoryId =
        product.category._id || product.category;

      // Selected Men's/Women's Fashion-ന്റെ
      // child categories-ലുള്ള products മാത്രം

      return childCategoryIds.includes(
        String(productCategoryId)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

  // ================= PAGE TOP =================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

            {/* CATEGORY NAME വേണ്ട — New Arrivals മാത്രം */}

            <h2>New Arrivals</h2>

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

          {/* ================= PRODUCTS GRID ================= */}

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