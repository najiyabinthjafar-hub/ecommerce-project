import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "./ProductCard";

import "./NewArrivals.css";

function NewArrivals() {
  const [activeFashion, setActiveFashion] = useState("MEN'S FASHION");

  const [products, setProducts] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ================= FETCH CATEGORIES + PRODUCTS =================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] = await Promise.all([
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
        console.error("New Arrivals API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= FIND SELECTED PARENT CATEGORY =================

  const selectedCategory = categoryTree.find((category) => {
    const categoryName = category.name
      ?.toLowerCase()
      .replace(/[’']/g, "");

    if (activeFashion === "MEN'S FASHION") {
      return (
        categoryName === "mens fashion" ||
        category.slug === "mens-fashion" ||
        category.slug === "men-s-fashion"
      );
    }

    return (
      categoryName === "womens fashion" ||
      category.slug === "womens-fashion" ||
      category.slug === "women-s-fashion"
    );
  });

  // ================= FILTER PRODUCTS =================

  const filteredProducts = products
    .filter((product) => {
      // Only active products
      if (!product.category || product.status !== "active") {
        return false;
      }

      // Selected category ഇല്ലെങ്കിൽ
      if (!selectedCategory) {
        return false;
      }

      // Product category parent ID
      const parentId =
        product.category.parent?._id ||
        product.category.parent;

      return (
        String(parentId) === String(selectedCategory._id)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 4);

  // ================= VIEW MORE =================

  const handleViewMore = () => {
    navigate("/new-arrivals", {
      state: {
        activeFashion: activeFashion,
      },
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

          {filteredProducts.length > 0 && (
            <div className="view-more-wrapper">
              <button
                className="view-more-btn"
                onClick={handleViewMore}
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default NewArrivals;