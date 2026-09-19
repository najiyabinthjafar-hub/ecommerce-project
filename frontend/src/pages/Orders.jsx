import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Orders.css";

const API_URL = "http://localhost:5000/api";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/orders?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDERS RESPONSE:", response.data);

      // Backend response safe handling
      const ordersData =
        response.data?.orders ||
        response.data?.data ||
        response.data;

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );
    } catch (err) {
      console.error("Error fetching orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TRACK ORDER
  // =========================
  const handleTrackOrder = (order) => {
    navigate(`/track-order/${order._id}`, {
      state: {
        order: order,
      },
    });
  };

  // =========================
  // CANCEL ORDER
  // =========================
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        {
          orderStatus: "CANCELLED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order cancelled successfully!");

      // Refresh orders after cancellation
      fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel order."
      );
    }
  };

  // =========================
  // FORMAT STATUS
  // =========================
  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =========================
  // PRODUCT NAME
  // =========================
  const getProductName = (item) => {
    if (item?.product?.name) {
      return item.product.name;
    }

    if (item?.productName) {
      return item.productName;
    }

    return "Product";
  };

  // =========================
  // PRODUCT IMAGE
  // =========================
  const getProductImage = (item) => {
    if (item?.image) {
      return item.image;
    }

    if (item?.product?.image) {
      return item.product.image;
    }

    if (
      item?.product?.images &&
      item.product.images.length > 0
    ) {
      return item.product.images[0];
    }

    return "";
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-loading">
            Loading your orders...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // LOGIN CHECK
  // =========================
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-login">
            <p>MY ACCOUNT</p>

            <h1>My Orders</h1>

            <span>
              Please login to view your orders.
            </span>

            <Link
              to="/login"
              className="orders-login-btn"
            >
              LOGIN
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-error">
            <p>{error}</p>

            <button
              className="orders-retry"
              onClick={fetchOrders}
            >
              TRY AGAIN
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // EMPTY ORDERS
  // =========================
  if (orders.length === 0) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-empty">
            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/shop"
              className="orders-shop-btn"
            >
              SHOP NOW
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // ORDERS PAGE
  // =========================
  return (
    <>
      <Navbar />

      <main className="orders-page">

        {/* =========================
            TABLE HEADER
        ========================= */}
        <div className="orders-table-header">
          <span>PRODUCT</span>
          <span>STATUS</span>
        </div>

        {/* =========================
            ORDERS LIST
        ========================= */}
        <div className="orders-list">

          {orders.map((order) => {
            const firstItem = order.items?.[0];

            const productName =
              getProductName(firstItem);

            const productImage =
              getProductImage(firstItem);

            const quantity =
              firstItem?.quantity || 1;

            const size =
              firstItem?.size;

            const status =
              order.orderStatus || "PENDING";

            return (
              <div
                className="order-row"
                key={order._id}
              >

                {/* =========================
                    PRODUCT SECTION
                ========================= */}
                <div className="order-product-section">

                  <div className="order-product">

                    {/* PRODUCT IMAGE */}
                    <div className="order-image">

                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                        />
                      ) : (
                        <span>
                          No Image
                        </span>
                      )}

                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="order-details">

                      <h3>
                        {productName}
                      </h3>

                      <p>
                        ₹{firstItem?.price || 0}
                      </p>

                      <span>
                        Quantity: {quantity}

                        {size
                          ? ` • Size: ${size}`
                          : ""}
                      </span>

                    </div>

                  </div>

                </div>

                {/* =========================
                    STATUS SECTION
                ========================= */}
                <div className="order-status-section">

                  <span
                    className={`order-status ${status
                      .toLowerCase()
                      .replace(/_/g, "-")}`}
                  >
                    {formatStatus(status)}
                  </span>

                  {/* TRACK ORDER BUTTON */}
                  <button
                    className="track-order-btn"
                    onClick={() =>
                      handleTrackOrder(order)
                    }
                  >
                    Track Your Order
                  </button>

                  {/* CANCEL ORDER BUTTON */}
                  {status !== "CANCELLED" &&
                    status !== "DELIVERED" && (
                      <button
                        className="cancel-order-btn"
                        onClick={() =>
                          handleCancelOrder(
                            order._id
                          )
                        }
                      >
                        Cancel Order
                      </button>
                    )}

                </div>

              </div>
            );
          })}

        </div>
      </main>

      <Footer />
    </>
  );
};

export default Orders;