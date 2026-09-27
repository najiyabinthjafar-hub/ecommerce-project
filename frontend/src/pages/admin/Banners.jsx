import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Banners.css";

const API_URL = "http://localhost:5000/api/banners";

function Banners() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================================================
  // FETCH BANNERS FROM BACKEND
  // =========================================================

  const fetchBanners = async (showLoading = false) => {
    try {
      // Only show full-page loading during initial load
      if (showLoading) {
        setLoading(true);
      }

      // -----------------------------------------------------
      // Build backend query
      // -----------------------------------------------------

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      // Backend supports active/inactive.
      // Expired is calculated on frontend because
      // backend getAllBanners only filters status.

      if (
        statusFilter !== "all" &&
        statusFilter !== "expired"
      ) {
        params.append("status", statusFilter);
      }

      const queryString = params.toString();

      const url = queryString
        ? `${API_URL}?${queryString}`
        : API_URL;

      const response = await fetch(url);

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch banners"
        );
      }

      setBanners(
        Array.isArray(data.banners)
          ? data.banners
          : []
      );
    } catch (error) {
      console.error("Error fetching banners:", error);

      alert(error.message);

      setBanners([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchBanners(true);
  }, []);

  // =========================================================
  // FETCH WHEN SEARCH / FILTER CHANGES
  // =========================================================

  useEffect(() => {
    // Don't run immediately on first render.
    // Initial fetch above already handles that.

    const timer = setTimeout(() => {
      fetchBanners(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // =========================================================
  // DELETE BANNER
  // =========================================================

  const handleDelete = async (banner) => {
    const bannerId = banner._id || banner.id;

    if (!bannerId) {
      alert("Banner ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${banner.title}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/${bannerId}`,
        {
          method: "DELETE",
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete banner"
        );
      }

      alert(
        data.message ||
          "Banner deleted successfully"
      );

      // Refresh backend data
      // without showing the full-page loader
      fetchBanners(false);
    } catch (error) {
      console.error(
        "Error deleting banner:",
        error
      );

      alert(error.message);
    }
  };

  // =========================================================
  // EDIT BANNER
  // =========================================================

  const handleEdit = (banner) => {
    const bannerId = banner._id || banner.id;

    if (!bannerId) {
      alert("Banner ID not found");
      return;
    }

    navigate(
      `/admin/banners/edit/${bannerId}`
    );
  };

  // =========================================================
  // VIEW BANNER
  // =========================================================

  const handleView = (banner) => {
    const bannerId = banner._id || banner.id;

    if (!bannerId) {
      alert("Banner ID not found");
      return;
    }

    navigate(
      `/admin/banners/view/${bannerId}`
    );
  };

  // =========================================================
  // GET BANNER STATUS
  // =========================================================

  const getBannerStatus = (banner) => {
    const now = new Date();

    // -------------------------------------------------------
    // Expired
    // -------------------------------------------------------

    if (
      banner.endDate &&
      new Date(banner.endDate).getTime() <
        now.getTime()
    ) {
      return {
        label: "Expired",
        className: "expired",
      };
    }

    // -------------------------------------------------------
    // Active
    // -------------------------------------------------------

    if (banner.status === "active") {
      return {
        label: "Active",
        className: "active",
      };
    }

    // -------------------------------------------------------
    // Inactive
    // -------------------------------------------------------

    return {
      label: "Inactive",
      className: "inactive",
    };
  };

  // =========================================================
  // FRONTEND FILTER
  // =========================================================

  // Backend handles:
  // - Search
  // - Active
  // - Inactive
  //
  // Frontend only handles Expired because it is calculated
  // using endDate.

  const filteredBanners = banners.filter(
    (banner) => {
      if (statusFilter === "expired") {
        const bannerStatus =
          getBannerStatus(banner);

        return (
          bannerStatus.className ===
          "expired"
        );
      }

      return true;
    }
  );

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const formattedDate = new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "-";
    }

    return formattedDate.toLocaleDateString(
      "en-GB"
    );
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="banners-page">
        <div className="banners-loading">
          <i className="bi bi-arrow-repeat"></i>
          Loading banners...
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="banners-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="banners-header">
        <div className="banners-header-content">
          <h1>Banners</h1>

          <p>
            Manage promotional banners
          </p>
        </div>

        <button
          type="button"
          className="add-banner-btn"
          onClick={() =>
            navigate("/admin/banners/add")
          }
        >
          <i className="bi bi-plus-lg"></i>
          Add Banner
        </button>
      </div>

      {/* =====================================================
          BANNERS CARD
      ===================================================== */}

      <div className="banners-card">

        {/* ===================================================
            CARD HEADER
        =================================================== */}

        <div className="banners-card-header">

          <div>
            <h2>Banners</h2>

            <span className="banner-count">
              {filteredBanners.length}{" "}
              {filteredBanners.length === 1
                ? "banner"
                : "banners"}
            </span>
          </div>

          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="banner-filters">

            {/* SEARCH */}

            <div className="banner-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search banners..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            {/* STATUS FILTER */}

            <select
              className="banner-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
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

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="banners-table-wrapper">

          {filteredBanners.length === 0 ? (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="banners-empty">

              <i className="bi bi-image"></i>

              <h3>
                {search ||
                statusFilter !== "all"
                  ? "No matching banners"
                  : "No banners found"}
              </h3>

              <p>
                {search ||
                statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Add your first banner to get started."}
              </p>

            </div>

          ) : (

            /* =================================================
               BANNERS TABLE
            ================================================= */

            <table className="banners-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Banner</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredBanners.map(
                  (banner, index) => {

                    const bannerStatus =
                      getBannerStatus(
                        banner
                      );

                    return (
                      <tr
                        key={
                          banner._id ||
                          banner.id
                        }
                      >

                        {/* NUMBER */}

                        <td className="banner-number">
                          {index + 1}
                        </td>

                        {/* IMAGE */}

                        <td>
                          <div className="banner-image-wrapper">

                            {banner.image ? (

                              <img
                                src={
                                  banner.image
                                }
                                alt={
                                  banner.title ||
                                  "Banner"
                                }
                                className="banner-image"
                              />

                            ) : (

                              <div className="banner-no-image">
                                <i className="bi bi-image"></i>
                              </div>

                            )}

                          </div>
                        </td>

                        {/* TITLE */}

                        <td>
                          <div className="banner-title-cell">

                            <strong>
                              {banner.title ||
                                "-"}
                            </strong>

                            {banner.description && (
                              <span>
                                {
                                  banner.description
                                }
                              </span>
                            )}

                          </div>
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`banner-status ${bannerStatus.className}`}
                          >
                            <span className="status-dot"></span>

                            {
                              bannerStatus.label
                            }
                          </span>

                        </td>

                        {/* START DATE */}

                        <td>
                          {formatDate(
                            banner.startDate
                          )}
                        </td>

                        {/* END DATE */}

                        <td>
                          {formatDate(
                            banner.endDate
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="banner-actions">

                            {/* VIEW */}

                            <button
                              type="button"
                              className="view-banner-btn"
                              title="View banner"
                              aria-label="View banner"
                              onClick={() =>
                                handleView(
                                  banner
                                )
                              }
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              className="edit-banner-btn"
                              title="Edit banner"
                              aria-label="Edit banner"
                              onClick={() =>
                                handleEdit(
                                  banner
                                )
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-banner-btn"
                              title="Delete banner"
                              aria-label="Delete banner"
                              onClick={() =>
                                handleDelete(
                                  banner
                                )
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
          )}

        </div>
      </div>
    </div>
  );
}

export default Banners;