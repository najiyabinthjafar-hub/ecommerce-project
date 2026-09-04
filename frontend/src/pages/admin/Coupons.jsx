import React from "react";
import "./Coupons.css";

function Coupons() {
  const coupons = [
    {
      id: 1,
      code: "WELCOME10",
      discount: "10%",
      type: "Percentage",
      minOrder: "₹500",
      expiry: "30 Sep 2026",
      status: "Active",
    },
    {
      id: 2,
      code: "SAVE200",
      discount: "₹200",
      type: "Fixed",
      minOrder: "₹1,000",
      expiry: "15 Oct 2026",
      status: "Active",
    },
    {
      id: 3,
      code: "FESTIVE20",
      discount: "20%",
      type: "Percentage",
      minOrder: "₹1,500",
      expiry: "25 Sep 2026",
      status: "Expired",
    },
  ];

  return (
    <div className="coupons-page">

      {/* Page Header */}
      <div className="coupon-page-header">
        <div>
          <h1>Coupons</h1>
          <p>Create and manage discount coupons</p>
        </div>

        <button className="add-coupon-btn">
          + Add Coupon
        </button>
      </div>

      {/* Summary Cards */}
      <div className="coupon-summary">

        <div className="coupon-summary-card">
          <div className="coupon-icon blue">
            <i className="bi bi-ticket-perforated"></i>
          </div>
          <div>
            <span>Total Coupons</span>
            <h2>24</h2>
          </div>
        </div>

        <div className="coupon-summary-card">
          <div className="coupon-icon green">
            <i className="bi bi-check-circle"></i>
          </div>
          <div>
            <span>Active Coupons</span>
            <h2>18</h2>
          </div>
        </div>

        <div className="coupon-summary-card">
          <div className="coupon-icon orange">
            <i className="bi bi-clock-history"></i>
          </div>
          <div>
            <span>Expiring Soon</span>
            <h2>4</h2>
          </div>
        </div>

        <div className="coupon-summary-card">
          <div className="coupon-icon purple">
            <i className="bi bi-percent"></i>
          </div>
          <div>
            <span>Total Used</span>
            <h2>156</h2>
          </div>
        </div>

      </div>

      {/* Coupons Table */}
      <div className="coupons-card">

        <div className="coupons-card-header">
          <div>
            <h2>All Coupons</h2>
            <p>Manage your promotional discounts</p>
          </div>

          <div className="coupon-actions">
            <input
              type="text"
              placeholder="Search coupons..."
              className="coupon-search"
            />

            <select className="coupon-filter">
              <option>All Status</option>
              <option>Active</option>
              <option>Expired</option>
            </select>
          </div>
        </div>

        <div className="coupon-table-wrapper">
          <table className="coupon-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Min. Order</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>

                  <td>
                    <div className="coupon-code">
                      <i className="bi bi-ticket-perforated"></i>
                      <strong>{coupon.code}</strong>
                    </div>
                  </td>

                  <td className="discount-value">
                    {coupon.discount}
                  </td>

                  <td>{coupon.type}</td>

                  <td>{coupon.minOrder}</td>

                  <td>{coupon.expiry}</td>

                  <td>
                    <span
                      className={`coupon-status ${
                        coupon.status === "Active"
                          ? "coupon-active"
                          : "coupon-expired"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td>
                    <button className="coupon-edit-btn">
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button className="coupon-delete-btn">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Coupons;