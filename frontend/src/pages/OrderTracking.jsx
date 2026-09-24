import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderTracking.css";

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="tracking-page">
        <div className="tracking-empty">
          <h2>Order Not Found</h2>
          <p>Tracking information is not available.</p>

          <button
            onClick={() =>
              navigate("/orders", {
                replace: true,
              })
            }
          >
            BACK TO ORDERS
          </button>
        </div>
      </div>
    );
  }

  const status = order.orderStatus?.toUpperCase();

  const steps = [
    {
      key: "PENDING",
      title: "Order Placed",
      description: "Your order has been placed successfully.",
    },
    {
      key: "CONFIRMED",
      title: "Confirmed",
      description: "Your order has been confirmed.",
    },
    {
      key: "PROCESSING",
      title: "Processing",
      description: "Your order is being prepared.",
    },
    {
      key: "DISPATCHED",
      title: "Dispatched",
      description: "Your order has been dispatched.",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      description: "Your order has been delivered.",
    },
  ];

  const normalizedStatus =
    status === "SHIPPED" ? "DISPATCHED" : status;

  const currentIndex = steps.findIndex(
    (step) => step.key === normalizedStatus
  );

  return (
    <div className="tracking-page">
      <div className="tracking-container">

        {/* HEADER */}
        <div className="tracking-header">
          <span>ORDER TRACKING</span>

          <h1>
            #{order._id?.slice(-8).toUpperCase()}
          </h1>
        </div>

        {/* ORDER INFO */}
        <div className="tracking-order-info">
          <div>
            <p>ORDER DATE</p>

            <h3>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "—"}
            </h3>
          </div>

          <div>
            <p>PAYMENT</p>

            <h3>
              {order.paymentMethod || "—"}
            </h3>
          </div>

          <div>
            <p>TOTAL</p>

            <h3>
              ₹{order.finalAmount ?? order.totalAmount ?? 0}
            </h3>
          </div>
        </div>

        {/* CANCELLED */}
        {normalizedStatus === "CANCELLED" ? (
          <div className="cancelled-box">
            <div className="cancelled-icon">×</div>

            <h2>Order Cancelled</h2>

            <p>
              This order has been cancelled and will not be delivered.
            </p>
          </div>
        ) : (

          /* TRACKING STEPS */
          <div className="tracking-steps">
            {steps.map((step, index) => {
              const completed = index <= currentIndex;
              const active = index === currentIndex;

              return (
                <div
                  className={`tracking-step ${
                    completed ? "completed" : ""
                  } ${active ? "active" : ""}`}
                  key={step.key}
                >
                  <div className="step-left">

                    <div className="step-circle">
                      {completed ? "✓" : ""}
                    </div>

                    {index !== steps.length - 1 && (
                      <div
                        className={`step-line ${
                          index < currentIndex ? "filled" : ""
                        }`}
                      />
                    )}
                  </div>

                  <div className="step-content">
                    <h3>{step.title}</h3>

                    <p>{step.description}</p>

                    {active && (
                      <span className="current-status">
                        CURRENT STATUS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PRODUCTS */}
        {order.items?.length > 0 && (
          <div className="tracking-products">
            <h2>ORDER ITEMS</h2>

            {order.items.map((item, index) => {
              const product = item.product || {};

              const productName =
                product.name || "Product";

              const productImage =
                item.image ||
                product.image ||
                product.images?.[0];

              return (
                <div
                  className="tracking-product"
                  key={index}
                >
                  <div className="tracking-product-image">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="tracking-product-details">
                    <h3>{productName}</h3>

                    <p>
                      Quantity: {item.quantity || 1}
                    </p>

                    {item.size && (
                      <p>
                        Size: {item.size}
                      </p>
                    )}
                  </div>

                  <div className="tracking-product-price">
                    ₹{item.price || 0}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BACK BUTTON */}
        <button
          className="tracking-back-btn"
          onClick={() =>
            navigate("/orders", {
              replace: true,
            })
          }
        >
          BACK TO ORDERS
        </button>

      </div>
    </div>
  );
};

export default OrderTracking;