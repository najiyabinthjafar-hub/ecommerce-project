import "./Orders.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/orders/all`);

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders(response.data?.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setError(
        error.response?.data?.message || "Failed to load orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // FORMAT STATUS
  // =========================

  const formatStatus = (status) => {
    if (!status) return "Pending";

    const value = String(status).toLowerCase();

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName =
        order.user?.name ||
        order.user?.fullName ||
        order.user?.email ||
        "";

      const orderId = String(order._id || "");

      const searchValue = search.toLowerCase();

      const matchesSearch =
        orderId.toLowerCase().includes(searchValue) ||
        String(customerName).toLowerCase().includes(searchValue);

      const orderStatus = formatStatus(order.orderStatus);

      const matchesStatus =
        statusFilter === "All Status" ||
        orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // =========================
  // SUMMARY COUNTS
  // =========================

  const pendingOrders = orders.filter(
    (order) =>
      String(order.orderStatus).toLowerCase() === "pending"
  ).length;

  const processingOrders = orders.filter((order) => {
    const status = String(order.orderStatus).toLowerCase();

    return status === "processing" || status === "confirmed";
  }).length;

  const deliveredOrders = orders.filter(
    (order) =>
      String(order.orderStatus).toLowerCase() === "delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      String(order.orderStatus).toLowerCase() === "cancelled"
  ).length;

  return (
    <main className="orders-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders</p>
        </div>
      </div>

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="orders-summary">

        <div className="summary-item">
          <div className="summary-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>

          <div className="summary-content">
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div className="summary-content">
            <span>Processing</span>
            <strong>{processingOrders}</strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">
            <i className="bi bi-check-circle"></i>
          </div>

          <div className="summary-content">
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">
            <i className="bi bi-x-circle"></i>
          </div>

          <div className="summary-content">
            <span>Cancelled</span>
            <strong>{cancelledOrders}</strong>
          </div>
        </div>

      </div>

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="orders-toolbar">

        <div className="orders-search">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="orders-filters">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Confirmed</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <p className="orders-error">
          {error}
        </p>
      )}

      {/* =========================
          ORDERS CARD
      ========================= */}

      <div className="orders-card">

        {/* CARD HEADER */}

        <div className="orders-card-header">

          <div>
            <h2>All Orders</h2>

            <p>
              View and manage customer orders
            </p>
          </div>

          <span className="order-count">
            {filteredOrders.length} Orders
          </span>

        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="orders-table-wrapper">

          {loading ? (
            <div className="orders-message">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-message">
              No orders found.
            </div>
          ) : (
            <table className="orders-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.map((order) => {

                  const customerName =
                    order.user?.name ||
                    order.user?.fullName ||
                    order.user?.email ||
                    "Unknown Customer";

                  const customerInitial =
                    String(customerName)
                      .charAt(0)
                      .toUpperCase();

                  const orderDate = order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-";

                  const itemCount =
                    order.items?.reduce(
                      (total, item) =>
                        total +
                        Number(item.quantity || 0),
                      0
                    ) || 0;

                  const total =
                    order.finalAmount ??
                    order.totalAmount ??
                    order.total ??
                    0;

                  const status = formatStatus(
                    order.orderStatus
                  );

                  return (
                    <tr key={order._id}>

                      {/* ORDER ID */}

                      <td className="order-id">
                        #{order._id?.slice(-6)}
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        <div className="customer-cell">

                          <div className="customer-avatar">
                            {customerInitial}
                          </div>

                          <span>
                            {customerName}
                          </span>

                        </div>
                      </td>

                      {/* DATE */}

                      <td>
                        {orderDate}
                      </td>

                      {/* ITEMS */}

                      <td>
                        {itemCount}
                      </td>

                      {/* TOTAL */}

                      <td className="order-total">
                        ₹
                        {Number(total).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`order-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td>
                        <button
                          className="view-order-btn"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order._id}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </main>
  );
}

export default Orders;