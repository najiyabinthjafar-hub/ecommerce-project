
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const API_URL = "http://localhost:5000/api";

// =========================================================
// ORDERS PER PAGE
// Backend pagination limit
// =========================================================

const ORDERS_PER_PAGE = 10;

// =========================================================
// ORDER STATUS
// These match the backend Order model
// =========================================================

const statusLabels = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusClassMap = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// =========================================================
// PAYMENT STATUS
// =========================================================

const paymentStatusLabels = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

const paymentStatusClassMap = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};

// =========================================================
// ORDERS COMPONENT
// =========================================================

const Orders = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [paymentFilter, setPaymentFilter] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalOrders, setTotalOrders] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // FETCH ORDERS FROM BACKEND
  // =========================================================

  const fetchOrders = useCallback(
    async (page = currentPage) => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        // -----------------------------------------------------
        // TOKEN CHECK
        // -----------------------------------------------------

        if (!token) {
          setError(
            "Authentication required. Please login again."
          );

          setOrders([]);
          setTotalOrders(0);
          setTotalPages(1);

          return;
        }

        // -----------------------------------------------------
        // GET ADMIN ORDERS
        // GET /api/orders/all
        // -----------------------------------------------------

        const response = await axios.get(
          `${API_URL}/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            params: {
              page,
              limit: ORDERS_PER_PAGE,

              search: search.trim(),

              orderStatus:
                statusFilter === "ALL"
                  ? ""
                  : statusFilter,

              paymentStatus:
                paymentFilter === "ALL"
                  ? ""
                  : paymentFilter,
            },
          }
        );

        // -----------------------------------------------------
        // BACKEND RESPONSE
        //
        // {
        //   success: true,
        //   orders: [],
        //   currentPage: 1,
        //   totalPages: 5,
        //   totalOrders: 48
        // }
        // -----------------------------------------------------

        const responseOrders =
          response.data?.orders || [];

        setOrders(
          Array.isArray(responseOrders)
            ? responseOrders
            : []
        );

        setCurrentPage(
          Number(
            response.data?.currentPage || page
          )
        );

        setTotalPages(
          Math.max(
            Number(
              response.data?.totalPages || 1
            ),
            1
          )
        );

        setTotalOrders(
          Number(
            response.data?.totalOrders || 0
          )
        );
      } catch (error) {
        console.error(
          "Failed to fetch admin orders:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          setError(
            "You are not authorized to view orders."
          );
        } else {
          setError(
            error.response?.data?.message ||
              error.message ||
              "Failed to load orders."
          );
        }

        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      search,
      statusFilter,
      paymentFilter,
    ]
  );

  // =========================================================
  // INITIAL / SEARCH / FILTER / PAGINATION FETCH
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(currentPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    currentPage,
    search,
    statusFilter,
    paymentFilter,
    fetchOrders,
  ]);

  // =========================================================
  // RESET PAGE WHEN SEARCH / FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    paymentFilter,
  ]);

  // =========================================================
  // CUSTOMER HELPERS
  // =========================================================

  const getCustomerName = (order) => {
    return (
      order?.user?.name ||
      order?.user?.fullName ||
      order?.shippingAddress?.fullName ||
      order?.shippingAddress?.name ||
      "Unknown Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return (
      order?.user?.email ||
      order?.shippingAddress?.email ||
      "—"
    );
  };

  const getCustomerPhone = (order) => {
    return (
      order?.user?.phone ||
      order?.shippingAddress?.phone ||
      "—"
    );
  };

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const getStatusLabel = (status) => {
    return (
      statusLabels[status] ||
      status ||
      "Unknown"
    );
  };

  const getStatusClass = (status) => {
    return (
      statusClassMap[status] ||
      "pending"
    );
  };

  const getPaymentStatusLabel = (status) => {
    return (
      paymentStatusLabels[status] ||
      status ||
      "Pending"
    );
  };

  const getPaymentStatusClass = (status) => {
    return (
      paymentStatusClassMap[status] ||
      "pending"
    );
  };

  // =========================================================
  // FORMAT HELPERS
  // =========================================================

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getItemCount = (order) => {
    if (!Array.isArray(order?.items)) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total +
        Number(item?.quantity || 0),
      0
    );
  };

  const getOrderId = (order) => {
    if (!order?._id) {
      return "—";
    }

    return `ORD-${String(order._id)
      .slice(-6)
      .toUpperCase()}`;
  };

  // =========================================================
  // SUMMARY
  // Counts are based on currently loaded backend page
  // =========================================================

  const summary = useMemo(() => {
    const pending = orders.filter(
      (order) =>
        order?.orderStatus === "PENDING"
    ).length;

    const processing =
      orders.filter(
        (order) =>
          [
            "CONFIRMED",
            "PROCESSING",
          ].includes(
            order?.orderStatus
          )
      ).length;

    const delivered =
      orders.filter(
        (order) =>
          order?.orderStatus ===
          "DELIVERED"
      ).length;

    const cancelled =
      orders.filter(
        (order) =>
          order?.orderStatus ===
          "CANCELLED"
      ).length;

    return {
      pending,
      processing,
      delivered,
      cancelled,
    };
  }, [orders]);

  // =========================================================
  // ORDER STATUS FILTER OPTIONS
  // =========================================================

  const statusOptions = [
    {
      value: "ALL",
      label: "All Status",
    },
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "CONFIRMED",
      label: "Confirmed",
    },
    {
      value: "PROCESSING",
      label: "Processing",
    },
    {
      value: "SHIPPED",
      label: "Shipped",
    },
    {
      value: "DELIVERED",
      label: "Delivered",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
    },
  ];

  // =========================================================
  // PAYMENT FILTER OPTIONS
  // =========================================================

  const paymentOptions = [
    {
      value: "ALL",
      label: "All Payments",
    },
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "PAID",
      label: "Paid",
    },
    {
      value: "FAILED",
      label: "Failed",
    },
  ];

  // =========================================================
  // PAGINATION HELPERS
  // =========================================================

  const getPageNumbers = () => {
    const pages = [];

    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      currentPage - 2
    );

    let endPage = Math.min(
      totalPages,
      startPage + maxVisiblePages - 1
    );

    if (
      endPage - startPage + 1 <
      maxVisiblePages
    ) {
      startPage = Math.max(
        1,
        endPage - maxVisiblePages + 1
      );
    }

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {
      pages.push(page);
    }

    return pages;
  };

  const pageNumbers =
    getPageNumbers();

  // =========================================================
  // PAGINATION DISPLAY
  // =========================================================

  const startItem =
    totalOrders === 0
      ? 0
      : (currentPage - 1) *
          ORDERS_PER_PAGE +
        1;

  const endItem = Math.min(
    currentPage * ORDERS_PER_PAGE,
    totalOrders
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="orders-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="orders-header">
        <div>
          <h1>Orders</h1>

          <p>
            Manage and track customer
            orders
          </p>
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="orders-summary">

        {/* Pending */}

        <div className="order-summary-card">
          <div className="summary-icon pending-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>

          <div>
            <span>Pending</span>

            <strong>
              {summary.pending}
            </strong>
          </div>
        </div>

        {/* Processing */}

        <div className="order-summary-card">
          <div className="summary-icon processing-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div>
            <span>Processing</span>

            <strong>
              {summary.processing}
            </strong>
          </div>
        </div>

        {/* Delivered */}

        <div className="order-summary-card">
          <div className="summary-icon delivered-icon">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>Delivered</span>

            <strong>
              {summary.delivered}
            </strong>
          </div>
        </div>

        {/* Cancelled */}

        <div className="order-summary-card">
          <div className="summary-icon cancelled-icon">
            <i className="bi bi-x-circle"></i>
          </div>

          <div>
            <span>Cancelled</span>

            <strong>
              {summary.cancelled}
            </strong>
          </div>
        </div>
      </div>

      {/* ===================================================
          TOOLBAR
      =================================================== */}

      <div className="orders-toolbar">

        {/* Search */}

        <div className="orders-search">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search orders, customers..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
              title="Clear search"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        {/* Order Status Filter */}

        <div className="orders-filter">
          <i className="bi bi-funnel"></i>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            {statusOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </div>

        {/* Payment Filter */}

        <div className="orders-filter">
          <i className="bi bi-credit-card"></i>

          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(
                e.target.value
              )
            }
          >
            {paymentOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="orders-error">
          <i className="bi bi-exclamation-circle"></i>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              fetchOrders(
                currentPage
              )
            }
          >
            Retry
          </button>
        </div>
      )}

      {/* ===================================================
          TABLE CARD
      =================================================== */}

      <div className="orders-table-card">

        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.length > 0 ? (

                orders.map((order) => {

                  const paymentStatus =
                    String(
                      order?.paymentStatus ||
                        "PENDING"
                    ).toUpperCase();

                  const currentStatus =
                    String(
                      order?.orderStatus ||
                        order?.status ||
                        "PENDING"
                    ).toUpperCase();

                  return (
                    <tr
                      key={order._id}
                    >

                      {/* ORDER ID */}

                      <td>
                        <span className="order-id">
                          {getOrderId(
                            order
                          )}
                        </span>
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        <div className="customer-cell">

                          <div className="customer-avatar">
                            {getCustomerName(
                              order
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="customer-info">

                            <strong>
                              {getCustomerName(
                                order
                              )}
                            </strong>

                            <span>
                              {getCustomerEmail(
                                order
                              ) !== "—"
                                ? getCustomerEmail(
                                    order
                                  )
                                : getCustomerPhone(
                                    order
                                  )}
                            </span>

                          </div>
                        </div>
                      </td>

                      {/* DATE */}

                      <td>
                        <span className="order-date">
                          {formatDate(
                            order?.createdAt ||
                              order?.updatedAt
                          )}
                        </span>
                      </td>

                      {/* ITEMS */}

                      <td>
                        <span className="item-count">
                          {getItemCount(
                            order
                          )}
                        </span>
                      </td>

                      {/* TOTAL */}

                      <td>
                        <strong className="order-total">
                          {formatCurrency(
                            order?.finalAmount ??
                              order?.totalAmount ??
                              order?.total ??
                              0
                          )}
                        </strong>
                      </td>

                      {/* PAYMENT STATUS */}

                      <td>
                        <span
                          className={`payment-status ${getPaymentStatusClass(
                            paymentStatus
                          )}`}
                        >
                          <span className="status-dot"></span>

                          {getPaymentStatusLabel(
                            paymentStatus
                          )}
                        </span>
                      </td>

                      {/* ORDER STATUS
                          Display only.
                          Update happens in Order Details.
                      */}

                      <td>
                        <span
                          className={`order-status-badge ${getStatusClass(
                            currentStatus
                          )}`}
                        >
                          <span className="status-dot"></span>

                          {getStatusLabel(
                            currentStatus
                          )}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td>
                        <button
                          type="button"
                          className="view-order-btn"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order._id}`
                            )
                          }
                          title="View Order"
                          aria-label="View Order"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="8"
                    className="orders-empty"
                  >
                    <div className="empty-orders">

                      <i className="bi bi-inbox"></i>

                      <h3>
                        No orders found
                      </h3>

                      <p>
                        {search ||
                        statusFilter !==
                          "ALL" ||
                        paymentFilter !==
                          "ALL"
                          ? "Try changing your search or filters."
                          : "There are no orders available yet."}
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* =================================================
            TABLE FOOTER
        ================================================= */}

        {totalOrders > 0 && (
          <div className="orders-table-footer">

            <span>
              Showing{" "}

              <strong>
                {startItem}
              </strong>

              {" - "}

              <strong>
                {endItem}
              </strong>

              {" "}of{" "}

              <strong>
                {totalOrders}
              </strong>

              {" "}orders
            </span>

          </div>
        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {totalPages > 1 && (
          <div className="orders-pagination">

            {/* PREVIOUS */}

            <button
              type="button"
              className="pagination-btn"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
            >
              <i className="bi bi-chevron-left"></i>

              Previous
            </button>

            {/* PAGE NUMBERS */}

            <div className="pagination-info">

              {pageNumbers.map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-number ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>
                )
              )}

            </div>

            {/* NEXT */}

            <button
              type="button"
              className="pagination-btn"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
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
};

export default Orders;

