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

  // ================= FILTERS =================
  const [availability, setAvailability] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [sortBy, setSortBy] = useState("newest");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

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

  // ================= GET CHILD CATEGORY IDS =================
  const childCategoryIds = (
    selectedCategory?.children || []
  ).map((category) => String(category._id));

  // ================= FILTER PRODUCTS =================
  const filteredProducts = products
    .filter((product) => {
      // Active products only
      if (product.status !== "active") {
        return false;
      }

      // Product must have category
      if (!product.category) {
        return false;
      }

      // Product category can be object or ID
      const productCategoryId =
        typeof product.category === "object"
          ? product.category._id
          : product.category;

      // Men's / Women's child categories only
      if (
        !childCategoryIds.includes(
          String(productCategoryId)
        )
      ) {
        return false;
      }

      // ================= AVAILABILITY =================
      if (availability === "available") {
        return Number(product.stock || 0) > 0;
      }

      if (availability === "soldout") {
        return Number(product.stock || 0) <= 0;
      }

      return true;
    })
    .sort((a, b) => {
      // ================= PRICE =================
      if (priceOrder === "low-high") {
        return (
          Number(a.price || 0) -
          Number(b.price || 0)
        );
      }

      if (priceOrder === "high-low") {
        return (
          Number(b.price || 0) -
          Number(a.price || 0)
        );
      }

      // ================= FEATURED =================
      if (sortBy === "featured") {
        return (
          Number(Boolean(b.isBestSeller)) -
          Number(Boolean(a.isBestSeller))
        );
      }

      // ================= NEWEST =================
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });

  // ================= PAGINATION CALCULATIONS =================
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // ================= CHANGE PAGE =================
  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= CHANGE FASHION =================
  const handleFashionChange = (fashion) => {
    setActiveFashion(fashion);
    setCurrentPage(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= RESET PAGE WHEN FILTER CHANGES =================
  useEffect(() => {
    setCurrentPage(1);
  }, [
    availability,
    priceOrder,
    sortBy,
    activeFashion,
  ]);

  // ================= PAGE TOP =================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ================= UI =================
  return (
    <>
      <Navbar />

      <main className="new-arrivals-page">

        {/* ================= HEADING ================= */}
        <section className="new-arrivals-page-heading">
          <h1>New Arrivals</h1>

          <p className="new-arrivals-page-description">
            Step into the latest drops that define the
            season.
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
                handleFashionChange("MEN'S FASHION")
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
                handleFashionChange("WOMEN'S FASHION")
              }
            >
              Women's Fashion
            </button>
          </div>
        </section>

        {/* ================= PRODUCTS SECTION ================= */}
        <section className="new-arrivals-page-products">

          {/* ================= SHOP STYLE FILTER ================= */}
          {!loading && !error && (
            <section className="shop-filter-bar">

              <div className="filter-left">

                <span className="filter-title">
                  FILTER
                </span>

                <select
                  value={availability}
                  onChange={(e) =>
                    setAvailability(e.target.value)
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
                    setPriceOrder(e.target.value)
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

              <div className="filter-right">

                <div className="sort-by">

                  <span>SORT BY:</span>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
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
          )}

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

          {/* ================= PRODUCTS ================= */}
          {!loading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="new-arrivals-page-grid">
                    {currentProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* ================= PAGINATION ================= */}
                  {totalPages > 1 && (
                    <div className="pagination">

                      <button
                        className="pagination-arrow"
                        onClick={() =>
                          handlePageChange(
                            currentPage - 1
                          )
                        }
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>

                      {Array.from(
                        {
                          length: totalPages,
                        },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={
                            currentPage === page
                              ? "active-page"
                              : ""
                          }
                          onClick={() =>
                            handlePageChange(page)
                          }
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        className="pagination-arrow"
                        onClick={() =>
                          handlePageChange(
                            currentPage + 1
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
                </>
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