import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderTracking.css";

const API_URL = "http://localhost:5000/api";

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");
  const [returnError, setReturnError] = useState("");

  // ================= FETCH LATEST ORDER =================

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchLatestOrder = async () => {
      if (!order?._id) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_URL}/orders/${order._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.order) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Fetch latest order error:", error);
      }
    };

    fetchLatestOrder();
  }, [navigate]);

  // ================= IMAGE URL =================

  const getImageUrl = (image) => {
    if (!image) {
      return "/images/product-placeholder.jpg";
    }

    if (typeof image !== "string") {
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

  // ================= PRODUCT IMAGE =================

  const getProductImage = (item) => {
    const product = item?.product;

    const image =
      item?.image ||
      item?.productImage ||
      item?.images?.[0] ||
      product?.images?.[0] ||
      product?.image ||
      product?.productImage;

    return getImageUrl(image);
  };

  // ================= PRODUCT NAME =================

  const getProductName = (item) => {
    const product = item?.product;

    return (
      product?.name ||
      item?.productName ||
      item?.name ||
      "Product"
    );
  };

  // ================= PRODUCT PRICE =================

  const getProductPrice = (item) => {
    const product = item?.product;

    return (
      item?.price ??
      item?.salePrice ??
      item?.regularPrice ??
      product?.salePrice ??
      product?.regularPrice ??
      product?.price ??
      0
    );
  };

  // ================= RETURN MODAL =================

  const openReturnModal = () => {
    setReturnReason("");
    setCustomReason("");
    setReturnMessage("");
    setReturnError("");
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    if (returnLoading) return;

    setShowReturnModal(false);
    setReturnReason("");
    setCustomReason("");
    setReturnError("");
  };

  // ================= SUBMIT RETURN =================

  const handleReturnSubmit = async () => {
    let finalReason = returnReason;

    if (returnReason === "Other") {
      finalReason = customReason.trim();
    }

    if (!finalReason) {
      setReturnError("Please select or enter a return reason.");
      return;
    }

    try {
      setReturnLoading(true);
      setReturnError("");
      setReturnMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/orders/${order._id}/return`,
        {
          reason: finalReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder = response.data.order;

      if (updatedOrder) {
        setOrder(updatedOrder);
      } else {
        setOrder((previousOrder) => ({
          ...previousOrder,
          returnStatus: "REQUESTED",
          returnReason: finalReason,
        }));
      }

      setShowReturnModal(false);
      setReturnReason("");
      setCustomReason("");

      setReturnMessage(
        "Your return request has been submitted successfully."
      );

      setTimeout(() => {
        setReturnMessage("");
      }, 2500);
    } catch (error) {
      console.error("Return request error:", error);

      setReturnError(
        error.response?.data?.message ||
          "Failed to submit return request."
      );
    } finally {
      setReturnLoading(false);
    }
  };

  // ================= ORDER NOT FOUND =================

  if (!order) {
    return (
      <div className="tracking-page">
        <div className="tracking-empty">
          <h2>Order Not Found</h2>

          <p>
            Tracking information is not available.
          </p>

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

  // ================= STATUS =================

  const status = (
    order.orderStatus || "PENDING"
  ).toUpperCase();

  // ================= TRACKING STEPS =================

  const steps = [
    {
      key: "PENDING",
      title: "Order Placed",
      description:
        "Your order has been placed successfully.",
    },
    {
      key: "CONFIRMED",
      title: "Confirmed",
      description:
        "Your order has been confirmed.",
    },
    {
      key: "PROCESSING",
      title: "Processing",
      description:
        "Your order is being prepared.",
    },
    {
      key: "SHIPPED",
      title: "Shipped",
      description:
        "Your order has been shipped.",
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Out for Delivery",
      description:
        "Your order is out for delivery.",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      description:
        "Your order has been delivered.",
    },
  ];

  // Backend status is used directly
  const normalizedStatus = status;

  const currentIndex = steps.findIndex(
    (step) => step.key === normalizedStatus
  );

  // ================= RETURN STATUS =================

  const returnStatus = (
    order.returnStatus || "NONE"
  ).toUpperCase();

  const canRequestReturn =
    status === "DELIVERED" &&
    returnStatus === "NONE";

  const isReturnRequested =
    returnStatus === "REQUESTED";

  const isReturnApproved =
    returnStatus === "APPROVED";

  const isReturnRejected =
    returnStatus === "REJECTED";

  return (
    <div className="tracking-page">

      <div className="tracking-container">

        {/* ================= HEADER ================= */}

        <div className="tracking-header">
          <span>ORDER TRACKING</span>

          <h1>
            #{order._id?.slice(-8).toUpperCase()}
          </h1>
        </div>

        {/* ================= ORDER INFO ================= */}

        <div className="tracking-order-info">

          <div>
            <p>ORDER DATE</p>

            <h3>
              {order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleDateString()
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
              ₹
              {Number(
                order.finalAmount ??
                  order.totalAmount ??
                  0
              ).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>

        {/* ================= CANCELLED ================= */}

        {normalizedStatus === "CANCELLED" ? (

          <div className="cancelled-box">

            <div className="cancelled-icon">
              ×
            </div>

            <h2>
              Order Cancelled
            </h2>

            <p>
              This order has been cancelled
              and will not be delivered.
            </p>

          </div>

        ) : (

          /* ================= TRACKING STEPS ================= */

          <div className="tracking-steps">

            {steps.map((step, index) => {

              const completed =
                currentIndex >= 0 &&
                index <= currentIndex;

              const active =
                index === currentIndex;

              return (
                <div
                  className={`tracking-step ${
                    completed
                      ? "completed"
                      : ""
                  } ${
                    active
                      ? "active"
                      : ""
                  }`}
                  key={step.key}
                >

                  <div className="step-left">

                    <div className="step-circle">
                      {completed ? "✓" : ""}
                    </div>

                    {index !==
                      steps.length - 1 && (
                      <div
                        className={`step-line ${
                          index <
                          currentIndex
                            ? "filled"
                            : ""
                        }`}
                      />
                    )}

                  </div>

                  <div className="step-content">

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

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

        {/* ================= RETURN SECTION ================= */}

        {normalizedStatus === "DELIVERED" && (

          <div className="return-section">

            {canRequestReturn && (
              <>
                <h2>
                  RETURN ORDER
                </h2>

                <p>
                  If you are not satisfied with
                  your order, you can request a return.
                </p>

                <button
                  className="return-order-btn"
                  onClick={openReturnModal}
                >
                  RETURN ORDER
                </button>
              </>
            )}

            {isReturnRequested && (
              <>
                <h2>
                  RETURN REQUESTED
                </h2>

                <p>
                  Your return request has been
                  submitted and is waiting for
                  admin approval.
                </p>

                <button
                  className="return-order-btn disabled"
                  disabled
                >
                  RETURN REQUESTED
                </button>
              </>
            )}

            {isReturnApproved && (
              <>
                <h2>
                  RETURN APPROVED
                </h2>

                <p>
                  Your return has been approved.
                  Your refund will be processed
                  according to the payment method.
                </p>

                <button
                  className="return-order-btn disabled"
                  disabled
                >
                  RETURN APPROVED
                </button>
              </>
            )}

            {isReturnRejected && (
              <>
                <h2>
                  RETURN REJECTED
                </h2>

                <p>
                  Your return request has been
                  rejected by the admin.
                </p>

                <button
                  className="return-order-btn disabled"
                  disabled
                >
                  RETURN REJECTED
                </button>
              </>
            )}

          </div>
        )}

        {/* ================= SUCCESS MESSAGE ================= */}

        {returnMessage && (
          <div className="tracking-return-message success">
            {returnMessage}
          </div>
        )}

        {/* ================= ERROR MESSAGE ================= */}

        {returnError && !showReturnModal && (
          <div className="tracking-return-message error">
            {returnError}
          </div>
        )}

        {/* ================= PRODUCTS ================= */}

        {order.items?.length > 0 && (

          <div className="tracking-products">

            <h2>
              ORDER ITEMS
            </h2>

            {order.items.map(
              (item, index) => {

                const productName =
                  getProductName(item);

                const productImage =
                  getProductImage(item);

                const productPrice =
                  getProductPrice(item);

                return (
                  <div
                    className="tracking-product"
                    key={item._id || index}
                  >

                    {/* IMAGE */}

                    <div className="tracking-product-image">

                      <img
                        src={productImage}
                        alt={productName}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/product-placeholder.jpg";
                        }}
                      />

                    </div>

                    {/* DETAILS */}

                    <div className="tracking-product-details">

                      <h3>
                        {productName}
                      </h3>

                      <p>
                        Quantity:{" "}
                        {item.quantity || 1}
                      </p>

                      {item.size && (
                        <p>
                          Size: {item.size}
                        </p>
                      )}

                    </div>

                    {/* PRICE */}

                    <div className="tracking-product-price">

                      ₹
                      {Number(
                        productPrice
                      ).toLocaleString("en-IN")}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* ================= BACK BUTTON ================= */}

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

      {/* ================================================= */}
      {/* RETURN MODAL */}
      {/* ================================================= */}

      {showReturnModal && (

        <div
          className="return-modal-overlay"
          onClick={closeReturnModal}
        >

          <div
            className="return-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="return-modal-close"
              onClick={closeReturnModal}
              disabled={returnLoading}
            >
              ×
            </button>

            <h2>
              RETURN ORDER
            </h2>

            <p className="return-modal-description">
              Please select a reason for
              returning this order.
            </p>

            {/* REASON */}

            <label>
              Return Reason
            </label>

            <select
              value={returnReason}
              onChange={(e) => {
                setReturnReason(
                  e.target.value
                );
                setReturnError("");
              }}
              disabled={returnLoading}
            >

              <option value="">
                Select a reason
              </option>

              <option value="Wrong product received">
                Wrong product received
              </option>

              <option value="Damaged product">
                Damaged product
              </option>

              <option value="Product is defective">
                Product is defective
              </option>

              <option value="Wrong size">
                Wrong size
              </option>

              <option value="Product does not match description">
                Product does not match description
              </option>

              <option value="Changed my mind">
                Changed my mind
              </option>

              <option value="Other">
                Other
              </option>

            </select>

            {/* CUSTOM REASON */}

            {returnReason === "Other" && (

              <textarea
                value={customReason}
                onChange={(e) => {
                  setCustomReason(
                    e.target.value
                  );
                  setReturnError("");
                }}
                placeholder="Enter your reason"
                rows="4"
                disabled={returnLoading}
              />

            )}

            {/* ERROR */}

            {returnError && (
              <p className="return-modal-error">
                {returnError}
              </p>
            )}

            {/* ACTIONS */}

            <div className="return-modal-actions">

              <button
                className="return-cancel-btn"
                onClick={closeReturnModal}
                disabled={returnLoading}
              >
                CANCEL
              </button>

              <button
                className="return-submit-btn"
                onClick={handleReturnSubmit}
                disabled={returnLoading}
              >
                {returnLoading
                  ? "SUBMITTING..."
                  : "SUBMIT RETURN"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default OrderTracking;