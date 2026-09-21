import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Orders.css";

const API_URL = "http://localhost:5000/api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH ORDERS =================

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

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= TRACK ORDER =================

  const handleTrackOrder = (order) => {
    navigate(`/track-order/${order._id}`, {
      state: {
        order: order,
      },
    });
  };

  // ================= CANCEL ORDER =================

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
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

      console.log(
        "CANCEL ORDER RESPONSE:",
        response.data
      );

      const updatedOrder =
        response.data?.order ||
        response.data?.data;

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

      alert("Your order has been cancelled.");
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to cancel order."
      );
    }
  };

  // ================= FORMAT STATUS =================

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ================= PRODUCT NAME =================

  const getProductName = (item) => {
    if (item?.product?.name) {
      return item.product.name;
    }

    if (item?.productName) {
      return item.productName;
    }

    if (item?.name) {
      return item.name;
    }

    return "Product";
  };

  // ================= PRODUCT IMAGE =================

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

  // ================= LOADING =================

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

  // ================= LOGIN CHECK =================

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

  // ================= ERROR =================

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

  // ================= EMPTY ORDERS =================

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

  // ================= ORDERS PAGE =================

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <div className="orders-table-header">
          <span>PRODUCT</span>
          <span>STATUS</span>
        </div>

        <div className="orders-list">
          {orders.map((order) => {
            const status =
              order.orderStatus || "PENDING";

            const firstItem = order.items?.[0];

            const productName =
              getProductName(firstItem);

            const productImage =
              getProductImage(firstItem);

            return (
              <article
                className="order-row"
                key={order._id}
              >
                {/* ================= ORDER HEADER ================= */}

                <div className="order-header">
                  <div>
                    <span>ORDER ID</span>

                    <strong>
                      #{order._id}
                    </strong>
                  </div>

                  <div>
                    <span>DATE</span>

                    <strong>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </strong>
                  </div>
                </div>

                {/* ================= PRODUCT SECTION ================= */}

                <div className="order-product-section">
                  <div className="order-product">
                    <div className="order-image">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="order-details">
                      <h3>
                        {productName}
                      </h3>

                      <p>
                        ₹
                        {Number(
                          firstItem?.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <span>
                        Quantity:{" "}
                        {firstItem?.quantity || 1}

                        {firstItem?.size
                          ? ` • Size: ${firstItem.size}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* ================= STATUS ================= */}

                  <div className="order-status-section">
                    <span
                      className={`order-status ${status
                        .toLowerCase()
                        .replace(/_/g, "-")}`}
                    >
                      {formatStatus(status)}
                    </span>

                    <button
                      className="track-order-btn"
                      onClick={() =>
                        handleTrackOrder(order)
                      }
                    >
                      Track Your Order
                    </button>
                  </div>
                </div>

                {/* ================= ALL ORDER PRODUCTS ================= */}

                {order.items?.length > 1 && (
                  <div className="order-products">
                    {order.items.map(
                      (item, index) => {
                        const product =
                          item.product || {};

                        const itemName =
                          product.name ||
                          item.name ||
                          getProductName(item);

                        const itemImage =
                          product.images?.[0] ||
                          product.image ||
                          item.image ||
                          "";

                        return (
                          <div
                            className="order-product"
                            key={`${order._id}-${index}`}
                          >
                            <div className="order-product-image">
                              {itemImage ? (
                                <img
                                  src={itemImage}
                                  alt={itemName}
                                />
                              ) : (
                                <span>
                                  No Image
                                </span>
                              )}
                            </div>

                            <div className="order-product-info">
                              <h3>
                                {itemName}
                              </h3>

                              {item.size && (
                                <p>
                                  Size: {item.size}
                                </p>
                              )}

                              <p>
                                Quantity:{" "}
                                {item.quantity || 1}
                              </p>
                            </div>

                            <strong>
                              ₹
                              {(
                                (item.price || 0) *
                                (item.quantity || 1)
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

                {/* ================= ORDER FOOTER ================= */}

                <div className="order-footer">
                  <div>
                    <span>PAYMENT</span>

                    <strong>
                      {order.paymentMethod ||
                        "COD"}
                    </strong>
                  </div>

                  <div>
                    <span>TOTAL</span>

                    <strong>
                      ₹
                      {Number(
                        order.finalAmount ??
                          order.totalAmount ??
                          order.total ??
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </div>

                {/* ================= ORDER ACTIONS ================= */}

                <div className="order-actions">
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
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Orders;