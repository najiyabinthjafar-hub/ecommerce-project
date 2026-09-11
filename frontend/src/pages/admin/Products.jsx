import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const PRODUCTS_PER_PAGE = 10;

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      const categoryList = Array.isArray(data)
        ? data
        : data.categories || data.data || [];

      setCategories(categoryList);
    } catch (error) {
      console.error("Category fetch error:", error);
      setCategories([]);
    }
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async (
    page = 1,
    filterValues = null
  ) => {
    try {
      setLoading(true);

      const filters = filterValues || {
        search,
        category,
        availability,
        sort,
      };

      const params = new URLSearchParams();

      // Search
      if (filters.search?.trim()) {
        params.append("search", filters.search.trim());
      }

      // Category ID
      if (filters.category) {
        params.append("category", filters.category);
      }

      // Availability
      if (filters.availability) {
        params.append("availability", filters.availability);
      }

      // Sorting
      if (filters.sort) {
        params.append("sort", filters.sort);
      }

      // Pagination
      params.append("page", page);
      params.append("limit", PRODUCTS_PER_PAGE);

      const url = `${API_URL}?${params.toString()}`;

      console.log("Products API:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status}`
        );
      }

      const data = await response.json();

      setProducts(data.products || []);

      if (data.pagination) {
        setCurrentPage(data.pagination.currentPage || page);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalProducts(data.pagination.totalProducts || 0);
      } else {
        setCurrentPage(page);
        setTotalPages(1);
        setTotalProducts(
          Array.isArray(data.products)
            ? data.products.length
            : 0
        );
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchCategories();
    fetchProducts(1, {
      search: "",
      category: "",
      availability: "",
      sort: "",
    });
  }, []);

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = () => {
    setCurrentPage(1);

    fetchProducts(1, {
      search,
      category,
      availability,
      sort,
    });
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setAvailability("");
    setSort("");
    setCurrentPage(1);

    fetchProducts(1, {
      search: "",
      category: "",
      availability: "",
      sort: "",
    });
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    fetchProducts(page);
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      // If deleting the only product on current page
      if (products.length === 1 && currentPage > 1) {
        fetchProducts(currentPage - 1);
      } else {
        fetchProducts(currentPage);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete product");
    }
  };

  // =====================================================
  // PRODUCT STATUS
  // =====================================================

  const getProductStatus = (product) => {
    if (product.status === "inactive") {
      return {
        label: "Inactive",
        className: "status-inactive",
      };
    }

    const stock = Number(product.stock || 0);

    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "status-out",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className: "status-low",
      };
    }

    return {
      label: "Active",
      className: "status-active",
    };
  };

  // =====================================================
  // PAGINATION DISPLAY
  // =====================================================

  const getPaginationPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your products and inventory</p>
        </div>

        <button
          className="add-product-btn"
          onClick={() =>
            navigate("/admin/products/add")
          }
        >
          <i className="bi bi-plus-lg"></i>
          Add Product
        </button>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="products-filters">

        {/* Search */}

        <div className="filter-search">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
          />
        </div>

        {/* Category */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat._id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        {/* Availability */}

        <select
          value={availability}
          onChange={(e) =>
            setAvailability(e.target.value)
          }
        >
          <option value="">
            All Stock
          </option>

          <option value="in-stock">
            In Stock
          </option>

          <option value="out-of-stock">
            Out of Stock
          </option>
        </select>

        {/* Sort */}

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="">
            Sort By
          </option>

          <option value="newest">
            Newest
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>
        </select>

        {/* Apply */}

        <button
          className="apply-filter-btn"
          onClick={handleApplyFilters}
        >
          Apply
        </button>

        {/* Reset */}

        <button
          className="reset-filter-btn"
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>

      {/* =================================================
          PRODUCT COUNT
      ================================================= */}

      <div className="products-count">
        <span>
          {totalProducts}{" "}
          {totalProducts === 1
            ? "product"
            : "products"}
        </span>
      </div>

      {/* =================================================
          PRODUCTS TABLE
      ================================================= */}

      <div className="products-table-wrapper">

        {loading ? (
          <div className="products-loading">
            <i className="bi bi-arrow-repeat"></i>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <i className="bi bi-box-seam"></i>

            <h3>No products found</h3>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <table className="products-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => {
                const status =
                  getProductStatus(product);

                return (
                  <tr key={product._id}>

                    {/* PRODUCT */}

                    <td>
                      <div className="product-info">

                        <div className="product-icon">

                          {product.images &&
                          product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={
                                product.name ||
                                "Product"
                              }
                            />
                          ) : (
                            <i className="bi bi-image"></i>
                          )}

                        </div>

                        <div className="product-details">

                          <span className="product-name">
                            {product.name ||
                              "Unnamed Product"}
                          </span>

                          <span className="product-sku">
                            SKU:{" "}
                            {product.sku || "N/A"}
                          </span>

                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      {product.category?.name ||
                        "Uncategorized"}
                    </td>

                    {/* PRICE */}

                    <td>
                      <div className="product-price">

                        {product.salePrice &&
                        Number(product.salePrice) > 0 &&
                        Number(product.salePrice) <
                          Number(
                            product.regularPrice
                          ) ? (
                          <>
                            <span className="sale-price">
                              ₹
                              {Number(
                                product.salePrice
                              ).toLocaleString()}
                            </span>

                            <span className="regular-price">
                              ₹
                              {Number(
                                product.regularPrice
                              ).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="sale-price">
                            ₹
                            {Number(
                              product.regularPrice || 0
                            ).toLocaleString()}
                          </span>
                        )}

                      </div>
                    </td>

                    {/* STOCK */}

                    <td>
                      <span
                        className={
                          Number(
                            product.stock || 0
                          ) <= 10
                            ? "stock-low"
                            : "stock-normal"
                        }
                      >
                        {product.stock ?? 0}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`product-status ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="product-actions">

                        {/* VIEW */}

                        <button
                          className="view-btn"
                          title="View Product"
                          onClick={() =>
                            navigate(
                              `/admin/products/view/${product._id}`
                            )
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* EDIT */}

                        <button
                          className="edit-btn"
                          title="Edit Product"
                          onClick={() =>
                            navigate(
                              `/admin/products/edit/${product._id}`
                            )
                          }
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* DELETE */}

                        <button
                          className="delete-btn"
                          title="Delete Product"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

            </tbody>
          </table>
        )}

      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (
        <div className="products-pagination">

          {/* PREVIOUS */}

          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* PAGE NUMBERS */}

          {getPaginationPages().map(
            (page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="pagination-dots"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-btn ${
                    currentPage === page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </button>
              )
          )}

          {/* NEXT */}

          <button
            className="pagination-btn"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              handlePageChange(
                currentPage + 1
              )
            }
          >
            <i className="bi bi-chevron-right"></i>
          </button>

        </div>
      )}

    </div>
  );
}

export default Products;