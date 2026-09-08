import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Shop.css";

import product1 from "../assets/product-1.png";
import product2 from "../assets/product-2.png";
import product3 from "../assets/product-3.png";
import product4 from "../assets/product-4.png";
import product5 from "../assets/product-5.png";
import product6 from "../assets/product-6.png";
import product7 from "../assets/product-7.png";
import product8 from "../assets/product-8.png";

const products = [
  {
    id: 1,
    name: "White Adrenaline Tee",
    price: 946,
    image: product1,
    available: true,
    featured: 1,
    newest: 5,
  },
  {
    id: 2,
    name: "Black Graphic Tee",
    price: 1099,
    image: product2,
    available: true,
    featured: 2,
    newest: 6,
  },
  {
    id: 3,
    name: "Oversized Graphic Tee",
    price: 1199,
    image: product3,
    available: true,
    featured: 3,
    newest: 7,
  },
  {
    id: 4,
    name: "White Printed Tee",
    price: 946,
    image: product4,
    available: false,
    featured: 4,
    newest: 8,
  },
  {
    id: 5,
    name: "Vintage Graphic Black T-Shirt",
    price: 1299,
    image: product5,
    available: true,
    featured: 5,
    newest: 1,
  },
  {
    id: 6,
    name: "Classic White Graphic T-Shirt",
    price: 1399,
    image: product6,
    available: true,
    featured: 6,
    newest: 2,
  },
  {
    id: 7,
    name: "Eagle Graphic White T-Shirt",
    price: 1499,
    image: product7,
    available: false,
    featured: 7,
    newest: 3,
  },
  {
    id: 8,
    name: "Wings Graphic White T-Shirt",
    price: 1599,
    image: product8,
    available: true,
    featured: 8,
    newest: 4,
  },
];

function Shop() {
  const [searchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("search")?.toLowerCase().trim() || "";

  const [availability, setAvailability] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

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
      (product) => product.available
    );
  }

  if (availability === "soldout") {
    filteredProducts = filteredProducts.filter(
      (product) => !product.available
    );
  }

  // ================= PRICE =================

  if (priceOrder === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (priceOrder === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // ================= SORT BY =================

  if (sortBy === "newest") {
    filteredProducts.sort((a, b) => b.newest - a.newest);
  }

  if (sortBy === "featured") {
    filteredProducts.sort(
      (a, b) => a.featured - b.featured
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

        {/* PRODUCTS */}

        <section className="shop-products">

          {currentProducts.length > 0 ? (

            currentProducts.map((product) => (

              <Link
                to={`/product/${product.id}`}
                className="shop-product-card"
                key={product.id}
              >

                <div className="shop-product-image">

                  {!product.available && (
                    <span className="sold-out">
                      SOLD OUT
                    </span>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>

                <div className="shop-product-info">

                  <h3>{product.name}</h3>

                  <p>
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </Link>

            ))

          ) : (

            <p className="no-products">
              No products found.
            </p>

          )}

        </section>

        {/* PAGINATION */}

        {totalPages > 1 && (

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