import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Orders API Error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getProductImage = (product) => {
    if (!product) {
      return "/images/placeholder.png";
    }

    if (product.images && product.images.length > 0) {
      const image = product.images[0];

      if (typeof image === "string") {
        if (image.startsWith("http")) {
          return image;
        }

        return `http://localhost:5000/${
          image.startsWith("/") ? image.slice(1) : image
        }`;
      }

      if (image?.url) {
        if (image.url.startsWith("http")) {
          return image.url;
        }

        return `http://localhost:5000${image.url}`;
      }
    }

    if (product.image) {
      if (product.image.startsWith("http")) {
        return product.image;
      }

      return `http://localhost:5000${product.image}`;
    }

    return "/images/placeholder.png";
  };

  const getProductName = (product) => {
    return product?.name || product?.title || "Product";
  };

  const getProductPrice = (item) => {
    if (
      item?.price !== undefined &&
      item?.price !== null
    ) {
      return item.price;
    }

    if (
      item?.product?.salePrice !== undefined &&
      item?.product?.salePrice !== null &&
      item.product.salePrice > 0
    ) {
      return item.product.salePrice;
    }

    return item?.product?.regularPrice || 0;
  };

  const getProductSize = (item) => {
    return (
      item?.size ||
      item?.selectedSize ||
      item?.variant?.size ||
      "N/A"
    );
  };

  const handleTrackOrder = (order) => {
    navigate(`/track-order/${order._id}`, {
      state: {
        order: order,
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <div className="orders-container">

          {loading && (
            <div className="orders-message">
              Loading your orders...
            </div>
          )}

          {!loading && error && (
            <div className="orders-message error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="orders-message">
                No orders found.
              </div>
            )}

          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="orders-content">

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
                <div className="orders-list">
                  {orders.map((order) => {
                    const status =
                      order.orderStatus || "PENDING";

                    const normalizedStatus =
                      status.toUpperCase();

                    return (
                      <div
                        className="order-item"
                        key={order._id}
                      >

                        {/* PRODUCT */}
                        <div className="product-section">
                          {order.items?.map(
                            (item, index) => {
                              const product = item.product;

                              return (
                                <div
                                  className="product-item"
                                  key={
                                    product?._id ||
                                    `${order._id}-${index}`
                                  }
                                >
                                  <img
                                    src={getProductImage(
                                      product
                                    )}
                                    alt={getProductName(
                                      product
                                    )}
                                    className="product-image"
                                    onError={(event) => {
                                      event.currentTarget.src =
                                        "/images/placeholder.png";
                                    }}
                                  />

                                  <div className="product-details">
                                    <h3>
                                      {getProductName(
                                        product
                                      )}
                                    </h3>

                                    <p className="product-price">
                                      ₹
                                      {Number(
                                        getProductPrice(item)
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>

                                    <p className="product-meta">
                                      Size:{" "}
                                      {getProductSize(item)}

                                      <span>|</span>

                                      Quantity:{" "}
                                      {item.quantity || 1}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        {/* STATUS */}
                        <div className="status-section">
                          <span
                            className={`status ${normalizedStatus
                              .toLowerCase()
                              .replace(/_/g, "-")}`}
                          >
                            {formatStatus(status)}
                          </span>

                          {normalizedStatus !==
                            "CANCELLED" &&
                            normalizedStatus !==
                              "DELIVERED" && (
                              <button
                                type="button"
                                className="track-button"
                                onClick={() =>
                                  handleTrackOrder(order)
                                }
                              >
                                Track Your Order
                              </button>
                            )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Orders;