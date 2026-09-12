import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Coupons.css";

const API_URL = "http://localhost:5000/api/coupons";

function Coupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH COUPONS
  ========================= */

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

  /* =========================
     GET STATUS
  ========================= */

  const getCouponStatus = (coupon) => {
    if (coupon.expiryDate) {
      const expiryDate = new Date(coupon.expiryDate);

      if (expiryDate < new Date()) {
        return "Expired";
      }
    }

    return coupon.isActive ? "Active" : "Inactive";
  };

  /* =========================
     FORMAT DISCOUNT
  ========================= */

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }

    return `₹${Number(
      coupon.discountValue || 0
    ).toLocaleString("en-IN")}`;
  };

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  /* =========================
     FILTER COUPONS
  ========================= */

  const filteredCoupons = coupons.filter((coupon) => {
    const status = getCouponStatus(coupon);

    const matchesSearch = coupon.code
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  /* =========================
     SUMMARY
  ========================= */

  const totalCoupons = coupons.length;

  const activeCoupons = coupons.filter(
    (coupon) => getCouponStatus(coupon) === "Active"
  ).length;

  const expiringSoon = coupons.filter((coupon) => {
    if (!coupon.expiryDate) return false;

    const today = new Date();
    const expiry = new Date(coupon.expiryDate);

    const difference =
      (expiry - today) / (1000 * 60 * 60 * 24);

    return difference >= 0 && difference <= 7;
  }).length;

  const totalUsed = coupons.reduce(
    (total, coupon) =>
      total + Number(coupon.usedCount || 0),
    0
  );

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (coupon) => {
    alert(
      `Delete API is not available yet for ${coupon.code}`
    );
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (coupon) => {
    navigate(`/admin/coupons/edit/${coupon._id}`);
  };

  return (
    <div className="coupons-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="coupons-header">
        <div>
          <h1>Coupons</h1>

          <p>
            Manage discount coupons and promotions
          </p>
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

        {/* Total Coupons */}

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-ticket-perforated"></i>
          </div>

          <div>
            <span>Total Coupons</span>
            <h3>{totalCoupons}</h3>
          </div>
        </div>


        {/* Active Coupons */}

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>Active Coupons</span>
            <h3>{activeCoupons}</h3>
          </div>
        </div>


        {/* Expiring Soon */}

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-clock"></i>
          </div>

          <div>
            <span>Expiring Soon</span>
            <h3>{expiringSoon}</h3>
          </div>
        </div>


        {/* Total Used */}

        <div className="coupon-summary-card">
          <div className="coupon-summary-icon">
            <i className="bi bi-graph-up"></i>
          </div>

          <div>
            <span>Total Used</span>
            <h3>{totalUsed}</h3>
          </div>
        </div>

      </div>


      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="coupons-table-card">

        {/* =========================
            CARD HEADER
        ========================= */}

        <div className="coupons-card-header">

          <div>
            <h2>All Coupons</h2>

            <p>
              Manage and monitor your discount coupons
            </p>
          </div>


          {/* =========================
              SEARCH + FILTER
          ========================= */}

          <div className="coupon-filter-bar">

            <div className="coupon-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search coupon code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>


            <div className="coupon-status-filter">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="expired">
                  Expired
                </option>
              </select>
            </div>

          </div>

        </div>


        {/* =========================
            TABLE / LOADING / EMPTY
        ========================= */}

        {loading ? (

          <div className="coupon-loading">
            Loading coupons...
          </div>

        ) : filteredCoupons.length === 0 ? (

          <div className="coupon-empty">

            <i className="bi bi-ticket-perforated"></i>

            <h3>
              No Coupons Found
            </h3>

            <p>
              No coupons match your search or filter.
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="coupons-table">

              {/* =========================
                  TABLE HEADER
              ========================= */}

              <thead>
                <tr>
                  <th>#</th>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Min Purchase</th>
                  <th>Expiry Date</th>
                  <th>Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>


              {/* =========================
                  TABLE BODY
              ========================= */}

              <tbody>

                {filteredCoupons.map(
                  (coupon, index) => {

                    const status =
                      getCouponStatus(coupon);

                    return (
                      <tr key={coupon._id}>

                        {/* NUMBER */}

                        <td>
                          {index + 1}
                        </td>


                        {/* COUPON CODE */}

                        <td>
                          <div className="coupon-code">
                            {coupon.code}
                          </div>
                        </td>


                        {/* DISCOUNT */}

                        <td>
                          <strong>
                            {formatDiscount(coupon)}
                          </strong>
                        </td>


                        {/* TYPE */}

                        <td>
                          {coupon.discountType ===
                          "percentage"
                            ? "Percentage"
                            : "Fixed"}
                        </td>


                        {/* MIN PURCHASE */}

                        <td>
                          ₹
                          {Number(
                            coupon.minimumPurchase || 0
                          ).toLocaleString("en-IN")}
                        </td>


                        {/* EXPIRY DATE */}

                        <td>
                          {formatDate(
                            coupon.expiryDate
                          )}
                        </td>


                        {/* USED */}

                        <td>
                          {coupon.usedCount || 0}
                        </td>


                        {/* STATUS */}

                        <td>
                          <span
                            className={`coupon-status ${status.toLowerCase()}`}
                          >
                            <span className="status-dot"></span>

                            {status}
                          </span>
                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="coupon-actions">

                            {/* VIEW */}

                            <button
                              type="button"
                              className="view-coupon-btn"
                              title="View coupon"
                              onClick={() =>
                                navigate(
                                  `/admin/coupons/view/${coupon._id}`
                                )
                              }
                            >
                              <i className="bi bi-eye"></i>
                            </button>


                            {/* EDIT */}

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


                            {/* DELETE */}

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
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Coupons;