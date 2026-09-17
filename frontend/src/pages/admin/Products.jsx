import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";
const PRODUCTS_PER_PAGE = 10;

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [bestSeller, setBestSeller] = useState("");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

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
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // =========================================================
  // FETCH ALL PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}?limit=1000`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const productList = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // =========================================================
  // MAIN CATEGORIES
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
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setCategory(selectedCategory);
    setSubcategory("");
  };

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // =======================================================
    // SEARCH
    // =======================================================

    if (search.trim()) {
      const searchText = search.trim().toLowerCase();

      result = result.filter((product) => {
        const productName =
          product.name?.toLowerCase() || "";

        const productSku =
          product.sku?.toLowerCase() || "";

        return (
          productName.includes(searchText) ||
          productSku.includes(searchText)
        );
      });
    }

    // =======================================================
    // CATEGORY
    // =======================================================

    if (category) {
      result = result.filter((product) => {
        let productCategoryId = "";

        if (
          typeof product.category === "object" &&
          product.category !== null
        ) {
          productCategoryId = product.category._id;
        } else {
          productCategoryId = product.category;
        }

        // SUBCATEGORY
        if (subcategory) {
          return productCategoryId === subcategory;
        }

        // MAIN CATEGORY
        const productCategory = categories.find(
          (cat) => cat._id === productCategoryId
        );

        const productParentId =
          typeof productCategory?.parent === "object"
            ? productCategory?.parent?._id
            : productCategory?.parent;

        return (
          productCategoryId === category ||
          productParentId === category
        );
      });
    }

    // =======================================================
    // AVAILABILITY
    // =======================================================

    if (availability === "in-stock") {
      result = result.filter(
        (product) => Number(product.stock || 0) > 0
      );
    }

    if (availability === "out-of-stock") {
      result = result.filter(
        (product) => Number(product.stock || 0) === 0
      );
    }

    // =======================================================
    // BEST SELLER
    // =======================================================

    if (bestSeller === "best-seller") {
      result = result.filter(
        (product) => product.isBestSeller === true
      );
    }

    if (bestSeller === "regular") {
      result = result.filter(
        (product) => product.isBestSeller !== true
      );
    }

    // =======================================================
    // SORT
    // =======================================================

    if (sort === "price-low") {
      result.sort((a, b) => {
        const priceA = Number(
          a.salePrice ||
            a.regularPrice ||
            a.price ||
            0
        );

        const priceB = Number(
          b.salePrice ||
            b.regularPrice ||
            b.price ||
            0
        );

        return priceA - priceB;
      });
    }

    if (sort === "price-high") {
      result.sort((a, b) => {
        const priceA = Number(
          a.salePrice ||
            a.regularPrice ||
            a.price ||
            0
        );

        const priceB = Number(
          b.salePrice ||
            b.regularPrice ||
            b.price ||
            0
        );

        return priceB - priceA;
      });
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [
    products,
    categories,
    search,
    category,
    subcategory,
    availability,
    bestSeller,
    sort,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalProducts = filteredProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalProducts / PRODUCTS_PER_PAGE
    )
  );

  const paginatedProducts =
    filteredProducts.slice(
      (currentPage - 1) * PRODUCTS_PER_PAGE,
      currentPage * PRODUCTS_PER_PAGE
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
    availability,
    bestSeller,
    sort,
  ]);

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    setAvailability("");
    setBestSeller("");
    setSort("");
    setCurrentPage(1);
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete product"
        );
      }

      await fetchProducts();

      if (
        paginatedProducts.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      alert("Failed to delete product.");
    }
  };

  // =========================================================
  // PRODUCT STATUS
  // =========================================================

  const getProductStatus = (product) => {
    if (product.status === "inactive") {
      return {
        label: "Inactive",
        className: "status-inactive",
      };
    }

    if (Number(product.stock || 0) === 0) {
      return {
        label: "Out of Stock",
        className: "status-out",
      };
    }

    if (Number(product.stock || 0) <= 10) {
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

  // =========================================================
  // GET CATEGORY NAME
  // =========================================================

  const getCategoryName = (product) => {
    if (
      typeof product.category === "object" &&
      product.category !== null
    ) {
      return (
        product.category.name ||
        "Uncategorized"
      );
    }

    const foundCategory = categories.find(
      (cat) => cat._id === product.category
    );

    return (
      foundCategory?.name ||
      "Uncategorized"
    );
  };

  // =========================================================
  // PAGINATION PAGES
  // =========================================================

  const getPaginationPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const pages = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const startPage = Math.max(
      2,
      currentPage - 1
    );

    const endPage = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="products-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage your products and inventory
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={() =>
            navigate("/admin/products/add")
          }
        >
          + Add Product
        </button>
      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="products-table-container">

        <div className="products-table-header">

          <div className="products-list-title">
            <h2>Product List</h2>

            <span>
              {totalProducts} products
            </span>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="products-filters">

            {/* SEARCH */}

            <div className="products-search">
              <span className="search-icon">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* MAIN CATEGORY */}

            <select
              className="products-filter"
              value={category}
              onChange={handleCategoryChange}
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

            {/* SUBCATEGORY */}

            <select
              className="products-filter"
              value={subcategory}
              onChange={(e) =>
                setSubcategory(e.target.value)
              }
              disabled={!category}
            >
              <option value="">
                {!category
                  ? "Select category first"
                  : subcategories.length === 0
                  ? "No subcategories"
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

            {/* AVAILABILITY */}

            <select
              className="products-filter"
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value)
              }
            >
              <option value="">
                Availability
              </option>

              <option value="in-stock">
                In Stock
              </option>

              <option value="out-of-stock">
                Out of Stock
              </option>
            </select>

            {/* BEST SELLER */}

            <select
              className="products-filter"
              value={bestSeller}
              onChange={(e) =>
                setBestSeller(e.target.value)
              }
            >
              <option value="">
                Best Seller
              </option>

              <option value="best-seller">
                Best Sellers
              </option>

              <option value="regular">
                Regular Products
              </option>
            </select>

            {/* SORT */}

            <select
              className="products-filter"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
            >
              <option value="">
                Sort By
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="newest">
                Newest
              </option>
            </select>

            {/* RESET */}

            <button
              className="filter-reset-btn"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="products-table-wrapper">

          {/* LOADING */}

          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner"></div>

              <p>
                Loading products...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (

            /* EMPTY */

            <div className="products-empty">
              <div className="empty-icon">
                <i className="bi bi-box-seam"></i>
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Try changing your search or
                filter options.
              </p>
            </div>

          ) : (

            /* PRODUCT TABLE */

            <table className="products-table">

              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>BEST SELLER</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {paginatedProducts.map(
                  (product) => {

                    const status =
                      getProductStatus(product);

                    const image =
                      product.images &&
                      product.images.length > 0
                        ? product.images[0]
                        : null;

                    return (
                      <tr
                        key={product._id}
                      >

                        {/* PRODUCT */}

                        <td>
                          <div className="product-info">

                            <div className="product-icon">
                              {image ? (
                                <img
                                  src={image}
                                  alt={product.name}
                                />
                              ) : (
                                <i className="bi bi-image"></i>
                              )}
                            </div>

                            <div className="product-details">

                              <strong className="product-name">
                                {product.name}
                              </strong>

                              <span className="product-sku">
                                {product.sku ||
                                  "No SKU"}
                              </span>

                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td>
                          <span className="product-category">
                            {getCategoryName(product)}
                          </span>
                        </td>

                        {/* PRICE */}

                        <td>
                          <div className="product-price">

                            {product.salePrice ? (
                              <>
                                <span className="sale-price">
                                  ₹
                                  {Number(
                                    product.salePrice
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>

                                <span className="regular-price">
                                  ₹
                                  {Number(
                                    product.regularPrice
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="sale-price">
                                ₹
                                {Number(
                                  product.regularPrice ||
                                    product.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
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
                            <span className="status-dot"></span>
                            {status.label}
                          </span>
                        </td>

                        {/* BEST SELLER */}

                        <td>
                          {product.isBestSeller ? (
                            <span className="best-seller-badge">
                              <i className="bi bi-star-fill"></i>
                              Best Seller
                            </span>
                          ) : (
                            <span className="regular-product-badge">
                              Regular
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="product-actions">

                            {/* VIEW */}

                            <button
                              className="view-btn"
                              title="View"
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
                              title="Edit"
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
                              title="Delete"
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
                  }
                )}

              </tbody>
            </table>
          )}
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {!loading &&
          filteredProducts.length > 0 &&
          totalPages > 1 && (

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
                Previous
              </button>

              {/* PAGE NUMBERS */}

              <div className="pagination-pages">

                {getPaginationPages().map(
                  (page, index) => {

                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="pagination-dots"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        className={`page-number ${
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
                    );
                  }
                )}

              </div>

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
                Next
                <i className="bi bi-chevron-right"></i>
              </button>

            </div>
          )}

      </div>
    </div>
  );
}

export default Products;