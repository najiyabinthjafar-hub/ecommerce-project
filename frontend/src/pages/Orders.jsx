import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Orders.css";

const API_URL = "http://localhost:5000/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================================
  // FETCH ORDERS
  // =========================================================
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Orders API response:",
          response.data
        );

        setOrders(
          response.data.orders ||
            response.data.data ||
            []
        );
      } catch (error) {
        console.error(
          "Fetch orders error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // =========================================================
  // FORMAT STATUS
  // =========================================================
  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =========================================================
  // PRODUCT IMAGE
  // =========================================================
  const getProductImage = (product) => {
    if (!product) {
      return "/images/placeholder.png";
    }

    if (
      product.images &&
      product.images.length > 0
    ) {
      const image = product.images[0];

      if (typeof image === "string") {
        if (image.startsWith("http")) {
          return image;
        }

        return `${API_URL.replace(
          "/api",
          ""
        )}/${image.startsWith("/")
          ? image.slice(1)
          : image}`;
      }

      if (image?.url) {
        if (image.url.startsWith("http")) {
          return image.url;
        }

        return `${API_URL.replace(
          "/api",
          ""
        )}${image.url}`;
      }
    }

    if (product.image) {
      if (
        product.image.startsWith("http")
      ) {
        return product.image;
      }

      return `${API_URL.replace(
        "/api",
        ""
      )}${product.image}`;
    }

    return "/images/placeholder.png";
  };

  // =========================================================
  // PRODUCT NAME
  // =========================================================
  const getProductName = (product) => {
    return (
      product?.name ||
      product?.title ||
      "Product"
    );
  };

  // =========================================================
  // PRODUCT PRICE
  // =========================================================
  const getProductPrice = (item) => {
    if (
      item?.price !== undefined &&
      item?.price !== null
    ) {
      return Number(item.price);
    }

    if (
      item?.product?.salePrice !== undefined &&
      item?.product?.salePrice !== null &&
      item.product.salePrice > 0
    ) {
      return Number(
        item.product.salePrice
      );
    }

    return Number(
      item?.product?.regularPrice || 0
    );
  };

  // =========================================================
  // PRODUCT SIZE
  // =========================================================
  const getProductSize = (item) => {
    return (
      item?.size ||
      item?.selectedSize ||
      item?.variant?.size ||
      "N/A"
    );
  };

  // =========================================================
  // TRACK ORDER
  // =========================================================
  const handleTrackOrder = (order) => {
    navigate(
      `/track-order/${order._id}`,
      {
        state: {
          order: order,
        },
      }
    );
  };

  // =========================================================
  // CANCEL ORDER
  // =========================================================
  const handleCancelOrder = async (
    orderId
  ) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response =
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

      const updatedOrder =
        response.data.order ||
        response.data.data;

      setOrders(
        (previousOrders) =>
          previousOrders.map(
            (order) =>
              order._id === orderId
                ? updatedOrder
                : order
          )
      );

      alert(
        "Your order has been cancelled."
      );
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

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <section className="orders-heading">

            <p>YOUR ACCOUNT</p>

            <h1>MY ORDERS</h1>

            <span>
              Loading your orders...
            </span>

          </section>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <>
      <Navbar />

      <main className="orders-page">

        <div className="orders-container">

          {/* =================================================
              HEADING
          ================================================= */}
          <section className="orders-heading">

            <p>YOUR ACCOUNT</p>

            <h1>MY ORDERS</h1>

            <span>
              View your recent orders and
              order details.
            </span>

          </section>

          {/* =================================================
              ERROR
          ================================================= */}
          {error && (
            <section className="orders-empty">

              <h2>{error}</h2>

            </section>
          )}

          {/* =================================================
              NO ORDERS
          ================================================= */}
          {!error &&
            orders.length === 0 && (
              <section className="orders-empty">

                <h2>
                  No orders yet
                </h2>

                <p>
                  You haven't placed any
                  orders yet.
                </p>

                <Link to="/shop">
                  START SHOPPING
                </Link>

              </section>
            )}

          {/* =================================================
              ORDERS
          ================================================= */}
          {!error &&
            orders.length > 0 && (
              <section className="orders-list">

                {orders.map((order) => {

                  const status =
                    order.orderStatus ||
                    "PENDING";

                  const normalizedStatus =
                    status.toUpperCase();

                  return (
                    <article
                      className="order-card"
                      key={order._id}
                    >

                      {/* =====================================
                          ORDER HEADER
                      ===================================== */}
                      <div className="order-header">

                        <div>
                          <span>
                            ORDER ID
                          </span>

                          <strong>
                            #{order._id}
                          </strong>
                        </div>

                        <div>
                          <span>
                            DATE
                          </span>

                          <strong>
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            STATUS
                          </span>

                          <strong
                            className={`order-status ${
                              status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >
                            {formatStatus(
                              status
                            )}
                          </strong>
                        </div>

                      </div>

                      {/* =====================================
                          ORDER PRODUCTS
                      ===================================== */}
                      <div className="order-products">

                        {order.items?.map(
                          (
                            item,
                            index
                          ) => {

                            const product =
                              item.product ||
                              {};

                            return (
                              <div
                                className="order-product"
                                key={`${order._id}-${index}`}
                              >

                                {/* PRODUCT IMAGE */}
                                <div className="order-product-image">

                                  <img
                                    src={getProductImage(
                                      product
                                    )}
                                    alt={getProductName(
                                      product
                                    )}
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.src =
                                        "/images/placeholder.png";
                                    }}
                                  />

                                </div>

                                {/* PRODUCT DETAILS */}
                                <div className="product-details">

                                  <h3>
                                    {getProductName(
                                      product
                                    )}
                                  </h3>

                                  <p className="product-price">
                                    ₹
                                    {getProductPrice(
                                      item
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>

                                  <p className="product-meta">
                                    Size:{" "}
                                    {getProductSize(
                                      item
                                    )}

                                    <span>
                                      |
                                    </span>

                                    Quantity:{" "}
                                    {item.quantity ||
                                      1}
                                  </p>

                                </div>

                                {/* ITEM TOTAL */}
                                <strong className="product-item-total">
                                  ₹
                                  {(
                                    getProductPrice(
                                      item
                                    ) *
                                    Number(
                                      item.quantity ||
                                        1
                                    )
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </strong>

                              </div>
                            );
                          }
                        )}

                      </div>

                      {/* =====================================
                          ORDER FOOTER
                      ===================================== */}
                      <div className="order-footer">

                        <div>
                          <span>
                            PAYMENT
                          </span>

                          <strong>
                            {order.paymentMethod ||
                              "COD"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            TOTAL
                          </span>

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

                      {/* =====================================
                          ORDER ACTIONS
                      ===================================== */}
                      <div className="order-actions">

                        {normalizedStatus !==
                          "CANCELLED" &&
                          normalizedStatus !==
                            "DELIVERED" && (
                            <>
                              <button
                                type="button"
                                className="track-button"
                                onClick={() =>
                                  handleTrackOrder(
                                    order
                                  )
                                }
                              >
                                Track Your Order
                              </button>

                              <button
                                type="button"
                                className="cancel-order-btn"
                                onClick={() =>
                                  handleCancelOrder(
                                    order._id
                                  )
                                }
                              >
                                CANCEL ORDER
                              </button>
                            </>
                          )}

                      </div>

                    </article>
                  );
                })}

              </section>
            )}

        </div>

        {/* =================================================
            BACK BUTTON
        ================================================= */}
        <button
          type="button"
          className="orders-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

      </main>

      <Footer />
    </>
  );
}

export default Orders;