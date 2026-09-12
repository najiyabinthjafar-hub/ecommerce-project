import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewCoupon.css";

const API_URL = "http://localhost:5000/api/coupons";

function ViewCoupon() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================================
     FETCH COUPON
  ================================= */

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await fetch(`${API_URL}/all`);

        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();

        const foundCoupon = (data.coupons || []).find(
          (item) => item._id === id
        );

        setCoupon(foundCoupon || null);
      } catch (error) {
        console.error("Error fetching coupon:", error);
        setCoupon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  /* ================================
     GET COUPON STATUS
  ================================= */

  const getCouponStatus = () => {
    if (!coupon) return "inactive";

    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (expiryDate < now) {
      return "expired";
    }

    return coupon.isActive ? "active" : "inactive";
  };

  /* ================================
     FORMAT DISCOUNT
  ================================= */

  const formatDiscount = () => {
    if (!coupon) return "-";

    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }

    return `₹${coupon.discountValue}`;
  };

  /* ================================
     FORMAT DATE
  ================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="view-coupon-page">
        <div className="view-coupon-loading">
          Loading coupon...
        </div>
      </div>
    );
  }

  /* ================================
     COUPON NOT FOUND
  ================================= */

  if (!coupon) {
    return (
      <div className="view-coupon-page">
        <div className="view-coupon-empty">
          <i className="bi bi-ticket-perforated"></i>

          <h2>Coupon Not Found</h2>

          <p>
            The coupon you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/admin/coupons")}
          >
            Back to Coupons
          </button>
        </div>
      </div>
    );
  }

  const status = getCouponStatus();

  /* ================================
     PAGE
  ================================= */

  return (
    <div className="view-coupon-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="view-coupon-header">
        <h1>View Coupon</h1>

        <p>
          View complete details of this coupon.
        </p>
      </div>

      {/* ================================
          MAIN CARD
      ================================= */}

      <div className="view-coupon-card">

        {/* ================================
            COUPON TOP SECTION
        ================================= */}

        <div className="view-coupon-top">

          <div className="coupon-main-info">

            <div className="coupon-icon">
              <i className="bi bi-ticket-perforated"></i>
            </div>

            <div>
              <span className="coupon-label">
                Coupon Code
              </span>

              <h2>{coupon.code}</h2>
            </div>

          </div>

          {/* Status */}

          <div className={`view-status ${status}`}>
            <span className="status-dot"></span>

            {status === "expired"
              ? "Expired"
              : status === "active"
              ? "Active"
              : "Inactive"}
          </div>

        </div>

        {/* ================================
            COUPON DETAILS
        ================================= */}

        <div className="coupon-details-grid">

          {/* Discount */}

          <div className="coupon-detail-item">
            <span>Discount</span>

            <strong>
              {formatDiscount()}
            </strong>
          </div>

          {/* Discount Type */}

          <div className="coupon-detail-item">
            <span>Discount Type</span>

            <strong>
              {coupon.discountType === "percentage"
                ? "Percentage"
                : "Fixed Amount"}
            </strong>
          </div>

          {/* Minimum Purchase */}

          <div className="coupon-detail-item">
            <span>Minimum Purchase</span>

            <strong>
              ₹{coupon.minimumPurchase || 0}
            </strong>
          </div>

          {/* Maximum Discount */}

          <div className="coupon-detail-item">
            <span>Maximum Discount</span>

            <strong>
              {coupon.maximumDiscount
                ? `₹${coupon.maximumDiscount}`
                : "No Limit"}
            </strong>
          </div>

          {/* Usage Limit */}

          <div className="coupon-detail-item">
            <span>Usage Limit</span>

            <strong>
              {coupon.usageLimit || "Unlimited"}
            </strong>
          </div>

          {/* Used Count */}

          <div className="coupon-detail-item">
            <span>Used Count</span>

            <strong>
              {coupon.usedCount || 0}
            </strong>
          </div>

          {/* Created Date */}

          <div className="coupon-detail-item">
            <span>Created Date</span>

            <strong>
              {formatDate(coupon.createdAt)}
            </strong>
          </div>

          {/* Expiry Date */}

          <div className="coupon-detail-item">
            <span>Expiry Date</span>

            <strong>
              {formatDate(coupon.expiryDate)}
            </strong>
          </div>

        </div>

        {/* ================================
            ACTION BUTTONS
        ================================= */}

        <div className="view-coupon-actions">

          {/* Back */}

          <button
            className="coupon-back-btn"
            onClick={() => navigate("/admin/coupons")}
          >
            <i className="bi bi-arrow-left"></i>

            Back
          </button>

          {/* Edit */}

          <button
            className="coupon-edit-btn"
            onClick={() =>
              navigate(
                `/admin/coupons/edit/${coupon._id}`
              )
            }
          >
            <i className="bi bi-pencil"></i>

            Edit Coupon
          </button>

        </div>

      </div>
    </div>
  );
}

export default ViewCoupon;