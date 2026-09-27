import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDetails.css";

const CustomerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const customer = location.state?.customer;

  // ================= HELPERS =================

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const getProductImage = (order) => {
    const firstItem =
      order?.items?.[0] ||
      order?.orderItems?.[0] ||
      order?.products?.[0];

    return (
      firstItem?.product?.images?.[0] ||
      firstItem?.images?.[0] ||
      firstItem?.product?.image ||
      firstItem?.image ||
      "/images/product-placeholder.png"
    );
  };

  const getProductName = (order) => {
    const firstItem =
      order?.items?.[0] ||
      order?.orderItems?.[0] ||
      order?.products?.[0];

    return (
      firstItem?.product?.name ||
      firstItem?.productName ||
      firstItem?.name ||
      "Product"
    );
  };

  const getOrderQuantity = (order) => {
    const firstItem =
      order?.items?.[0] ||
      order?.orderItems?.[0] ||
      order?.products?.[0];

    return firstItem?.quantity || firstItem?.qty || 1;
  };

  const getAddress = () => {
    if (!customer) return null;

    const orders = Array.isArray(customer.orders)
      ? customer.orders
      : [];

    const latestOrder = orders[0];

    return (
      customer.address ||
      customer.shippingAddress ||
      latestOrder?.shippingAddress ||
      latestOrder?.address ||
      null
    );
  };

  // ================= CUSTOMER NOT FOUND =================

  if (!customer) {
    return (
      <div className="customer-details-page">
        <div className="customer-not-found">
          <i className="bi bi-person-x"></i>

          <h2>Customer Not Found</h2>

          <p>
            Customer information could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  // ================= ORDERS =================

  const orders = Array.isArray(customer.orders)
    ? [...customer.orders].sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0)
      )
    : [];

  const address = getAddress();

  // ================= PAYMENT =================

  const getPaymentMethod = (order) => {
    return (
      order?.paymentMethod ||
      order?.payment?.method ||
      order?.paymentMethodName ||
      "COD"
    );
  };

  // ================= ORDER STATUS =================

  const getOrderStatus = (order) => {
    return (
      order?.status ||
      order?.orderStatus ||
      "Pending"
    );
  };

  return (
    <div className="customer-details-page">

      {/* ================= TOP BAR ================= */}

      <div className="customer-details-topbar">
        <div className="customer-details-heading">
          <div>
            <h1>Customer Details</h1>

            <p>
              View customer information, address, and order history.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/admin/customers")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Customers
          </button>
        </div>
      </div>

      {/* ================= PROFILE HEADER ================= */}

      <div className="customer-profile-card">

        <div className="customer-profile-left">

          <div className="customer-profile-avatar">
            {getInitials(customer.name)}
          </div>

          <div className="customer-profile-info">

            <h1>
              {customer.name || "Unknown Customer"}
            </h1>

            <p>
              <i className="bi bi-envelope"></i>
              {customer.email || "-"}
            </p>

            <p>
              <i className="bi bi-telephone"></i>
              {customer.phone || "-"}
            </p>

          </div>
        </div>

        <div className="customer-profile-status">

          <span
            className={`customer-details-status ${
              customer.status === "blocked"
                ? "blocked"
                : "active"
            }`}
          >
            {customer.status === "blocked"
              ? "Blocked"
              : "Active"}
          </span>

        </div>
      </div>

      {/* ================= INFORMATION GRID ================= */}

      <div className="customer-details-grid">

        {/* ================= PERSONAL INFO ================= */}

        <div className="customer-info-card">

          <div className="customer-card-heading">

            <div className="heading-icon">
              <i className="bi bi-person"></i>
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Customer account details</p>
            </div>

          </div>

          <div className="customer-info-list">

            <div className="customer-info-row">
              <span>Name</span>

              <strong>
                {customer.name || "-"}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Email</span>

              <strong>
                {customer.email || "-"}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Phone</span>

              <strong>
                {customer.phone || "-"}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Joined</span>

              <strong>
                {formatDate(customer.createdAt)}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Email Verified</span>

              <strong>
                {customer.isEmailVerified
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Profile Completed</span>

              <strong>
                {customer.profileCompleted
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

          </div>
        </div>

        {/* ================= ADDRESS ================= */}

        <div className="customer-info-card">

          <div className="customer-card-heading">

            <div className="heading-icon">
              <i className="bi bi-geo-alt"></i>
            </div>

            <div>
              <h2>Address</h2>
              <p>Customer delivery address</p>
            </div>

          </div>

          {address ? (
            <div className="customer-address">

              {typeof address === "string" ? (
                <p>{address}</p>
              ) : (
                <>
                  {address.name && (
                    <strong>
                      {address.name}
                    </strong>
                  )}

                  {address.address && (
                    <p>
                      {address.address}
                    </p>
                  )}

                  {address.street && (
                    <p>
                      {address.street}
                    </p>
                  )}

                  {(address.city ||
                    address.state ||
                    address.pincode) && (
                    <p>
                      {[
                        address.city,
                        address.state,
                        address.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}

                  {address.country && (
                    <p>
                      {address.country}
                    </p>
                  )}

                  {address.phone && (
                    <p>
                      <i className="bi bi-telephone"></i>{" "}
                      {address.phone}
                    </p>
                  )}

                  {address.email && (
                    <p>
                      <i className="bi bi-envelope"></i>{" "}
                      {address.email}
                    </p>
                  )}
                </>
              )}

            </div>
          ) : (
            <div className="no-address">

              <i className="bi bi-geo-alt"></i>

              <span>
                No address information available.
              </span>

            </div>
          )}

        </div>
      </div>

      {/* ================= ORDER SUMMARY ================= */}

      <div className="customer-order-summary">

        <div className="summary-box">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="summary-box">
          <span>Total Spent</span>

          <strong>
            {formatCurrency(customer.totalSpent)}
          </strong>
        </div>

        <div className="summary-box">
          <span>Customer Status</span>

          <strong>
            {customer.status === "blocked"
              ? "Blocked"
              : "Active"}
          </strong>
        </div>

      </div>

      {/* ================= RECENT ORDERS ================= */}

      <div className="customer-orders-card">

        <div className="customer-card-heading">

          <div className="heading-icon">
            <i className="bi bi-bag"></i>
          </div>

          <div>
            <h2>Recent Orders</h2>

            <p>
              Orders placed by this customer
            </p>
          </div>

        </div>

        {orders.length > 0 ? (

          <div className="customer-orders-table-wrapper">

            <table className="customer-orders-table">

              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order, index) => (

                  <tr
                    key={
                      order?._id ||
                      order?.id ||
                      index
                    }
                  >

                    {/* ORDER */}

                    <td>
                      <strong>
                        {order?.orderId ||
                          order?.orderNumber ||
                          order?._id ||
                          `ORD-${index + 1}`}
                      </strong>
                    </td>

                    {/* PRODUCT */}

                    <td>

                      <div className="customer-order-product">

                        <img
                          src={getProductImage(order)}
                          alt={getProductName(order)}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                        <span>
                          {getProductName(order)}
                        </span>

                      </div>

                    </td>

                    {/* DATE */}

                    <td>
                      {formatDate(
                        order?.createdAt ||
                          order?.date
                      )}
                    </td>

                    {/* QTY */}

                    <td>
                      {getOrderQuantity(order)}
                    </td>

                    {/* AMOUNT */}

                    <td>

                      <strong>
                        {formatCurrency(
                          order?.totalAmount ??
                            order?.total ??
                            order?.amount
                        )}
                      </strong>

                    </td>

                    {/* PAYMENT */}

                    <td>
                      {getPaymentMethod(order)}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`order-status ${getOrderStatus(
                          order
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {getOrderStatus(order)}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="no-orders">

            <i className="bi bi-bag-x"></i>

            <h3>No Orders Yet</h3>

            <p>
              This customer has not placed any
              orders.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default CustomerDetails;