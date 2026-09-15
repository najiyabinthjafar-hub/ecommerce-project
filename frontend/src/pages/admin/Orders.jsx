import "./Orders.css";
import AdminSidebar from "../../components/admin/AdminSidebar";
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        console.log("ADMIN TOKEN EXISTS:", !!token);
        console.log(
          "ADMIN TOKEN LENGTH:",
          token ? token.length : 0
        );

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

        console.log("ADMIN ORDERS RESPONSE:", response.data);

        const orderList =
          response.data?.orders ||
          response.data?.data ||
          response.data ||
          [];

        setOrders(
          Array.isArray(orderList) ? orderList : []
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

    fetchOrders();
  }, []);

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName =
        order.user?.name ||
        order.user?.fullName ||
        order.user?.email ||
        "";

      const orderId = order._id || "";
      const searchText = search.toLowerCase();

      const matchesSearch =
        orderId.toLowerCase().includes(searchText) ||
        customerName.toLowerCase().includes(searchText);

      const orderStatus = formatStatus(
        order.orderStatus || order.status
      );

      const matchesStatus =
        statusFilter === "All Status" ||
        orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pendingOrders = orders.filter((order) => {
    const status = String(
      order.orderStatus || order.status || ""
    ).toLowerCase();

    return status === "pending";
  }).length;

  const processingOrders = orders.filter((order) => {
    const status = String(
      order.orderStatus || order.status || ""
    ).toLowerCase();

    return (
      status === "processing" ||
      status === "confirmed"
    );
  }).length;

  const deliveredOrders = orders.filter((order) => {
    const status = String(
      order.orderStatus || order.status || ""
    ).toLowerCase();

    return status === "delivered";
  }).length;

  const cancelledOrders = orders.filter((order) => {
    const status = String(
      order.orderStatus || order.status || ""
    ).toLowerCase();

    return status === "cancelled";
  }).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="orders-content">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>Manage and track customer orders</p>
          </div>
        </div>

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

        <div className="orders-tools">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
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
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Confirmed</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

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

        <div className="orders-table-container">
          {loading ? (
            <p style={{ padding: "20px" }}>
              Loading orders...
            </p>
          ) : filteredOrders.length === 0 ? (
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
                {filteredOrders.map((order) => {
                  const customerName =
                    order.user?.name ||
                    order.user?.fullName ||
                    order.user?.email ||
                    "Unknown Customer";

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
                    order.orderStatus ||
                      order.status
                  );

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
                        {Number(total).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <span
                          className={`status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
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
      </main>
    </div>
  );
}

export default Orders;
