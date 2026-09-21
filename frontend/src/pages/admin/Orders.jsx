import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const API_URL = "http://localhost:5000/api";

// =========================================================
// STATUS LABELS
// =========================================================

const statusLabels = {
  PENDING_PAYMENT: "Pending Payment",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
};

const statusClassMap = {
  PENDING_PAYMENT: "pending",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out-for-delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
  REFUNDED: "refunded",
};

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
// COMPONENT
// =========================================================

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.get(
        `${API_URL}/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderList =
        response.data?.orders ||
        response.data?.data ||
        response.data ||
        [];

      setOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch admin orders:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchOrders();
  }, []);

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
    return order?.user?.email || "—";
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

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return (
      statusLabels[status] ||
      String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
    );
  };

  // =========================================================
  // FORMAT HELPERS
  // =========================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
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
        total + Number(item?.quantity || 0),
      0
    );
  };

  const getOrderId = (order) => {
    if (!order?._id) return "—";

    return `ORD-${String(order._id)
      .slice(-6)
      .toUpperCase()}`;
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder =
        response.data?.order;

      if (updatedOrder) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? updatedOrder
              : order
          )
        );
      } else {
        await fetchOrders();
      }
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const orderId =
        getOrderId(order).toLowerCase();

      const customerName =
        getCustomerName(order).toLowerCase();

      const customerEmail =
        getCustomerEmail(order).toLowerCase();

      const customerPhone =
        getCustomerPhone(order).toLowerCase();

      const matchesSearch =
        !query ||
        orderId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        customerPhone.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        order?.orderStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [orders, search, statusFilter]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary = useMemo(() => {
    const pending = orders.filter((order) =>
      [
        "PENDING_PAYMENT",
        "PENDING",
      ].includes(order?.orderStatus)
    ).length;

    const processing = orders.filter((order) =>
      [
        "CONFIRMED",
        "PROCESSING",
      ].includes(order?.orderStatus)
    ).length;

    const delivered = orders.filter(
      (order) =>
        order?.orderStatus === "DELIVERED"
    ).length;

    const cancelled = orders.filter(
      (order) =>
        order?.orderStatus === "CANCELLED"
    ).length;

    return {
      pending,
      processing,
      delivered,
      cancelled,
    };
  }, [orders]);

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const statusOptions = [
    {
      value: "ALL",
      label: "All Status",
    },
    {
      value: "PENDING_PAYMENT",
      label: "Pending Payment",
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
      value: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
    },
    {
      value: "DELIVERED",
      label: "Delivered",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
    },
    {
      value: "RETURNED",
      label: "Returned",
    },
    {
      value: "REFUNDED",
      label: "Refunded",
    },
  ];

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="orders-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage and track customer orders
          </p>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="orders-summary">

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

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="orders-toolbar">

        <div className="orders-search">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search orders, customers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

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
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="orders-error">
          <i className="bi bi-exclamation-circle"></i>

          <span>{error}</span>

          <button onClick={fetchOrders}>
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          ORDERS TABLE
      ===================================================== */}

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

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {

                  const paymentStatus =
                    order?.paymentStatus ||
                    "PENDING";

                  const currentStatus =
                    String(
                      order?.orderStatus ||
                        order?.status ||
                        "PENDING"
                    ).toUpperCase();

                  return (
                    <tr key={order._id}>

                      {/* ORDER ID */}

                      <td>
                        <span className="order-id">
                          {getOrderId(order)}
                        </span>
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        <div className="customer-cell">

                          <div className="customer-avatar">
                            {getCustomerName(order)
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
                          {getItemCount(order)}
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

                      {/* PAYMENT */}

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

                      {/* ORDER STATUS */}

                      <td>
                        <select
                          className={`order-status-select ${getStatusClass(
                            currentStatus
                          )}`}
                          value={currentStatus}
                          disabled={
                            updatingId ===
                            order._id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              order._id,
                              event.target.value
                            )
                          }
                        >
                          {statusOptions
                            .filter(
                              (option) =>
                                option.value !==
                                "ALL"
                            )
                            .map((option) => (
                              <option
                                key={option.value}
                                value={
                                  option.value
                                }
                              >
                                {option.label}
                              </option>
                            ))}
                        </select>
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
                        statusFilter !== "ALL"
                          ? "Try changing your search or filter."
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

        {filteredOrders.length > 0 && (
          <div className="orders-table-footer">
            <span>
              Showing{" "}
              <strong>
                {filteredOrders.length}
              </strong>{" "}
              of{" "}
              <strong>
                {orders.length}
              </strong>{" "}
              orders
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;