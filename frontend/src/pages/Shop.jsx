import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Shop.css";

function Shop() {
  const [searchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("search")?.toLowerCase().trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [availability, setAvailability] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

  // ================= FETCH PRODUCTS =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Product API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= FILTER PRODUCTS =================

  let filteredProducts = [...products];

  // ================= SEARCH =================

  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery)
    );
  }

  // ================= AVAILABILITY =================

  if (availability === "available") {
    filteredProducts = filteredProducts.filter(
      (product) => product.stock > 0
    );
  } else if (availability === "soldout") {
    filteredProducts = filteredProducts.filter(
      (product) => product.stock === 0
    );
  }

  // ================= SORTING =================

  // Price sorting has priority when selected

  if (priceOrder === "low-high") {
    filteredProducts.sort((a, b) => {
      const priceA =
        a.salePrice !== null && a.salePrice !== undefined
          ? a.salePrice
          : a.regularPrice;

      const priceB =
        b.salePrice !== null && b.salePrice !== undefined
          ? b.salePrice
          : b.regularPrice;

      return priceA - priceB;
    });
  } else if (priceOrder === "high-low") {
    filteredProducts.sort((a, b) => {
      const priceA =
        a.salePrice !== null && a.salePrice !== undefined
          ? a.salePrice
          : a.regularPrice;

      const priceB =
        b.salePrice !== null && b.salePrice !== undefined
          ? b.salePrice
          : b.regularPrice;

      return priceB - priceA;
    });
  } else if (sortBy === "newest") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortBy === "featured") {
    // Currently using oldest products first as featured
    filteredProducts.sort(
      (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  // Prevent current page from exceeding total pages

  const safeCurrentPage =
    currentPage > totalPages && totalPages > 0
      ? totalPages
      : currentPage;

  const startIndex =
    (safeCurrentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // ================= HANDLERS =================

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceOrder(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);

    // Reset price sorting when using newest/featured
    setPriceOrder("default");

    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      <main className="shop-page">

        {/* HEADING */}

        <section className="shop-heading">
          <h1>SHOP</h1>

          {searchQuery && (
            <p className="search-result-text">
              Search results for:{" "}
              <strong>"{searchQuery}"</strong>
            </p>
          )}
        </section>

        {/* FILTER BAR */}

        <section className="shop-filter-bar">

          <div className="filter-left">

            <span className="filter-title">
              FILTER
            </span>

            {/* AVAILABILITY */}

            <select
              value={availability}
              onChange={(e) =>
                handleAvailabilityChange(e.target.value)
              }
            >
              <option value="all">
                AVAILABILITY
              </option>

              <option value="available">
                AVAILABLE
              </option>

              <option value="soldout">
                SOLD OUT
              </option>
            </select>

            {/* PRICE */}

            <select
              value={priceOrder}
              onChange={(e) =>
                handlePriceChange(e.target.value)
              }
            >
              <option value="default">
                PRICE
              </option>

              <option value="low-high">
                LOW TO HIGH
              </option>

              <option value="high-low">
                HIGH TO LOW
              </option>
            </select>

          </div>

          {/* RIGHT SIDE */}

          <div className="filter-right">

            <div className="sort-by">

              <span>SORT BY:</span>

              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value)
                }
              >
                <option value="newest">
                  NEWEST
                </option>

                <option value="featured">
                  FEATURED
                </option>

              </select>

            </div>

            <span className="product-count">
              {filteredProducts.length} PRODUCTS
            </span>

          </div>

        </section>

        {/* LOADING */}

        {loading && (
          <p className="no-products">
            Loading products...
          </p>
        )}

        {/* ERROR */}

        {!loading && error && (
          <p className="no-products">
            Error: {error}
          </p>
        )}

        {/* PRODUCTS */}

        {!loading && !error && (
          <section className="shop-products">

            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {

                const productPrice =
                  product.salePrice !== null &&
                  product.salePrice !== undefined
                    ? product.salePrice
                    : product.regularPrice;

                const productImage =
                  product.images?.[0] ||
                  "https://via.placeholder.com/300";

                return (
                  <Link
                    to={`/product/${product._id}`}
                    className="shop-product-card"
                    key={product._id}
                  >

                    <div className="shop-product-image">

                      {product.stock === 0 && (
                        <span className="sold-out">
                          SOLD OUT
                        </span>
                      )}

                      <img
                        src={productImage}
                        alt={product.name}
                      />

                    </div>

                    <div className="shop-product-info">

                      <h3>{product.name}</h3>

                      <p>
                        ₹
                        {Number(
                          productPrice || 0
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </Link>
                );
              })
            ) : (
              <p className="no-products">
                No products found.
              </p>
            )}

          </section>
        )}

        {/* PAGINATION */}

        {!loading &&
          !error &&
          totalPages > 1 && (

            <div className="shop-pagination">

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={safeCurrentPage === 1}
              >
                ←
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    className={
                      safeCurrentPage === index + 1
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  safeCurrentPage === totalPages
                }
              >
                →
              </button>

            </div>
          )}

      </main>

      <Footer />
    </>
  );
}

export default Shop;