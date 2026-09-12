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

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  const [availability, setAvailability] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

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
        console.error("Product API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= WISHLIST =================

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = product._id || product.id;

    const isWishlisted = wishlist.some(
      (item) => (item._id || item.id) === productId
    );

    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(
        (item) => (item._id || item.id) !== productId
      );
    } else {
      updatedWishlist = [...wishlist, product];
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // ================= FILTER PRODUCTS =================

  let filteredProducts = [...products];

  // ================= SEARCH =================

  // ================= SEARCH =================

if (searchQuery) {
  filteredProducts = filteredProducts.filter((product) => {
    const productName = product.name?.toLowerCase() || "";
    const categoryName = product.category?.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    return (
      productName.includes(searchQuery) ||
      categoryName.includes(searchQuery) ||
      description.includes(searchQuery)
    );
  });
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

  if (priceOrder === "low-high") {
    filteredProducts.sort((a, b) => {
      const priceA =
        a.salePrice !== null &&
        a.salePrice !== undefined
          ? a.salePrice
          : a.regularPrice || a.price || 0;

      const priceB =
        b.salePrice !== null &&
        b.salePrice !== undefined
          ? b.salePrice
          : b.regularPrice || b.price || 0;

      return priceA - priceB;
    });
  } else if (priceOrder === "high-low") {
    filteredProducts.sort((a, b) => {
      const priceA =
        a.salePrice !== null &&
        a.salePrice !== undefined
          ? a.salePrice
          : a.regularPrice || a.price || 0;

      const priceB =
        b.salePrice !== null &&
        b.salePrice !== undefined
          ? b.salePrice
          : b.regularPrice || b.price || 0;

      return priceB - priceA;
    });
  } else if (sortBy === "newest") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );
  } else if (sortBy === "featured") {
    filteredProducts.sort(
      (a, b) =>
        new Date(a.createdAt || 0) -
        new Date(b.createdAt || 0)
    );
  }

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

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
    setPriceOrder("default");
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      <main className="shop-page">

        {/* ================= HEADING ================= */}

        <section className="shop-heading">
          <h1>SHOP</h1>

          {searchQuery && (
            <p className="search-result-text">
              Search results for:{" "}
              <strong>"{searchQuery}"</strong>
            </p>
          )}
        </section>

        {/* ================= FILTER BAR ================= */}

        <section className="shop-filter-bar">

          {/* LEFT SIDE */}

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

        {/* ================= LOADING ================= */}

        {loading && (
          <p className="no-products">
            Loading products...
          </p>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <p className="no-products">
            Error: {error}
          </p>
        )}

        {/* ================= PRODUCTS ================= */}

        {!loading && !error && (
          <section className="shop-products">

            {currentProducts.length > 0 ? (

              currentProducts.map((product) => {
                const productId =
                  product._id || product.id;

                const productPrice =
                  product.salePrice !== null &&
                  product.salePrice !== undefined
                    ? product.salePrice
                    : product.regularPrice ||
                      product.price ||
                      0;

                const productImage =
                  product.images?.[0] ||
                  product.image ||
                  "https://via.placeholder.com/300";

                const isWishlisted = wishlist.some(
                  (item) =>
                    (item._id || item.id) === productId
                );

                return (
                  <Link
                    to={`/product/${productId}`}
                    className="shop-product-card"
                    key={productId}
                  >
                    <div className="shop-product-image">

                      {/* WISHLIST BUTTON */}

                      <button
                        type="button"
                        className={`shop-wishlist-btn ${
                          isWishlisted
                            ? "active-wishlist"
                            : ""
                        }`}
                        onClick={(e) =>
                          handleWishlist(e, product)
                        }
                        aria-label="Add to wishlist"
                      >
                        {isWishlisted ? "♥" : "♡"}
                      </button>

                      {/* SOLD OUT */}

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
                          productPrice
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

        {/* ================= PAGINATION ================= */}

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