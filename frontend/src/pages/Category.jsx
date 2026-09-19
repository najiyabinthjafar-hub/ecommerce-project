import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import axios from "axios";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./Category.css";

const API_URL = "http://localhost:5000/api";

function Category() {
  const { slug, subcategorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FILTERS =================

  const [availability, setAvailability] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [sortBy, setSortBy] = useState("newest");

  // ================= PAGINATION =================

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // ================= FETCH CATEGORY + PRODUCTS =================

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError("");

        // ================= FETCH CATEGORY TREE =================

        const categoryResponse = await axios.get(
          `${API_URL}/categories/tree`
        );

        const allCategories =
          categoryResponse.data.categories || [];

        const foundCategory = allCategories.find(
          (category) => category.slug === slug
        );

        if (!foundCategory) {
          throw new Error("Category not found");
        }

        setCurrentCategory(foundCategory);

        const childCategories =
          foundCategory.children || [];

        setCategories(childCategories);

        // ================= FETCH PRODUCTS =================

        const productResponse = await axios.get(
          `${API_URL}/products?limit=100`
        );

        const allProducts =
          productResponse.data.products || [];

        let allowedCategoryIds = [];

        // ================= SUBCATEGORY PAGE =================

        if (subcategorySlug) {
          const selectedSubcategory =
            childCategories.find(
              (category) =>
                category.slug === subcategorySlug
            );

          if (!selectedSubcategory) {
            throw new Error("Subcategory not found");
          }

          allowedCategoryIds = [
            String(selectedSubcategory._id),
          ];
        }

        // ================= MAIN CATEGORY PAGE =================

        else {
          allowedCategoryIds =
            childCategories.map((category) =>
              String(category._id)
            );
        }

        // ================= CATEGORY PRODUCTS =================

        const categoryProducts =
          allProducts.filter((product) => {
            if (product.status !== "active") {
              return false;
            }

            if (!product.category) {
              return false;
            }

            const productCategoryId =
              typeof product.category === "object"
                ? product.category._id
                : product.category;

            return allowedCategoryIds.includes(
              String(productCategoryId)
            );
          });

        setProducts(categoryProducts);
        setCurrentPage(1);
      } catch (error) {
        console.error("CATEGORY ERROR:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load category"
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, subcategorySlug]);

  // ================= FILTER PRODUCTS =================

  let filteredProducts = [...products];

  // ================= AVAILABILITY =================

  if (availability === "available") {
    filteredProducts = filteredProducts.filter(
      (product) => Number(product.stock) > 0
    );
  } else if (availability === "soldout") {
    filteredProducts = filteredProducts.filter(
      (product) => Number(product.stock) === 0
    );
  }

  // ================= PRICE SORT =================

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
  }

  // ================= SORT BY =================

  else if (sortBy === "newest") {
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

  // ================= FILTER HANDLERS =================

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

  // ================= PAGINATION HANDLER =================

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="category-page">
          <p className="category-loading">
            Loading category...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="category-page">
          <p className="category-loading">
            {error}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ================= SELECTED SUBCATEGORY =================

  const selectedSubcategory = categories.find(
    (category) =>
      category.slug === subcategorySlug
  );

  // ================= PAGE TITLE =================

  const pageTitle = selectedSubcategory
    ? `All Products in ${selectedSubcategory.name}`
    : currentCategory?.name;

  // ================= PAGE DESCRIPTION =================

  const pageDescription = selectedSubcategory
    ? `Explore all products in ${selectedSubcategory.name}.`
    : `Explore our ${currentCategory?.name} collection.`;

  // ================= RETURN =================

  return (
    <>
      <Navbar />

      <main className="category-page">

        {/* ================= HEADING ================= */}

        <section className="category-page-heading">
          <h1>{pageTitle}</h1>

          <p className="category-page-description">
            {pageDescription}
          </p>
        </section>

        {/* ================= SUBCATEGORIES ================= */}

        {categories.length > 0 && (
          <section className="subcategory-section">
            <div className="subcategory-list">

              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${slug}/${category.slug}`}
                  className={`subcategory-item ${
                    subcategorySlug === category.slug
                      ? "active"
                      : ""
                  }`}
                >
                  {category.name}
                </Link>
              ))}

            </div>
          </section>
        )}

        {/* ================= FILTER BAR ================= */}

        <section className="category-filter-bar">

          <div className="category-filter-left">

            <span className="category-filter-title">
              FILTER
            </span>

            <select
              value={availability}
              onChange={(e) =>
                handleAvailabilityChange(
                  e.target.value
                )
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

            <select
              value={priceOrder}
              onChange={(e) =>
                handlePriceChange(
                  e.target.value
                )
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

          <div className="category-filter-right">

            <div className="category-sort-by">

              <span>SORT BY:</span>

              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value
                  )
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

            <span className="category-product-count">
              {filteredProducts.length} PRODUCTS
            </span>

          </div>

        </section>

        {/* ================= PRODUCTS ================= */}

        <section className="category-page-products">

          {currentProducts.length > 0 ? (

            <div className="category-page-grid">

              {currentProducts.map((product) => {

                const productId =
                  product._id || product.id;

                const productPrice =
                  product.salePrice !== null &&
                  product.salePrice !== undefined
                    ? product.salePrice
                    : product.regularPrice ||
                      product.price ||
                      0;

                let productImage =
                  product.images?.[0] ||
                  product.image ||
                  "";

                if (
                  productImage &&
                  !productImage.startsWith("http")
                ) {
                  productImage =
                    `${API_URL.replace(
                      "/api",
                      ""
                    )}${
                      productImage.startsWith("/")
                        ? ""
                        : "/"
                    }${productImage}`;
                }

                return (
                  <Link
                    key={productId}
                    to={`/product/${productId}`}
                    className="category-product-card"
                  >

                    <div className="category-product-image">

                      {Number(product.stock) === 0 && (
                        <span className="sold-out">
                          SOLD OUT
                        </span>
                      )}

                      {/* ================= WISHLIST ================= */}

                      <button
                        type="button"
                        className="category-wishlist-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        aria-label="Add to wishlist"
                      >
                        ♡
                      </button>

                      <img
                        src={productImage}
                        alt={product.name}
                      />

                    </div>

                    <div className="category-product-info">

                      <h3>{product.name}</h3>

                      <p className="product-price">
                        ₹{" "}
                        {Number(
                          productPrice
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </Link>
                );
              })}

            </div>

          ) : (

            <p className="no-category-products">
              No products found.
            </p>

          )}

          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (

            <div className="category-pagination">

              <button
                onClick={() =>
                  handlePageChange(
                    Math.max(
                      safeCurrentPage - 1,
                      1
                    )
                  )
                }
                disabled={
                  safeCurrentPage === 1
                }
              >
                ←
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (

                  <button
                    key={index}
                    className={
                      safeCurrentPage ===
                      index + 1
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handlePageChange(
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>

                )
              )}

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      safeCurrentPage + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
              >
                →
              </button>

            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Category;