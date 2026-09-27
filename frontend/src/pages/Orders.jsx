import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Orders.css";

const API_URL = "http://localhost:5000/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FORMAT STATUS =================
  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // ================= PRODUCT IMAGE =================
  const getProductImage = (item) => {
    const image =
      item?.product?.images?.[0] ||
      item?.product?.image ||
      item?.image ||
      item?.productImage;

    if (!image) {
      return "/images/product-placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `http://localhost:5000/${image}`;
  };

  // ================= PRODUCT NAME =================
  const getProductName = (item) => {
    return (
      item?.product?.name ||
      item?.productName ||
      item?.name ||
      "Product"
    );
  };

  // ================= PRODUCT PRICE =================
  const getProductPrice = (item) => {
    return (
      item?.price ??
      item?.salePrice ??
      item?.regularPrice ??
      item?.product?.salePrice ??
      item?.product?.price ??
      0
    );
  };

  // ================= PRODUCT SIZE =================
  const getProductSize = (item) => {
    return item?.size || item?.selectedSize || "N/A";
  };

  // ================= QUANTITY =================
  const getQuantity = (item) => {
    return item?.quantity || 1;
  };

  // ================= TRACK ORDER =================
  const handleTrackOrder = (order) => {
    navigate(`/track-order/${order._id}`, {
      state: {
        order,
      },
    });
  };

  // ================= DOWNLOAD INVOICE =================
  const handleDownloadInvoice = async (orderId) => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage("Invoice downloaded successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error("Download invoice error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to download invoice."
      );

      setTimeout(() => {
        setError("");
      }, 2500);
    }
  };
  // ================= CANCEL ORDER =================
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // IMPORTANT:
      // Customer/Admin cancellation endpoint
      // Do NOT use /status here because that route is admin-only.
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder = response.data.order;

      // Update cancelled order in current page
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );

      setMessage("Order cancelled successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error("Cancel order error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to cancel the order."
      );

      setTimeout(() => {
        setError("");
      }, 2500);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-container">
            <div className="orders-message">
              Loading your orders...
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ================= PAGE =================
  return (
    <>
      <Navbar />

      <main className="orders-page">
        <div className="orders-container">

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="orders-message success">
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="orders-message error">
              {error}
            </div>
          )}

          {/* NO ORDERS */}
          {orders.length === 0 ? (
            <div className="orders-message">
              <h3>No orders found</h3>

              <p>
                You haven't placed any orders yet.
              </p>

              <button
                className="orders-back-button"
                onClick={() => navigate(-1)}
              >
                ← BACK
              </button>
            </div>
          ) : (
            <section className="orders-content">

              {/* HEADER */}
              <div className="orders-header">
                <div className="product-heading">
                  PRODUCT
                </div>

                <div className="status-heading">
                  STATUS
                </div>
              </div>

              {/* ORDERS */}
              {orders.map((order) => {
                const items = order.items || [];
                const firstItem = items[0];

                if (!firstItem) return null;

                const status =
                  order.orderStatus ||
                  order.status ||
                  "PENDING";

                const normalizedStatus = status
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                const itemCount = items.length;

                return (
                  <div
                    className="order-item"
                    key={order._id}
                  >
                    {/* ================= PRODUCT ================= */}
                    <div className="product-section">
                      <div className="product-item">

                        <img
                          src={getProductImage(firstItem)}
                          alt={getProductName(firstItem)}
                          className="product-image"
                          onError={(e) => {
                            e.target.src =
                              "/images/product-placeholder.jpg";
                          }}
                        />

                        <div className="product-details">

                          <h3>
                            {getProductName(firstItem)}
                          </h3>

                          <p className="product-price">
                            ₹
                            {Number(
                              getProductPrice(firstItem)
                            ).toLocaleString("en-IN")}
                          </p>

                          <p className="product-meta">
                            Size: {getProductSize(firstItem)}
                            &nbsp; | &nbsp;
                            Quantity: {getQuantity(firstItem)}
                          </p>

                          {itemCount > 1 && (
                            <p className="product-meta">
                              + {itemCount - 1} more{" "}
                              {itemCount - 1 === 1
                                ? "item"
                                : "items"}
                            </p>
                          )}

                          <p className="product-meta order-id">
                            Order #{order._id?.slice(-8)}
                          </p>

                        </div>
                      </div>
                    </div>

                    {/* ================= STATUS ================= */}
                    <div className="status-section">

                      <div
                        className={`status ${normalizedStatus}`}
                      >
                        {formatStatus(status)}
                      </div>

                      {/* TRACK ORDER */}
                      <button
                        className="track-button"
                        onClick={() =>
                          handleTrackOrder(order)
                        }
                      >
                        TRACK YOUR ORDER
                      </button>

                      {/* DOWNLOAD INVOICE */}
                      <button
                        className="invoice-button"
                        onClick={() =>
                          handleDownloadInvoice(order._id)
                        }
                      >
                        DOWNLOAD INVOICE
                      </button>
                      {/* CANCEL ORDER */}
                      {status.toUpperCase() !== "CANCELLED" &&
                        status.toUpperCase() !== "DELIVERED" &&
                        (
                          <button
                            className="cancel-order-btn"
                            onClick={() =>
                              handleCancelOrder(order._id)
                            }
                          >
                            CANCEL ORDER
                          </button>
                        )}

                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* BACK BUTTON */}
          {orders.length > 0 && (
            <button
              className="orders-back-button"
              onClick={() => navigate(-1)}
            >
              ← BACK
            </button>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Orders;



