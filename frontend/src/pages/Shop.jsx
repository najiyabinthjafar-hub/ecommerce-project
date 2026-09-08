import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Shop.css";

function Shop() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [availability, setAvailability] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

  const searchQuery =
    searchParams.get("search")?.toLowerCase().trim() || "";

  // ================= FETCH PRODUCTS =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

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
        console.error("Product fetch error:", error);
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
      product.name.toLowerCase().includes(searchQuery)
    );
  }

  // ================= AVAILABILITY =================

  if (availability === "available") {
    filteredProducts = filteredProducts.filter(
      (product) => product.stock > 0
    );
  }

  if (availability === "soldout") {
    filteredProducts = filteredProducts.filter(
      (product) => product.stock === 0
    );
  }

  // ================= PRICE =================

  const getPrice = (product) =>
    product.salePrice || product.regularPrice;

  if (priceOrder === "low-high") {
    filteredProducts.sort(
      (a, b) => getPrice(a) - getPrice(b)
    );
  }

  if (priceOrder === "high-low") {
    filteredProducts.sort(
      (a, b) => getPrice(b) - getPrice(a)
    );
  }

  // ================= SORT BY =================

  if (sortBy === "newest") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  if (sortBy === "featured") {
    // ഇപ്പോൾ backend-il featured field ഇല്ല
    // അതുകൊണ്ട് name അടിസ്ഥാനത്തിൽ default sorting
    filteredProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

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

        {error && (
          <p className="no-products">
            Error: {error}
          </p>
        )}

        {/* PRODUCTS */}

        {!loading && !error && (
          <section className="shop-products">

            {currentProducts.length > 0 ? (

              currentProducts.map((product) => {

                const price =
                  product.salePrice ||
                  product.regularPrice;

                const isAvailable =
                  product.stock > 0;

                const image =
                  product.images &&
                  product.images.length > 0
                    ? product.images[0]
                    : "";

                return (

                  <Link
                    to={`/product/${product._id}`}
                    className="shop-product-card"
                    key={product._id}
                  >

                    <div className="shop-product-image">

                      {!isAvailable && (
                        <span className="sold-out">
                          SOLD OUT
                        </span>
                      )}

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="no-image">
                          No Image
                        </div>
                      )}

                    </div>

                    <div className="shop-product-info">

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        ₹
                        {price.toLocaleString("en-IN")}
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
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => (

                <button
                  key={index}
                  className={
                    currentPage === index + 1
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
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={
                currentPage === totalPages
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