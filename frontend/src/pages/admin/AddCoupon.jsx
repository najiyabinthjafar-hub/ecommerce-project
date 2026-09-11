import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCoupon.css";

const API_URL = "http://localhost:5000/api/coupons";

function AddCoupon() {
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumPurchase: "",
    maximumDiscount: "",
    usageLimit: "",
    expiryDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coupon.code.trim()) {
      alert("Please enter coupon code");
      return;
    }

    if (
      !coupon.discountValue ||
      Number(coupon.discountValue) <= 0
    ) {
      alert("Please enter a valid discount value");
      return;
    }

    if (
      coupon.discountType === "percentage" &&
      Number(coupon.discountValue) > 100
    ) {
      alert("Percentage discount cannot be more than 100%");
      return;
    }

    if (!coupon.expiryDate) {
      alert("Please select expiry date");
      return;
    }

    if (
      coupon.minimumPurchase !== "" &&
      Number(coupon.minimumPurchase) < 0
    ) {
      alert("Minimum purchase cannot be negative");
      return;
    }

    if (
      coupon.maximumDiscount !== "" &&
      Number(coupon.maximumDiscount) < 0
    ) {
      alert("Maximum discount cannot be negative");
      return;
    }

    if (
      coupon.usageLimit !== "" &&
      Number(coupon.usageLimit) < 1
    ) {
      alert("Usage limit must be at least 1");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: coupon.code.trim().toUpperCase(),

          discountType: coupon.discountType,

          discountValue: Number(coupon.discountValue),

          minimumPurchase:
            coupon.minimumPurchase === ""
              ? 0
              : Number(coupon.minimumPurchase),

          maximumDiscount:
            coupon.maximumDiscount === ""
              ? null
              : Number(coupon.maximumDiscount),

          usageLimit:
            coupon.usageLimit === ""
              ? null
              : Number(coupon.usageLimit),

          expiryDate: coupon.expiryDate,

          isActive: coupon.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create coupon"
        );
      }

      alert(data.message || "Coupon created successfully");

      navigate("/admin/coupons");
    } catch (error) {
      console.error("Error creating coupon:", error);

      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-coupon-page">

      {/* Header */}
      <div className="add-coupon-header">
        <div>
          <h1>Add Coupon</h1>
          <p>Create a new discount coupon</p>
        </div>

        <button
          type="button"
          className="back-coupon-btn"
          onClick={() => navigate("/admin/coupons")}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Coupons
        </button>
      </div>

      {/* Coupon Card */}
      <div className="add-coupon-card">

        <form onSubmit={handleSubmit}>

          {/* Coupon Details */}
          <div className="form-section">

            <h2>Coupon Details</h2>

            <div className="form-grid">

              {/* Coupon Code */}
              <div className="form-group">
                <label>
                  Coupon Code <span>*</span>
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="Example: SAVE20"
                  value={coupon.code}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Discount Type */}
              <div className="form-group">
                <label>
                  Discount Type <span>*</span>
                </label>

                <select
                  name="discountType"
                  value={coupon.discountType}
                  onChange={handleChange}
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed Amount
                  </option>
                </select>
              </div>

              {/* Discount Value */}
              <div className="form-group">
                <label>
                  Discount Value <span>*</span>
                </label>

                <div className="input-with-symbol">

                  <input
                    type="number"
                    name="discountValue"
                    placeholder="Enter discount"
                    min="0"
                    value={coupon.discountValue}
                    onChange={handleChange}
                    required
                  />

                  <span>
                    {coupon.discountType === "percentage"
                      ? "%"
                      : "₹"}
                  </span>

                </div>
              </div>

              {/* Minimum Purchase */}
              <div className="form-group">
                <label>Minimum Purchase</label>

                <div className="input-with-symbol">

                  <input
                    type="number"
                    name="minimumPurchase"
                    placeholder="0"
                    min="0"
                    value={coupon.minimumPurchase}
                    onChange={handleChange}
                  />

                  <span>₹</span>

                </div>
              </div>

              {/* Maximum Discount */}
              <div className="form-group">
                <label>Maximum Discount</label>

                <div className="input-with-symbol">

                  <input
                    type="number"
                    name="maximumDiscount"
                    placeholder="No limit"
                    min="0"
                    value={coupon.maximumDiscount}
                    onChange={handleChange}
                  />

                  <span>₹</span>

                </div>
              </div>

              {/* Usage Limit */}
              <div className="form-group">
                <label>Usage Limit</label>

                <input
                  type="number"
                  name="usageLimit"
                  placeholder="Unlimited"
                  min="1"
                  value={coupon.usageLimit}
                  onChange={handleChange}
                />
              </div>

              {/* Expiry Date */}
              <div className="form-group">
                <label>
                  Expiry Date <span>*</span>
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={coupon.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>

          {/* Status */}
          <div className="coupon-status-section">

            <div>
              <h3>Coupon Status</h3>

              <p>
                Enable this coupon immediately after creation.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                name="isActive"
                checked={coupon.isActive}
                onChange={handleChange}
              />

              <span className="slider"></span>

            </label>

          </div>

          {/* Actions */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-coupon-btn"
              onClick={() => navigate("/admin/coupons")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-coupon-btn"
              disabled={loading}
            >
              <i className="bi bi-check-lg"></i>

              {loading
                ? "Creating..."
                : "Create Coupon"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddCoupon;