import "./Orders.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await axios.get(
          `${API_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(
          response.data?.order ||
            response.data?.data ||
            response.data
        );
      } catch (error) {
        console.error("Failed to fetch order:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  if (loading) {
    return (
      <main className="orders-content">
        <p>Loading order details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-content">
        <button
          className="view-btn"
          onClick={() => navigate("/admin/orders")}
        >
          ← Back to Orders
        </button>

        <p style={{ color: "red", marginTop: "20px" }}>
          {error}
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="orders-content">
        <button
          className="view-btn"
          onClick={() => navigate("/admin/orders")}
        >
          ← Back to Orders
        </button>

        <p style={{ marginTop: "20px" }}>
          Order not found.
        </p>
      </main>
    );
  }

  const customerName =
    order.user?.name ||
    order.user?.fullName ||
    order.user?.email ||
    "Unknown Customer";

  const customerEmail =
    order.user?.email || "-";

  const customerPhone =
    order.user?.phone || "-";

  const total =
    order.finalAmount ??
    order.totalAmount ??
    order.total ??
    0;

  const status = formatStatus(
    order.orderStatus || order.status
  );

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN")
    : "-";

  return (
    <main className="orders-content">
      <div className="orders-header">
        <div>
          <h1>Order Details</h1>
          <p>
            Order #{order._id?.slice(-6)}
          </p>
        </div>

        <button
          className="view-btn"
          onClick={() => navigate("/admin/orders")}
        >
          ← Back to Orders
        </button>
      </div>

      {/* Order Information */}
      <div className="order-card">
        <h2>Order Information</h2>

        <p>
          <strong>Order ID:</strong>{" "}
          #{order._id}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {orderDate}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {status}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          ₹{Number(total).toLocaleString("en-IN")}
        </p>
      </div>

      {/* Customer Information */}
      <div
        className="order-card"
        style={{ marginTop: "20px" }}
      >
        <h2>Customer Information</h2>

        <p>
          <strong>Name:</strong>{" "}
          {customerName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {customerEmail}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {customerPhone}
        </p>
      </div>

      {/* Products */}
      <div
        className="orders-table-container"
        style={{ marginTop: "20px" }}
      >
        <h2 style={{ padding: "20px 20px 0" }}>
          Order Items
        </h2>

        {order.items?.length ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, index) => {
                const product =
                  item.product;

                const productName =
                  product?.name ||
                  product?.title ||
                  "Product";

                const price =
                  item.price ??
                  product?.price ??
                  0;

                const quantity =
                  Number(item.quantity || 0);

                return (
                  <tr key={item._id || index}>
                    <td>
                      {productName}
                    </td>

                    <td>
                      {quantity}
                    </td>

                    <td>
                      ₹
                      {Number(price).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      ₹
                      {Number(
                        price * quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: "20px" }}>
            No items found.
          </p>
        )}
      </div>
    </main>
  );
}

export default OrderDetails;