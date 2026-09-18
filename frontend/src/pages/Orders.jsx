import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH ORDERS =================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data.orders || response.data.data || []);
      } catch (error) {
        console.error("Fetch orders error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================= CANCEL ORDER =================

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
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
        response.data.order || response.data.data;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );

      alert("Your order has been cancelled.");
    } catch (error) {
      console.error("Cancel order error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to cancel order."
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <section className="orders-heading">
            <p>YOUR ACCOUNT</p>
            <h1>MY ORDERS</h1>
            <span>Loading your orders...</span>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="orders-page">

        {/* BACK TO PROFILE */}

        <button
          className="orders-back-btn"
          onClick={() => navigate("/profile")}
        >
          ← BACK TO PROFILE
        </button>

        <section className="orders-heading">
          <p>YOUR ACCOUNT</p>

          <h1>MY ORDERS</h1>

          <span>
            View your recent orders and order details.
          </span>
        </section>

        {/* ERROR */}

        {error && (
          <section className="orders-empty">
            <h2>{error}</h2>
          </section>
        )}

        {/* NO ORDERS */}

        {!error && orders.length === 0 && (
          <section className="orders-empty">
            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link to="/shop">
              START SHOPPING
            </Link>
          </section>
        )}

        {/* ORDERS */}

        {!error && orders.length > 0 && (
          <section className="orders-container">

            {orders.map((order) => (

              <article
                className="order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

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
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>STATUS</span>

                    <strong
                      className={`order-status ${
                        order.orderStatus
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")
                      }`}
                    >
                      {order.orderStatus}
                    </strong>
                  </div>

                </div>

                {/* ORDER PRODUCTS */}

                <div className="order-products">

                  {order.items?.map((item, index) => {

                    const product =
                      item.product || {};

                    return (
                      <div
                        className="order-product"
                        key={`${order._id}-${index}`}
                      >

                        <div className="order-product-image">

                          <img
                            src={
                              product.image ||
                              item.image ||
                              "/placeholder.png"
                            }
                            alt={
                              product.name ||
                              item.name ||
                              "Product"
                            }
                          />

                        </div>

                        <div className="order-product-info">

                          <h3>
                            {product.name ||
                              item.name ||
                              "Product"}
                          </h3>

                          {item.size && (
                            <p>
                              Size: {item.size}
                            </p>
                          )}

                          <p>
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <strong>
                          ₹
                          {(
                            (item.price || 0) *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>
                    );
                  })}

                </div>

                {/* ORDER FOOTER */}

                <div className="order-footer">

                  <div>
                    <span>PAYMENT</span>

                    <strong>
                      {order.paymentMethod || "COD"}
                    </strong>
                  </div>

                  <div>
                    <span>TOTAL</span>

                    <strong>
                      ₹
                      {(
                        order.totalAmount ||
                        order.total ||
                        0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>

                {/* ORDER ACTIONS */}

                <div className="order-actions">

                  {order.orderStatus !== "CANCELLED" &&
                    order.orderStatus !== "DELIVERED" && (

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

              </article>

            ))}

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}

export default Orders;
