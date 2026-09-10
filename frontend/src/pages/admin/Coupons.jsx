import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Coupons.css";

const API_URL = "http://localhost:5000/api/coupons";

function Coupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // FETCH COUPONS
  // =========================
  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch coupons");
      }

      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // =========================
  // COUPON STATUS
  // =========================
  const getCouponStatus = (coupon) => {
    if (!coupon.expiryDate) {
      return {
        label: coupon.isActive ? "Active" : "Inactive",
        className: coupon.isActive ? "active" : "inactive",
      };
    }

    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (expiryDate < today) {
      return {
        label: "Expired",
        className: "expired",
      };
    }

    if (coupon.isActive) {
      return {
        label: "Active",
        className: "active",
      };
    }

    return {
      label: "Inactive",
      className: "inactive",
    };
  };

  // =========================
  // FORMAT DISCOUNT
  // =========================
  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }

    return `₹${Number(coupon.discountValue || 0).toLocaleString("en-IN")}`;
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  // =========================
  // EXPIRING SOON
  // =========================
  const isExpiringSoon = (coupon) => {
    if (!coupon.expiryDate) return false;

    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    const difference =
      (expiryDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return (
      coupon.isActive &&
      difference >= 0 &&
      difference <= 7
    );
  };

  // =========================
  // FILTER COUPONS
  // =========================
  const filteredCoupons = coupons.filter((coupon) => {
    const status = getCouponStatus(coupon);

    const matchesSearch = coupon.code
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      status.className === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // SUMMARY
  // =========================
  const totalCoupons = coupons.length;

  const activeCoupons = coupons.filter(
    (coupon) => getCouponStatus(coupon).className === "active"
  ).length;

  const expiringSoon = coupons.filter(isExpiringSoon).length;

  const totalUsed = coupons.reduce(
    (total, coupon) => total + Number(coupon.usedCount || 0),
    0
  );

  // =========================
  // DELETE
  // =========================
  const handleDelete = () => {
    alert(
      "Delete coupon API is not available in the current backend routes."
    );
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = () => {
    alert(
      "Update coupon API is not available in the current backend routes."
    );
  };

  return (
    <div className="coupons-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="coupons-header">
        <div>
          <h1>Coupons</h1>
          <p>Create and manage discount coupons</p>
        </div>

        <button
          type="button"
          className="add-coupon-btn"
          onClick={() => navigate("/admin/coupons/add")}
        >
          <i className="bi bi-plus-lg"></i>
          Add Coupon
        </button>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}
      <div className="coupon-summary">

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-ticket-perforated"></i>
          </div>

          <div>
            <span>Total Coupons</span>
            <strong>{totalCoupons}</strong>
          </div>
        </div>

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCoupons}</strong>
          </div>
        </div>

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-clock"></i>
          </div>

          <div>
            <span>Expiring Soon</span>
            <strong>{expiringSoon}</strong>
          </div>
        </div>

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-people"></i>
          </div>

          <div>
            <span>Total Used</span>
            <strong>{totalUsed}</strong>
          </div>
        </div>

      </div>

      {/* =========================
          COUPONS CARD
      ========================= */}
      <div className="coupons-card">

        <div className="coupons-card-header">

          <div>
            <h2>All Coupons</h2>
            <p>
              {filteredCoupons.length} coupon
              {filteredCoupons.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="coupon-filters">

            {/* SEARCH */}
            <div className="coupon-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search coupon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* STATUS */}
            <select
              className="coupon-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>

          </div>

        </div>

        {/* =========================
            TABLE
        ========================= */}
        <div className="coupons-table-wrapper">

          {loading ? (
            <div className="coupon-loading">
              Loading coupons...
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="coupon-empty">

              <i className="bi bi-ticket-perforated"></i>

              <h3>
                {coupons.length === 0
                  ? "No coupons found"
                  : "No matching coupons"}
              </h3>

              <p>
                {coupons.length === 0
                  ? "There are no coupons available yet."
                  : "Try changing your search or status filter."}
              </p>

            </div>
          ) : (
            <table className="coupons-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Min. Purchase</th>
                  <th>Expiry Date</th>
                  <th>Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredCoupons.map((coupon, index) => {

                  const status = getCouponStatus(coupon);

                  return (
                    <tr key={coupon._id || coupon.code}>

                      <td>{index + 1}</td>

                      <td>
                        <span className="coupon-code">
                          {coupon.code}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatDiscount(coupon)}
                        </strong>
                      </td>

                      <td>
                        {coupon.discountType === "percentage"
                          ? "Percentage"
                          : "Fixed"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          coupon.minimumPurchase || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {formatDate(coupon.expiryDate)}
                      </td>

                      <td>
                        {coupon.usedCount || 0}
                        {coupon.usageLimit !== null &&
                        coupon.usageLimit !== undefined
                          ? ` / ${coupon.usageLimit}`
                          : ""}
                      </td>

                      <td>
                        <span
                          className={`coupon-status ${status.className}`}
                        >
                          <span className="status-dot"></span>
                          {status.label}
                        </span>
                      </td>

                      <td>

                        <div className="coupon-actions">

                          <button
                            type="button"
                            className="view-coupon-btn"
                            title="View coupon"
                            onClick={() =>
                              alert(
                                `Coupon: ${coupon.code}`
                              )
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          <button
                            type="button"
                            className="edit-coupon-btn"
                            title="Edit coupon"
                            onClick={() =>
                              handleEdit(coupon)
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            type="button"
                            className="delete-coupon-btn"
                            title="Delete coupon"
                            onClick={() =>
                              handleDelete(coupon)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}

export default Coupons;