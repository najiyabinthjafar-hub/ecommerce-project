import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const API_URL = "http://localhost:5000/api/products";
const PRODUCTS_PER_PAGE = 10;

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?page=${page}&limit=${PRODUCTS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      console.log("Products API response:", data);

      const productList = Array.isArray(data)
        ? data
        : data.products || [];

      setProducts(productList);

      // Backend pagination response
      if (data.pagination) {
        setCurrentPage(data.pagination.currentPage || page);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalProducts(data.pagination.totalProducts || 0);
      } else {
        setCurrentPage(1);
        setTotalPages(1);
        setTotalProducts(productList.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // =========================
  // PAGE CHANGE
  // =========================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchProducts(page);
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (product) => {
    const productId = product._id || product.id;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      alert(data.message || "Product deleted successfully");

      // If last product on current page was deleted,
      // move to previous page if necessary
      if (products.length === 1 && currentPage > 1) {
        fetchProducts(currentPage - 1);
      } else {
        fetchProducts(currentPage);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message);
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEdit = (product) => {
    const productId = product._id || product.id;

    navigate(`/admin/products/edit/${productId}`);
  };

  // =========================
  // VIEW PRODUCT
  // =========================
  const handleView = (product) => {
    const productId = product._id || product.id;

    navigate(`/admin/products/view/${productId}`);
  };

  // =========================
  // SEARCH
  // =========================
  const filteredProducts = products.filter((product) =>
    (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="page-header">
        <div className="page-heading">
          <span className="page-eyebrow">
            STORE MANAGEMENT
          </span>

          <h1>Products</h1>

          <p>
            Manage your products, pricing and inventory
          </p>
        </div>

        <button
          type="button"
          className="add-product-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Add Product</span>
        </button>
      </div>

      {/* =========================
          PRODUCT CARD
      ========================= */}
      <div className="product-card">

        {/* =========================
            CARD TOP
        ========================= */}
        <div className="product-top">

          <div className="product-title">
            <div className="title-icon">
              <i className="bi bi-box-seam"></i>
            </div>

            <div>
              <h2>All Products</h2>

              <p>
                View and manage everything in your store
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="product-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

        </div>

        {/* =========================
            PRODUCT COUNT
        ========================= */}
        <div className="product-summary">
          <span>
            <strong>
              {search ? filteredProducts.length : totalProducts}
            </strong>{" "}
            {(
              search
                ? filteredProducts.length
                : totalProducts
            ) === 1
              ? "product"
              : "products"}{" "}
            found
          </span>
        </div>

        {/* =========================
            TABLE
        ========================= */}
        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th className="action-heading">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>

              {/* =========================
                  LOADING
              ========================= */}
              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    <div className="loading-content">
                      <i className="bi bi-arrow-repeat spin"></i>

                      <span>
                        Loading products...
                      </span>
                    </div>
                  </td>
                </tr>

              ) : filteredProducts.length === 0 ? (

                /* =========================
                   EMPTY
                ========================= */

                <tr>
                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    <div className="empty-content">

                      <div className="empty-icon">
                        <i className="bi bi-box-seam"></i>
                      </div>

                      <strong>
                        No products found
                      </strong>

                      <span>
                        {search
                          ? "Try searching with another name"
                          : "Add your first product to get started"}
                      </span>

                    </div>
                  </td>
                </tr>

              ) : (

                /* =========================
                   PRODUCTS
                ========================= */

                filteredProducts.map((product) => {

                  const stock = product.stock ?? 0;

                  const status =
                    product.status === "inactive"
                      ? "Inactive"
                      : stock === 0
                      ? "Out of Stock"
                      : stock <= 10
                      ? "Low Stock"
                      : "Active";

                  const regularPrice =
                    product.regularPrice ?? 0;

                  const salePrice =
                    product.salePrice;

                  const statusClass =
                    status === "Active"
                      ? "active"
                      : status === "Low Stock"
                      ? "low"
                      : status === "Inactive"
                      ? "inactive"
                      : "out";

                  return (
                    <tr
                      key={product._id || product.id}
                    >

                      {/* =========================
                          PRODUCT
                      ========================= */}
                      <td>

                        <div className="product-name">

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

                              <i className="bi bi-box-seam"></i>

                            )}

                          </div>

                          <div className="product-info">

                            <strong>
                              {product.name || "-"}
                            </strong>

                            <span>
                              {product.sku || "Product"}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* =========================
                          CATEGORY
                      ========================= */}
                      <td>

                        <span className="category-text">
                          {product.category?.name ||
                            product.category ||
                            "-"}
                        </span>

                      </td>

                      {/* =========================
                          PRICE
                      ========================= */}
                      <td>

                        {salePrice !== null &&
                        salePrice !== undefined ? (

                          <div className="price-wrapper">

                            <strong className="sale-price">
                              ₹{salePrice}
                            </strong>

                            <span className="regular-price">
                              ₹{regularPrice}
                            </span>

                          </div>

                        ) : (

                          <strong className="normal-price">
                            ₹{regularPrice}
                          </strong>

                        )}

                      </td>

                      {/* =========================
                          STOCK
                      ========================= */}
                      <td>

                        <span
                          className={`stock-value ${
                            stock === 0
                              ? "stock-zero"
                              : stock <= 10
                              ? "stock-low"
                              : ""
                          }`}
                        >
                          {stock}
                        </span>

                      </td>

                      {/* =========================
                          STATUS
                      ========================= */}
                      <td>

                        <span
                          className={`status ${statusClass}`}
                        >
                          <span className="status-dot"></span>

                          {status}
                        </span>

                      </td>

                      {/* =========================
                          ACTIONS
                      ========================= */}
                      <td className="action-cell">

                        <div className="product-actions">

                          {/* VIEW */}
                          <button
                            type="button"
                            className="view-btn"
                            title="View product"
                            onClick={() =>
                              handleView(product)
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            className="edit-btn"
                            title="Edit product"
                            onClick={() =>
                              handleEdit(product)
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="delete-btn"
                            title="Delete product"
                            onClick={() =>
                              handleDelete(product)
                            }
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            PAGINATION
        ========================= */}
        {!loading &&
          !search &&
          totalPages > 1 && (

            <div className="products-pagination">

              {/* PREVIOUS */}
              <button
                type="button"
                className="pagination-btn pagination-arrow"
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                title="Previous page"
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {/* PAGE NUMBERS */}
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  type="button"
                  key={page}
                  className={`pagination-btn pagination-number ${
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

              ))}

              {/* NEXT */}
              <button
                type="button"
                className="pagination-btn pagination-arrow"
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages
                }
                title="Next page"
              >
                <i className="bi bi-chevron-right"></i>
              </button>

            </div>

          )}

      </div>

    </div>
  );
}

export default Products;