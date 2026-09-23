import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const PRODUCTS_PER_PAGE = 10;

function Products() {
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [bestSeller, setBestSeller] = useState("");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
  // GET CATEGORY ID
  // =========================================================

  const getCategoryId = (product) => {
    if (!product) return "";

    if (
      typeof product.category === "object" &&
      product.category !== null
    ) {
      return String(product.category._id || "");
    }

    return String(product.category || "");
  };

  // =========================================================
  // GET PARENT ID
  // =========================================================

  const getParentId = (cat) => {
    if (!cat) return "";

    if (
      typeof cat.parent === "object" &&
      cat.parent !== null
    ) {
      return String(cat.parent._id || "");
    }

    return String(
      cat.parent ||
        cat.parentId ||
        cat.parentCategory ||
        cat.parentCategoryId ||
        ""
    );
  };

  // =========================================================
  // GET ALL CHILD CATEGORY IDS
  // =========================================================

  const getChildCategoryIds = (parentId) => {
    if (!parentId) return [];

    const childIds = [];

    const findChildren = (currentParentId) => {
      categories.forEach((cat) => {
        const catParentId = getParentId(cat);

        if (
          catParentId &&
          String(catParentId) === String(currentParentId)
        ) {
          const childId = String(cat._id);

          if (!childIds.includes(childId)) {
            childIds.push(childId);
          }

          findChildren(childId);
        }
      });
    };

    findChildren(String(parentId));

    return childIds;
  };

  // =========================================================
  // GET ALLOWED CATEGORY IDS
  // MAIN CATEGORY + ALL CHILDREN
  // =========================================================

  const getAllowedCategoryIds = (parentId) => {
    if (!parentId) return [];

    const childIds = getChildCategoryIds(parentId);

    return [
      String(parentId),
      ...childIds.map((id) => String(id)),
    ];
  };

  // =========================================================
  // EFFECTIVE PRICE
  // =========================================================

  const getEffectivePrice = (product) => {
    const salePrice = Number(product.salePrice || 0);

    const regularPrice = Number(
      product.regularPrice || product.price || 0
    );

    if (salePrice > 0) {
      return salePrice;
    }

    return regularPrice;
  };

  // =========================================================
  // SORT PRODUCTS
  // =========================================================

  const sortProducts = (productList, sortType) => {
    const result = [...productList];

    if (sortType === "price-low") {
      result.sort(
        (a, b) =>
          getEffectivePrice(a) - getEffectivePrice(b)
      );
    }

    if (sortType === "price-high") {
      result.sort(
        (a, b) =>
          getEffectivePrice(b) - getEffectivePrice(a)
      );
    }

    if (sortType === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  };

  // =========================================================
  // FETCH ALL PRODUCTS FROM BACKEND
  // =========================================================

  const fetchAllProductsFromBackend = async () => {
    let allProducts = [];
    let page = 1;
    let backendTotalPages = 1;

    do {
      const params = new URLSearchParams();

      // Search
      if (search.trim()) {
        params.append("search", search.trim());
      }

      // Subcategory
      if (subcategory) {
        params.append("category", subcategory);
      }

      // Availability
      if (availability) {
        params.append("availability", availability);
      }

      // Sort
      if (sort) {
        params.append("sort", sort);
      }

      params.append("page", page);
      params.append("limit", PRODUCTS_PER_PAGE);

      const response = await fetch(
        `${API_URL}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      allProducts = [...allProducts, ...list];

      backendTotalPages = Number(
        data.pagination?.totalPages || 1
      );

      page++;
    } while (page <= backendTotalPages);

    return allProducts;
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // =====================================================
      // CASE 1:
      // MAIN CATEGORY / BEST SELLER FILTER
      // =====================================================

      if (
        (category && !subcategory) ||
        bestSeller
      ) {
        const allProducts =
          await fetchAllProductsFromBackend();

        let filtered = allProducts;

        // Main category
        if (category && !subcategory) {
          const allowedCategoryIds =
            getAllowedCategoryIds(category);

          filtered = filtered.filter((product) => {
            const productCategoryId =
              getCategoryId(product);

            return allowedCategoryIds.includes(
              String(productCategoryId)
            );
          });
        }

        // Subcategory
        if (subcategory) {
          filtered = filtered.filter((product) => {
            return (
              String(getCategoryId(product)) ===
              String(subcategory)
            );
          });
        }

        // Best Seller
        if (bestSeller === "best-seller") {
          filtered = filtered.filter(
            (product) =>
              product.isBestSeller === true
          );
        }

        // Regular Products
        if (bestSeller === "regular") {
          filtered = filtered.filter(
            (product) =>
              product.isBestSeller !== true
          );
        }

        // Sort
        filtered = sortProducts(filtered, sort);

        // Pagination
        setTotalProducts(filtered.length);

        const calculatedPages = Math.max(
          Math.ceil(
            filtered.length / PRODUCTS_PER_PAGE
          ),
          1
        );

        setTotalPages(calculatedPages);

        const startIndex =
          (currentPage - 1) * PRODUCTS_PER_PAGE;

        const endIndex =
          startIndex + PRODUCTS_PER_PAGE;

        setProducts(
          filtered.slice(startIndex, endIndex)
        );

        return;
      }

      // =====================================================
      // CASE 2:
      // NORMAL BACKEND QUERY
      // =====================================================

      const params = new URLSearchParams();

      // Search
      if (search.trim()) {
        params.append(
          "search",
          search.trim()
        );
      }

      // Subcategory
      if (subcategory) {
        params.append(
          "category",
          subcategory
        );
      }

      // Availability
      if (availability) {
        params.append(
          "availability",
          availability
        );
      }

      // Sort
      if (sort) {
        params.append("sort", sort);
      }

      params.append(
        "page",
        currentPage
      );

      params.append(
        "limit",
        PRODUCTS_PER_PAGE
      );

      const response = await fetch(
        `${API_URL}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

      const productList = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(productList);

      if (data.pagination) {
        setTotalProducts(
          Number(
            data.pagination.totalProducts || 0
          )
        );

        setTotalPages(
          Math.max(
            Number(
              data.pagination.totalPages || 1
            ),
            1
          )
        );
      } else {
        setTotalProducts(productList.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================================
  // FETCH WHEN FILTERS CHANGE
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, [
    search,
    category,
    subcategory,
    availability,
    bestSeller,
    sort,
    currentPage,
  ]);

  // =========================================================
  // MAIN CATEGORIES
  // =========================================================

  const parentCategories = useMemo(() => {
    return categories.filter(
      (cat) => !getParentId(cat)
    );
  }, [categories]);

  // =========================================================
  // SUBCATEGORIES
  // =========================================================

  const subcategories = useMemo(() => {
    if (!category) {
      return [];
    }

    return categories.filter(
      (cat) =>
        String(getParentId(cat)) ===
        String(category)
    );
  }, [categories, category]);

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);
    setSubcategory("");
    setCurrentPage(1);
  };

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

      if (
        products.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (prev) => prev - 1
        );
      } else {
        await fetchProducts();
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

    const foundCategory =
      categories.find(
        (cat) =>
          String(cat._id) ===
          String(product.category)
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

    const pages = [1];

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

    if (
      currentPage <
      totalPages - 2
    ) {
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

      {/* HEADER */}

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

      {/* TABLE CARD */}

      <div className="products-table-container">

        {/* TABLE HEADER */}

        <div className="products-table-header">

          <div className="products-list-title">
            <h2>Product List</h2>

            <span>
              {totalProducts} products
            </span>
          </div>

          {/* FILTER AREA */}

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
                onChange={(e) => {
                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
              />
            </div>

            {/* FILTER ROW */}

            <div className="products-filter-row">

              {/* MAIN CATEGORY */}

              <select
                className="products-filter"
                value={category}
                onChange={
                  handleCategoryChange
                }
              >
                <option value="">
                  All Categories
                </option>

                {parentCategories.map(
                  (cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.name}
                    </option>
                  )
                )}
              </select>

              {/* SUBCATEGORY */}

              <select
                className="products-filter"
                value={subcategory}
                onChange={(e) => {
                  setSubcategory(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
                disabled={!category}
              >
                <option value="">
                  {!category
                    ? "Select category first"
                    : subcategories.length === 0
                    ? "No subcategories"
                    : "All Subcategories"}
                </option>

                {subcategories.map(
                  (cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.name}
                    </option>
                  )
                )}
              </select>

              {/* AVAILABILITY */}

              <select
                className="products-filter"
                value={availability}
                onChange={(e) => {
                  setAvailability(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setBestSeller(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setSort(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
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
                onClick={
                  handleResetFilters
                }
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="products-table-wrapper">

          {/* LOADING */}

          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner"></div>

              <p>
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (

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

                {products.map(
                  (product) => {
                    const status =
                      getProductStatus(
                        product
                      );

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
                                  alt={
                                    product.name
                                  }
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
                            {getCategoryName(
                              product
                            )}
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

        {/* PAGINATION */}

        {!loading &&
          products.length > 0 &&
          totalPages > 1 && (

            <div className="products-pagination">

              {/* PREVIOUS */}

              <button
                className="pagination-btn"
                disabled={
                  currentPage === 1
                }
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
                          handlePageChange(
                            page
                          )
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
                  currentPage ===
                  totalPages
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