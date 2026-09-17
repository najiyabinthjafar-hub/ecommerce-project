
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Coupons.css";

const API_URL = "http://localhost:5000/api/coupons";

function Coupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH COUPONS
  ========================================================= */

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/all`, {
        cache: "no-store",
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        throw new Error(
          `Server returned ${response.status}. ${text.slice(
            0,
            100
          )}`
        );
      }

      const data = await response.json();

      console.log("COUPONS API RESPONSE:", data);
      console.log("COUPONS FROM API:", data.coupons);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch coupons"
        );
      }

      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);

      alert(
        error.message || "Failed to fetch coupons"
      );

      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* =========================================================
     COUPON STATUS
  ========================================================= */

  const getCouponStatus = (coupon) => {
    // Backend field is `expiry`
    if (coupon.expiry) {
      const expiryDate = new Date(coupon.expiry);

      if (expiryDate < new Date()) {
        return "Expired";
      }
    }

    return coupon.isActive ? "Active" : "Inactive";
  };

  /* =========================================================
     DISCOUNT FORMAT
  ========================================================= */

  const formatDiscount = (coupon) => {
    const discountValue = Number(
      coupon.discountValue || 0
    );

    if (coupon.discountType === "percentage") {
      return `${discountValue}%`;
    }

    return `₹${discountValue.toLocaleString("en-IN")}`;
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB");
  };

  /* =========================================================
     FILTER COUPONS
  ========================================================= */

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        coupon.code
          ?.toLowerCase()
          .includes(searchValue);

      const status = getCouponStatus(coupon);

      const matchesStatus =
        statusFilter === "all" ||
        status.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalCoupons = coupons.length;

  const activeCoupons = coupons.filter(
    (coupon) =>
      getCouponStatus(coupon) === "Active"
  ).length;

  const expiringSoon = coupons.filter(
    (coupon) => {
      // Backend field is `expiry`
      if (!coupon.expiry) {
        return false;
      }

      const expiryDate = new Date(coupon.expiry);
      const today = new Date();

      const difference =
        expiryDate.getTime() -
        today.getTime();

      const days =
        difference /
        (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 7;
    }
  ).length;

  const totalUsed = coupons.reduce(
    (total, coupon) =>
      total + Number(coupon.usedCount || 0),
    0
  );

  /* =========================================================
     DELETE COUPON
  ========================================================= */

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon "${coupon.code}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${coupon._id}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          `Server returned ${response.status}. ${text.slice(
            0,
            100
          )}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete coupon"
        );
      }

      alert(
        data.message ||
          "Coupon deleted successfully"
      );

      fetchCoupons();
    } catch (error) {
      console.error(
        "Error deleting coupon:",
        error
      );

      alert(
        error.message ||
          "Failed to delete coupon"
      );
    }
  };

  /* =========================================================
     EDIT COUPON
  ========================================================= */

  const handleEdit = (coupon) => {
    navigate(
      `/admin/coupons/edit/${coupon._id}`
    );
  };

  /* =========================================================
     VIEW COUPON
  ========================================================= */

  const handleView = (coupon) => {
    navigate(
      `/admin/coupons/view/${coupon._id}`
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="coupons-page">
        <div className="coupons-loading">
          Loading coupons...
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="coupons-page">

      {/* HEADER */}

      <div className="coupons-header">
        <div>
          <h1>Coupons</h1>

          <p>
            Manage discount coupons and
            promotional offers
          </p>
        </div>

        <button
          type="button"
          className="add-coupon-btn"
          onClick={() =>
            navigate("/admin/coupons/add")
          }
        >
          <i className="bi bi-plus-lg"></i>
          Add Coupon
        </button>
      </div>

      {/* SUMMARY CARDS */}

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
            <span>Active Coupons</span>
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

      {/* FILTER BAR */}

      <div className="coupon-filter-bar">

        <div className="coupon-search">
          <i className="bi bi-search"></i>

          <input
            id="couponSearch"
            name="couponSearch"
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="coupon-status-filter">
          <label htmlFor="couponStatus">
            Status
          </label>

          <select
            id="couponStatus"
            name="couponStatus"
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

      {/* TABLE */}

      <div className="coupons-table-card">

        <div className="coupons-table-wrapper">

          <table className="coupons-table">

            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Minimum Purchase</th>
                <th>Usage</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredCoupons.length > 0 ? (

                filteredCoupons.map((coupon) => {

                  const status =
                    getCouponStatus(coupon);

                  return (
                    <tr
                      key={coupon._id}
                    >

                      {/* CODE */}

                      <td>
                        <div className="coupon-code">
                          {coupon.code}
                        </div>
                      </td>

                      {/* TYPE */}

                      <td>
                        <span className="coupon-type">
                          {coupon.couponType ===
                          "category"
                            ? "Category"
                            : coupon.couponType ===
                              "product"
                            ? "Product"
                            : "General"}
                        </span>
                      </td>

                      {/* DISCOUNT */}

                      <td>
                        <strong className="coupon-discount">
                          {formatDiscount(coupon)}
                        </strong>
                      </td>

                      {/* MINIMUM PURCHASE */}

                      <td>
                        ₹
                        {Number(
                          coupon.minimumPurchase ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* USAGE */}

                      <td>
                        <span className="coupon-usage">
                          {coupon.usedCount || 0}
                          /
                          {coupon.usageLimit ||
                            0}
                        </span>
                      </td>

                      {/* EXPIRY DATE */}

                      <td>
                        {formatDate(
                          coupon.expiry
                        )}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`coupon-status status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="coupon-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="view-action"
                            title="View"
                            aria-label={`View ${coupon.code}`}
                            onClick={() =>
                              handleView(coupon)
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className="edit-action"
                            title="Edit"
                            aria-label={`Edit ${coupon.code}`}
                            onClick={() =>
                              handleEdit(coupon)
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="delete-action"
                            title="Delete"
                            aria-label={`Delete ${coupon.code}`}
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
                })

              ) : (

                <tr>
                  <td
                    colSpan="8"
                    className="no-coupons"
                  >
                    <div>
                      <i className="bi bi-ticket-perforated"></i>

                      <p>
                        No coupons found
                      </p>

                      <span>
                        Try changing your
                        search or filter.
                      </span>
                    </div>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Coupons;

