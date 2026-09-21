import "./Orders.css";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "FAILED",
];

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const ordersPerPage = 10;

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return (
      String(status).charAt(0).toUpperCase() +
      String(status).slice(1).toLowerCase()
    );
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setOrders([]);
        return;
      }

      const params = {
        page: currentPage,
        limit: ordersPerPage,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter) {
        params.orderStatus = statusFilter;
      }

      if (paymentStatusFilter) {
        params.paymentStatus = paymentStatusFilter;
      }

      const response = await axios.get(
        `${API_URL}/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      const data = response.data;

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : []
      );

      setTotalPages(
        Number(data?.totalPages || 1)
      );

      setTotalOrders(
        Number(data?.totalOrders || 0)
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
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [
    currentPage,
    search,
    statusFilter,
    paymentStatusFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    paymentStatusFilter,
  ]);

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

  const pendingOrders = orders.filter(
    (order) =>
      String(
        order.orderStatus ||
          order.status ||
          ""
      ).toUpperCase() === "PENDING"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      String(
        order.orderStatus ||
          order.status ||
          ""
      ).toUpperCase() === "PROCESSING"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      String(
        order.orderStatus ||
          order.status ||
          ""
      ).toUpperCase() === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      String(
        order.orderStatus ||
          order.status ||
          ""
      ).toUpperCase() === "CANCELLED"
  ).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="orders-content">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>
              Manage and track customer orders
            </p>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="order-cards">
          <div className="order-card">
            <span>Pending Orders</span>
            <h2>{pendingOrders}</h2>
          </div>

          <div className="order-card">
            <span>Processing</span>
            <h2>{processingOrders}</h2>
          </div>

          <div className="order-card">
            <span>Delivered</span>
            <h2>{deliveredOrders}</h2>
          </div>

          <div className="order-card">
            <span>Cancelled</span>
            <h2>{cancelledOrders}</h2>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="orders-tools">
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">
              All Status
            </option>

            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
              >
                {formatStatus(status)}
              </option>
            ))}
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(event) =>
              setPaymentStatusFilter(
                event.target.value
              )
            }
          >
            <option value="">
              All Payment Status
            </option>

            {PAYMENT_STATUS_OPTIONS.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {formatStatus(status)}
                </option>
              )
            )}
          </select>
        </div>

        {/* Total Orders */}
        <div style={{ margin: "15px 0" }}>
          Total Orders: <strong>{totalOrders}</strong>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "15px",
              margin: "20px 0",
              color: "#b00020",
              background: "#ffecec",
              border: "1px solid #ffb3b3",
            }}
          >
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="orders-table-container">
          {loading ? (
            <p style={{ padding: "20px" }}>
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p style={{ padding: "20px" }}>
              No orders found.
            </p>
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
                {orders.map((order) => {
                  const customerName =
                    order.user?.name ||
                    order.user?.fullName ||
                    order.user?.email ||
                    "Customer";

                  const orderDate = order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-";

                  const itemCount =
                    order.items?.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.quantity || 0
                        ),
                      0
                    ) || 0;

                  const total =
                    order.finalAmount ??
                    order.totalAmount ??
                    order.total ??
                    0;

                  const currentStatus =
                    String(
                      order.orderStatus ||
                        order.status ||
                        "PENDING"
                    ).toUpperCase();

                  return (
                    <tr key={order._id}>
                      <td className="order-id">
                        #{order._id?.slice(-6)}
                      </td>

                      <td>{customerName}</td>

                      <td>{orderDate}</td>

                      <td>{itemCount}</td>

                      <td className="order-total">
                        ?
                        {Number(
                          total
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <select
                          value={currentStatus}
                          disabled={
                            updatingId ===
                            order._id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              order._id,
                              event.target
                                .value
                            )
                          }
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {formatStatus(
                                  status
                                )}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td>
                        <button
                          className="view-btn"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-6">
            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(page - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {currentPage} of{" "}
              {totalPages}
            </span>

            <button
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
                currentPage === totalPages
              }
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
