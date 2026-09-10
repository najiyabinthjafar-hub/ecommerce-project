import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Orders.css";

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
}

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(getOrders());

  // ================= CANCEL ORDER =================

  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: "Cancelled" }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    alert("Your order has been cancelled.");
  };

  // ================= RETURN ORDER =================

  const handleReturnOrder = (orderId) => {
    const confirmReturn = window.confirm(
      "Do you want to request a return for this order?"
    );

    if (!confirmReturn) return;

    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: "Return Requested" }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    alert("Your return request has been submitted.");
  };

  return (
    <>
      <Navbar />

      <main className="orders-page">

        {/* BACK TO PROFILE */}

        <button
          className="orders-back-btn"
          onClick={() => navigate("/profile")}
        >
          ← BACK TO PROFILE
        </button>

        <section className="orders-heading">
          <p>YOUR ACCOUNT</p>

          <h1>MY ORDERS</h1>

          <span>
            View your recent orders and order details.
          </span>
        </section>

        {orders.length === 0 ? (

          <section className="orders-empty">
            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link to="/shop">
              START SHOPPING
            </Link>
          </section>

        ) : (

          <section className="orders-container">

            {orders
              .slice()
              .reverse()
              .map((order) => (

                <article
                  className="order-card"
                  key={order.id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-header">

                    <div>
                      <span>ORDER ID</span>

                      <strong>
                        #{order.id}
                      </strong>
                    </div>

                    <div>
                      <span>DATE</span>

                      <strong>
                        {order.date}
                      </strong>
                    </div>

                    <div>
                      <span>STATUS</span>

                      <strong
                        className={`order-status ${order.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {order.status}
                      </strong>
                    </div>

                  </div>

                  {/* ORDER PRODUCTS */}

                  <div className="order-products">

                    {order.items.map((item) => (

                      <div
                        className="order-product"
                        key={`${order.id}-${item.id}-${item.size}`}
                      >

                        <div className="order-product-image">
                          <img
                            src={item.image}
                            alt={item.name}
                          />
                        </div>

                        <div className="order-product-info">

                          <h3>
                            {item.name}
                          </h3>

                          {item.size && (
                            <p>
                              Size: {item.size}
                            </p>
                          )}

                          <p>
                            Quantity: {item.quantity}
                          </p>

                        </div>

                        <strong>
                          ₹
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>

                    ))}

                  </div>

                  {/* ORDER FOOTER */}

                  <div className="order-footer">

                    <div>
                      <span>PAYMENT</span>

                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </div>

                    <div>
                      <span>TOTAL</span>

                      <strong>
                        ₹
                        {order.total.toLocaleString("en-IN")}
                      </strong>
                    </div>

                  </div>

                  {/* ORDER ACTIONS */}

                  <div className="order-actions">

                    {/* CANCEL */}

                    {order.status === "Order Placed" && (

                      <button
                        className="cancel-order-btn"
                        onClick={() =>
                          handleCancelOrder(order.id)
                        }
                      >
                        CANCEL ORDER
                      </button>

                    )}

                    {/* RETURN */}

                    {order.status === "Delivered" && (

                      <button
                        className="return-order-btn"
                        onClick={() =>
                          handleReturnOrder(order.id)
                        }
                      >
                        RETURN ORDER
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