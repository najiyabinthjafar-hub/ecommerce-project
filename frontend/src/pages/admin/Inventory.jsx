import React, { useEffect, useMemo, useState } from "react";
import "./Inventory.css";

const PRODUCTS_API = "http://localhost:5000/api/products";
const CATEGORIES_API = "http://localhost:5000/api/categories";

const PRODUCTS_PER_PAGE = 10;

function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${PRODUCTS_API}?limit=1000`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.products || []);
    } catch (err) {
      console.error("Products fetch error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORIES_API);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      setCategories(
        Array.isArray(data)
          ? data
          : data.categories || data.data || []
      );
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================================================
  // PARENT CATEGORIES
  // =========================================================

  const parentCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parent);
  }, [categories]);

  // =========================================================
  // SUBCATEGORIES
  // =========================================================

  const subcategories = useMemo(() => {
    if (!category) {
      return [];
    }

    return categories.filter((cat) => {
      const parentId =
        typeof cat.parent === "object"
          ? cat.parent?._id
          : cat.parent;

      return parentId === category;
    });
  }, [categories, category]);

  // =========================================================
  // CATEGORY NAME
  // =========================================================

  const getCategoryName = (product) => {
    if (!product?.category) {
      return "Uncategorized";
    }

    if (typeof product.category === "object") {
      return product.category.name || "Uncategorized";
    }

    const foundCategory = categories.find(
      (cat) => cat._id === product.category
    );

    return foundCategory?.name || "Uncategorized";
  };

  // =========================================================
  // PRODUCT PRICE
  // =========================================================

  const getProductPrice = (product) => {
    const salePrice = Number(product?.salePrice);
    const regularPrice = Number(product?.regularPrice);

    if (salePrice > 0) {
      return salePrice;
    }

    return regularPrice || 0;
  };

  // =========================================================
  // PRODUCT IMAGE
  // =========================================================

  const getProductImage = (product) => {
    if (product?.images && product.images.length > 0) {
      return product.images[0];
    }

    return null;
  };

  // =========================================================
  // STOCK STATUS
  // =========================================================

  const getStockStatus = (stock) => {
    const quantity = Number(stock);

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className: "status-out",
      };
    }

    if (quantity <= 10) {
      return {
        label: "Low Stock",
        className: "status-low",
      };
    }

    return {
      label: "In Stock",
      className: "status-in",
    };
  };

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.name || "";
      const productSku = product.sku || "";

      const searchValue = search.toLowerCase().trim();

      // SEARCH
      const matchesSearch =
        productName.toLowerCase().includes(searchValue) ||
        productSku.toLowerCase().includes(searchValue);

      // CATEGORY
      let matchesCategory = true;

      if (category) {
        let productCategoryId = "";

        if (
          typeof product.category === "object" &&
          product.category !== null
        ) {
          productCategoryId = product.category._id;
        } else {
          productCategoryId = product.category;
        }

        // SUBCATEGORY SELECTED
        if (subcategory) {
          matchesCategory = productCategoryId === subcategory;
        }

        // ONLY PARENT CATEGORY SELECTED
        else {
          const productCategory = categories.find(
            (cat) => cat._id === productCategoryId
          );

          const productParentId =
            typeof productCategory?.parent === "object"
              ? productCategory?.parent?._id
              : productCategory?.parent;

          matchesCategory =
            productCategoryId === category ||
            productParentId === category;
        }
      }

      // STOCK
      const stock = Number(product.stock) || 0;

      let matchesStatus = true;

      if (statusFilter === "in-stock") {
        matchesStatus = stock > 10;
      }

      if (statusFilter === "low-stock") {
        matchesStatus = stock > 0 && stock <= 10;
      }

      if (statusFilter === "out-of-stock") {
        matchesStatus = stock === 0;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    category,
    subcategory,
    statusFilter,
    categories,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * PRODUCTS_PER_PAGE;

  const endIndex =
    startIndex + PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    endIndex
  );

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    subcategory,
    statusFilter,
  ]);

  // =========================================================
  // KEEP PAGE VALID
  // =========================================================

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // =========================================================
  // INVENTORY STATS
  // =========================================================

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) => Number(product.stock) > 10
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 10
  ).length;

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  ).length;

  const totalStockUnits = products.reduce(
    (total, product) =>
      total + (Number(product.stock) || 0),
    0
  );

  // =========================================================
  // OPEN STOCK MODAL
  // =========================================================

  const handleOpenStockModal = (product) => {
    setSelectedProduct(product);
    setStockValue(product.stock ?? 0);
    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setStockValue("");
    setUpdating(false);
  };

  // =========================================================
  // UPDATE STOCK
  // =========================================================

  const handleUpdateStock = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      return;
    }

    const newStock = Number(stockValue);

    if (Number.isNaN(newStock) || newStock < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `${PRODUCTS_API}/${selectedProduct._id}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: newStock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update stock"
        );
      }

      alert("Stock updated successfully.");

      handleCloseModal();

      await fetchProducts();
    } catch (err) {
      console.error("Stock update error:", err);

      alert(
        err.message || "Failed to update stock."
      );

      setUpdating(false);
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // =========================================================
  // PAGINATION HANDLERS
  // =========================================================

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="inventory-page">

      {/* HEADER */}

      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>

          <p>
            Manage product stock and inventory levels
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">
          <div className="stat-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div className="stat-content">
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>

          <div className="stat-content">
            <span>In Stock</span>
            <strong>{inStockProducts}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>

          <div className="stat-content">
            <span>Low Stock</span>
            <strong>{lowStockProducts}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon">
            <i className="bi bi-x-circle"></i>
          </div>

          <div className="stat-content">
            <span>Out of Stock</span>
            <strong>{outOfStockProducts}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon">
            <i className="bi bi-stack"></i>
          </div>

          <div className="stat-content">
            <span>Total Stock Units</span>
            <strong>{totalStockUnits}</strong>
          </div>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="inventory-error">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* TABLE CARD */}

      <div className="inventory-table-container">

        {/* TABLE HEADER + FILTERS */}

        <div className="inventory-table-header">

          <div className="inventory-title">
            <h2>Inventory List</h2>
          </div>

          <div className="inventory-filter-box">

            {/* SEARCH */}

            <div className="inventory-search">

              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search product or SKU..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* CATEGORY */}

            <div className="inventory-filter">

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                }}
              >
                <option value="">
                  All Categories
                </option>

                {parentCategories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

            </div>

            {/* SUBCATEGORY */}

            <div className="inventory-filter">

              <select
                value={subcategory}
                onChange={(e) =>
                  setSubcategory(e.target.value)
                }
                disabled={
                  !category ||
                  subcategories.length === 0
                }
              >

                <option value="">
                  {!category
                    ? "Select Category First"
                    : subcategories.length === 0
                    ? "No Subcategories"
                    : "All Subcategories"}
                </option>

                {subcategories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}

              </select>

            </div>

            {/* STOCK STATUS */}

            <div className="inventory-filter">

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="">
                  All Stock Status
                </option>

                <option value="in-stock">
                  In Stock
                </option>

                <option value="low-stock">
                  Low Stock
                </option>

                <option value="out-of-stock">
                  Out of Stock
                </option>

              </select>

            </div>

            {/* CLEAR */}

            {(search ||
              category ||
              subcategory ||
              statusFilter) && (
              <button
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                <i className="bi bi-x-lg"></i>
                Clear
              </button>
            )}

          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="inventory-loading">
            <div className="spinner"></div>

            <p>Loading inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (

          /* EMPTY */

          <div className="inventory-empty">

            <i className="bi bi-box-seam"></i>

            <h3>No products found</h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <>

            {/* TABLE */}

            <div className="inventory-table-wrapper">

              <table className="inventory-table">

                <thead>

                  <tr>
                    <th>PRODUCT</th>
                    <th>SKU</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>STOCK</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>

                  {currentProducts.map((product) => {

                    const stock =
                      Number(product.stock) || 0;

                    const stockStatus =
                      getStockStatus(stock);

                    const image =
                      getProductImage(product);

                    return (

                      <tr key={product._id}>

                        {/* PRODUCT */}

                        <td>

                          <div className="inventory-product">

                            <div className="inventory-product-image">

                              {image ? (

                                <img
                                  src={image}
                                  alt={product.name}
                                />

                              ) : (

                                <i className="bi bi-image"></i>

                              )}

                            </div>

                            <div className="inventory-product-info">

                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                Product
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* SKU */}

                        <td>

                          <span className="sku-text">
                            {product.sku || "—"}
                          </span>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="category-text">
                            {getCategoryName(product)}
                          </span>

                        </td>

                        {/* PRICE */}

                        <td>

                          <span className="price-text">
                            ₹
                            {getProductPrice(
                              product
                            ).toLocaleString("en-IN")}
                          </span>

                        </td>

                        {/* STOCK */}

                        <td>

                          <span
                            className={`stock-number ${
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

                        {/* STATUS */}

                        <td>

                          <span
                            className={`inventory-status ${stockStatus.className}`}
                          >

                            <span className="status-dot"></span>

                            {stockStatus.label}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="update-stock-btn"
                            onClick={() =>
                              handleOpenStockModal(
                                product
                              )
                            }
                          >

                            <i className="bi bi-pencil-square"></i>

                            <span>
                              Update Stock
                            </span>

                          </button>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

              <div className="inventory-pagination">

                <button
                  className="pagination-btn"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >

                  <i className="bi bi-chevron-left"></i>

                  Previous

                </button>

                <div className="pagination-pages">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (

                    <button
                      key={page}
                      className={`pagination-page ${
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

                </div>

                <button
                  className="pagination-btn"
                  onClick={handleNext}
                  disabled={
                    currentPage === totalPages
                  }
                >

                  Next

                  <i className="bi bi-chevron-right"></i>

                </button>

              </div>

            )}

          </>

        )}

      </div>

      {/* UPDATE STOCK MODAL */}

      {showModal && selectedProduct && (

        <div
          className="inventory-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="inventory-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="inventory-modal-header">

              <div>

                <h3>Update Stock</h3>

                <p>
                  Update inventory quantity
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={handleCloseModal}
              >

                <i className="bi bi-x-lg"></i>

              </button>

            </div>

            {/* PRODUCT */}

            <div className="inventory-modal-product">

              <div className="modal-product-image">

                {getProductImage(
                  selectedProduct
                ) ? (

                  <img
                    src={getProductImage(
                      selectedProduct
                    )}
                    alt={selectedProduct.name}
                  />

                ) : (

                  <i className="bi bi-image"></i>

                )}

              </div>

              <div className="modal-product-info">

                <strong>
                  {selectedProduct.name}
                </strong>

                <span>
                  SKU:{" "}
                  {selectedProduct.sku || "—"}
                </span>

              </div>

            </div>

            {/* FORM */}

            <form onSubmit={handleUpdateStock}>

              <div className="stock-input-group">

                <label>
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={stockValue}
                  onChange={(e) =>
                    setStockValue(e.target.value)
                  }
                  placeholder="Enter stock quantity"
                  required
                />

              </div>

              <div className="current-stock-info">

                <span>
                  Current Stock
                </span>

                <strong>
                  {selectedProduct.stock || 0}
                </strong>

              </div>

              {/* ACTIONS */}

              <div className="inventory-modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-stock-btn"
                  disabled={updating}
                >

                  {updating ? (

                    <>
                      <span className="button-spinner"></span>
                      Updating...
                    </>

                  ) : (

                    <>
                      <i className="bi bi-check-lg"></i>
                      Update Stock
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Inventory;