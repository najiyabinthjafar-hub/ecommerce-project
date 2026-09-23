import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css";

const API_URL = "http://localhost:5000/api";

// =========================================================
// ORDER STATUSES
// =========================================================

const ORDER_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PROCESSING",
    label: "Processing",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // FETCH SINGLE ORDER
  // =========================================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const token = localStorage.getItem("token");

        console.log("=================================");
        console.log("ORDER DETAILS ID:", id);
        console.log(
          "ORDER DETAILS URL:",
          `${API_URL}/orders/${id}`
        );
        console.log("TOKEN EXISTS:", Boolean(token));
        console.log("=================================");

        if (!id) {
          throw new Error("Order ID is missing.");
        }

        if (!token) {
          throw new Error(
            "Authentication required. Please login again."
          );
        }

        let fetchedOrder = null;

        // =====================================================
        // FIRST: TRY SINGLE ORDER API
        // =====================================================

        try {
          const response = await axios.get(
            `${API_URL}/orders/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(
            "ORDER DETAILS RESPONSE:",
            response.data
          );

          fetchedOrder =
            response.data?.order ||
            response.data?.data ||
            response.data;
        } catch (singleOrderError) {
          console.error(
            "Single order API error:",
            singleOrderError
          );

          // ===================================================
          // FALLBACK:
          // GET ADMIN ORDERS AND FIND THE ORDER BY ID
          // ===================================================

          if (
            singleOrderError.response?.status === 404
          ) {
            console.log(
              "Single order API returned 404."
            );

            console.log(
              "Trying /api/orders/all fallback..."
            );

            const allOrdersResponse =
              await axios.get(
                `${API_URL}/orders/all`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  params: {
                    page: 1,
                    limit: 1000,
                  },
                }
              );

            const allOrders =
              allOrdersResponse.data?.orders || [];

            console.log(
              "ADMIN ORDERS RESPONSE:",
              allOrdersResponse.data
            );

            fetchedOrder = allOrders.find(
              (item) =>
                String(item?._id) ===
                String(id)
            );

            console.log(
              "ORDER FOUND FROM FALLBACK:",
              fetchedOrder
            );
          } else {
            throw singleOrderError;
          }
        }

        // =====================================================
        // CHECK ORDER
        // =====================================================

        if (
          !fetchedOrder ||
          !fetchedOrder._id
        ) {
          throw new Error(
            "Order not found. The selected order may no longer exist."
          );
        }

        // =====================================================
        // SET ORDER
        // =====================================================

        setOrder(fetchedOrder);

        const fetchedStatus = String(
          fetchedOrder.orderStatus ||
            fetchedOrder.status ||
            "PENDING"
        ).toUpperCase();

        setSelectedStatus(fetchedStatus);
      } catch (error) {
        console.error(
          "Failed to fetch order details:",
          error
        );

        console.error(
          "ORDER DETAILS ERROR STATUS:",
          error.response?.status
        );

        console.error(
          "ORDER DETAILS ERROR DATA:",
          error.response?.data
        );

        console.error(
          "ORDER DETAILS ERROR URL:",
          error.config?.url
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          setFetchError(
            "You are not authorized to view this order."
          );
        } else {
          setFetchError(
            error.response?.data?.message ||
              error.message ||
              "Failed to load order details."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleStatusUpdate = async () => {
    if (!order?._id || !selectedStatus) {
      return;
    }

    const currentStatus = String(
      order.orderStatus ||
        order.status ||
        "PENDING"
    ).toUpperCase();

    if (selectedStatus === currentStatus) {
      return;
    }

    try {
      setUpdating(true);
      setUpdateError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await axios.put(
        `${API_URL}/orders/${order._id}/status`,
        {
          orderStatus: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ORDER STATUS UPDATE RESPONSE:",
        response.data
      );

      const updatedOrder =
        response.data?.order ||
        response.data?.data ||
        response.data;

      if (
        updatedOrder &&
        updatedOrder._id
      ) {
        setOrder(updatedOrder);

        const updatedStatus = String(
          updatedOrder.orderStatus ||
            updatedOrder.status ||
            selectedStatus
        ).toUpperCase();

        setSelectedStatus(updatedStatus);
      } else {
        setOrder((prevOrder) => ({
          ...prevOrder,
          orderStatus: selectedStatus,
        }));
      }

      setSuccess(
        "Order status updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      setUpdateError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  // =========================================================
  // CUSTOMER HELPERS
  // =========================================================

  const getCustomerName = () => {
    return (
      order?.user?.name ||
      order?.user?.fullName ||
      order?.shippingAddress?.fullName ||
      order?.shippingAddress?.name ||
      order?.user?.email ||
      "Unknown Customer"
    );
  };

  const getCustomerEmail = () => {
    return (
      order?.user?.email ||
      order?.shippingAddress?.email ||
      "Not available"
    );
  };

  const getCustomerPhone = () => {
    return (
      order?.user?.phone ||
      order?.shippingAddress?.phone ||
      order?.address?.phone ||
      "-"
    );
  };

  // =========================================================
  // SHIPPING ADDRESS
  // =========================================================

  const getShippingAddress = () => {
    const address =
      order?.shippingAddress ||
      order?.address;

    if (!address) {
      return "-";
    }

    if (typeof address === "string") {
      return address;
    }

    const addressParts = [
      address.fullName,
      address.name,
      address.address,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode || address.zipCode,
      address.country,
    ].filter(Boolean);

    return addressParts.length > 0
      ? addressParts.join(", ")
      : "-";
  };

  // =========================================================
  // PRODUCT HELPERS
  // =========================================================

  const getProductName = (item) => {
    if (
      item?.product &&
      typeof item.product === "object"
    ) {
      return (
        item.product.name ||
        item.product.title ||
        "Product"
      );
    }

    return (
      item?.name ||
      item?.productName ||
      "Product"
    );
  };

  const getProductCategory = (item) => {
    if (
      item?.product?.category &&
      typeof item.product.category === "object"
    ) {
      return (
        item.product.category.name ||
        "-"
      );
    }

    if (
      typeof item?.product?.category === "string"
    ) {
      return item.product.category;
    }

    return item?.category || "-";
  };

  const getProductImage = (item) => {
    const product = item?.product;

    if (!product) {
      return null;
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const image = product.images[0];

      if (typeof image === "string") {
        return image;
      }

      return (
        image?.url ||
        image?.secure_url ||
        null
      );
    }

    return product.image || null;
  };

  // =========================================================
  // ORDER CALCULATIONS
  // =========================================================

  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const price =
          item?.price ??
          item?.salePrice ??
          item?.product?.salePrice ??
          item?.product?.price ??
          item?.product?.regularPrice ??
          0;

        const quantity = Number(
          item?.quantity || 0
        );

        return (
          total +
          Number(price || 0) * quantity
        );
      },
      0
    );
  }, [items]);

  const shipping =
    order?.shippingAmount ??
    order?.shippingFee ??
    order?.deliveryCharge ??
    0;

  const calculatedTotal =
    subtotal + Number(shipping || 0);

  const totalAmount =
    order?.finalAmount ??
    order?.totalAmount ??
    order?.total ??
    calculatedTotal;

  const paymentStatus =
    order?.paymentStatus || "PENDING";

  const paymentMethod =
    order?.paymentMethod ||
    order?.payment?.method ||
    order?.method ||
    "Razorpay";

  // =========================================================
  // CURRENT STATUS
  // =========================================================

  const currentOrderStatus = String(
    order?.orderStatus ||
      order?.status ||
      "PENDING"
  ).toUpperCase();

  const currentStatusLabel =
    formatStatus(currentOrderStatus);

  // =========================================================
  // TIMELINE STATUS
  // =========================================================

  const processingStatuses = [
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const shippedStatuses = [
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const isOrderPlaced =
    Boolean(order?.createdAt);

  const isProcessing =
    processingStatuses.includes(
      currentOrderStatus
    );

  const isShipped =
    shippedStatuses.includes(
      currentOrderStatus
    );

  const isDelivered =
    currentOrderStatus === "DELIVERED";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-loading">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (fetchError && !order) {
    return (
      <div className="order-details-page">
        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <i className="bi bi-arrow-left"></i>
          Back to Orders
        </button>

        <div className="order-error">
          <i className="bi bi-exclamation-circle-fill"></i>

          <span>{fetchError}</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="order-details-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="order-details-header">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <i className="bi bi-arrow-left"></i>
          Back to Orders
        </button>

        <div className="title-row">

          <div>
            <h1>Order Details</h1>

            <p>
              View complete information
              about this order.
            </p>
          </div>

          <span
            className={`order-status ${currentOrderStatus
              .toLowerCase()
              .replace(/_/g, "-")}`}
          >
            <span className="status-dot"></span>

            {currentStatusLabel}
          </span>

        </div>
      </div>

      {/* =====================================================
          ORDER OVERVIEW
      ===================================================== */}

      <div className="order-overview">

        <div className="overview-item">
          <span>Order ID</span>

          <strong>
            #
            {order._id
              ? String(order._id).slice(-8)
              : "-"}
          </strong>
        </div>

        <div className="overview-item">
          <span>Order Date</span>

          <strong>
            {formatDate(order.createdAt)}
          </strong>
        </div>

        <div className="overview-item">
          <span>Payment</span>

          <strong
            className={
              String(paymentStatus)
                .toUpperCase() === "PAID"
                ? "paid"
                : ""
            }
          >
            {formatStatus(paymentStatus)}
          </strong>
        </div>

        <div className="overview-item">
          <span>Payment Method</span>

          <strong>
            {formatStatus(paymentMethod)}
          </strong>
        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="order-details-grid">

        {/* ===================================================
            CUSTOMER DETAILS
        =================================================== */}

        <div className="details-card customer-card">

          <div className="card-heading">

            <div className="heading-icon">
              <i className="bi bi-person"></i>
            </div>

            <div>
              <h2>Customer Details</h2>

              <p>
                Customer information
              </p>
            </div>

          </div>

          <div className="customer-info">

            <div>
              <span>Name</span>

              <strong>
                {getCustomerName()}
              </strong>
            </div>

            <div>
              <span>Email</span>

              <strong>
                {getCustomerEmail()}
              </strong>
            </div>

            <div>
              <span>Phone</span>

              <strong>
                {getCustomerPhone()}
              </strong>
            </div>

            <div>
              <span>Shipping Address</span>

              <strong>
                {getShippingAddress()}
              </strong>
            </div>

          </div>
        </div>

        {/* ===================================================
            PAYMENT DETAILS
        =================================================== */}

        <div className="details-card payment-card">

          <div className="card-heading">

            <div className="heading-icon payment-icon">
              <i className="bi bi-credit-card"></i>
            </div>

            <div>
              <h2>Payment Details</h2>

              <p>
                Transaction information
              </p>
            </div>

          </div>

          <div className="payment-info">

            <div>
              <span>Payment Status</span>

              <strong
                className={
                  String(paymentStatus)
                    .toUpperCase() === "PAID"
                    ? "paid"
                    : ""
                }
              >
                {formatStatus(paymentStatus)}
              </strong>
            </div>

            <div>
              <span>Method</span>

              <strong>
                {formatStatus(paymentMethod)}
              </strong>
            </div>

            <div>
              <span>Shipping</span>

              <strong>
                Standard Delivery
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          ORDERED PRODUCTS
      ===================================================== */}

      <div className="details-card products-card">

        <div className="products-card-header">

          <div>
            <h2>Ordered Products</h2>

            <p>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}{" "}
              in this order
            </p>
          </div>

        </div>

        <div className="order-table-wrapper">

          <table className="order-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-products"
                  >
                    No products found in
                    this order.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {

                  const price =
                    item?.price ??
                    item?.salePrice ??
                    item?.product?.salePrice ??
                    item?.product?.price ??
                    item?.product?.regularPrice ??
                    0;

                  const quantity =
                    Number(
                      item?.quantity || 0
                    );

                  const image =
                    getProductImage(item);

                  const itemTotal =
                    Number(price || 0) *
                    quantity;

                  return (
                    <tr
                      key={
                        item?._id ||
                        item?.product?._id ||
                        index
                      }
                    >

                      {/* PRODUCT */}

                      <td>
                        <div className="product-name">

                          <div className="product-image">

                            {image ? (
                              <img
                                src={image}
                                alt={getProductName(
                                  item
                                )}
                              />
                            ) : (
                              <i className="bi bi-box"></i>
                            )}

                          </div>

                          <strong>
                            {getProductName(
                              item
                            )}
                          </strong>

                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        {getProductCategory(
                          item
                        )}
                      </td>

                      {/* PRICE */}

                      <td>
                        ₹
                        {formatCurrency(
                          price
                        )}
                      </td>

                      {/* QUANTITY */}

                      <td>
                        {quantity}
                      </td>

                      {/* TOTAL */}

                      <td>
                        <strong>
                          ₹
                          {formatCurrency(
                            itemTotal
                          )}
                        </strong>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* =====================================================
          BOTTOM GRID
      ===================================================== */}

      <div className="order-bottom-grid">

        {/* ===================================================
            ORDER STATUS
        =================================================== */}

        <div className="details-card timeline-card">

          <div className="card-heading">

            <div className="heading-icon">
              <i className="bi bi-clock-history"></i>
            </div>

            <div>
              <h2>Order Status</h2>

              <p>
                Update order progress
              </p>
            </div>

          </div>

          {/* STATUS UPDATE */}

          <div className="status-update-box">

            <label htmlFor="order-status">
              Update Status
            </label>

            <div className="status-update-row">

              <select
                id="order-status"
                value={selectedStatus}
                onChange={(event) => {
                  setSelectedStatus(
                    event.target.value
                  );

                  setUpdateError("");
                  setSuccess("");
                }}
                disabled={updating}
              >
                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                className="update-status-btn"
                onClick={
                  handleStatusUpdate
                }
                disabled={
                  updating ||
                  selectedStatus ===
                    currentOrderStatus
                }
              >
                {updating ? (
                  <>
                    <span className="button-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2"></i>
                    Update Status
                  </>
                )}
              </button>

            </div>

            {success && (
              <div className="order-success">

                <i className="bi bi-check-circle-fill"></i>

                <span>
                  {success}
                </span>

              </div>
            )}

            {updateError && (
              <div className="order-error">

                <i className="bi bi-exclamation-circle-fill"></i>

                <span>
                  {updateError}
                </span>

              </div>
            )}

          </div>

          {/* TIMELINE */}

          <div className="timeline">

            {/* ORDER PLACED */}

            <div
              className={`timeline-item ${
                isOrderPlaced
                  ? "completed"
                  : ""
              }`}
            >
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>
                  Order Placed
                </strong>

                <span>
                  Order has been placed
                  successfully.
                </span>
              </div>
            </div>

            {/* PROCESSING */}

            <div
              className={`timeline-item ${
                isProcessing
                  ? "completed"
                  : ""
              }`}
            >
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>
                  Processing
                </strong>

                <span>
                  Order is being prepared.
                </span>
              </div>
            </div>

            {/* SHIPPED */}

            <div
              className={`timeline-item ${
                isShipped
                  ? "completed"
                  : ""
              }`}
            >
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>
                  Shipped
                </strong>

                <span>
                  Package has been shipped.
                </span>
              </div>
            </div>

            {/* DELIVERED */}

            <div
              className={`timeline-item ${
                isDelivered
                  ? "completed"
                  : ""
              }`}
            >
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>
                  Delivered
                </strong>

                <span>
                  Order delivered to
                  customer.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ===================================================
            ORDER SUMMARY
        =================================================== */}

        <div className="details-card summary-card">

          <h2>Order Summary</h2>

          <div className="summary-row">

            <span>Subtotal</span>

            <strong>
              ₹{formatCurrency(subtotal)}
            </strong>

          </div>

          <div className="summary-row">

            <span>Shipping</span>

            <strong>
              ₹{formatCurrency(shipping)}
            </strong>

          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">

            <span>Total Amount</span>

            <strong>
              ₹{formatCurrency(totalAmount)}
            </strong>

          </div>

          <button
            type="button"
            className="orders-btn"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            <i className="bi bi-arrow-left"></i>
            View All Orders
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;