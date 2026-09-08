
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Banners.css";

const API_URL = "http://localhost:5000/api/banners";

function Banners() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      const responseText = await response.text();

      console.log("Banner GET status:", response.status);
      console.log("Banner GET response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch banners");
      }

      setBanners(data.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Delete banner
  const handleDelete = async (banner) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${banner.title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${banner._id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();

      console.log("Delete status:", response.status);
      console.log("Delete response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete banner");
      }

      alert(data.message || "Banner deleted successfully!");

      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert(error.message);
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    navigate(`/admin/banners/edit/${banner._id}`);
  };

  return (
    <div className="banners-page">
      <div className="banners-header">
        <div>
          <h1>Banners</h1>
          <p>Manage your website banners</p>
        </div>

        <button
          className="add-banner-btn"
          onClick={() => navigate("/admin/banners/add")}
        >
          + Add Banner
        </button>
      </div>

      <div className="banners-card">
        <div className="banners-card-header">
          <div>
            <h2>All Banners</h2>
            <p>{banners.length} banners available</p>
          </div>
        </div>

        <div className="banners-table-container">
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-banner">
                    Loading banners...
                  </td>
                </tr>
              ) : banners.length > 0 ? (
                banners.map((banner, index) => (
                  <tr key={banner._id}>
                    {/* Number */}
                    <td className="banner-number">
                      {index + 1}
                    </td>

                    {/* Image */}
                    <td>
                      <div className="banner-image-wrapper">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title || "Banner"}
                            className="banner-image"
                          />
                        ) : (
                          <div className="no-banner-image">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title + Description */}
                    <td>
                      <div className="banner-title">
                        <strong>
                          {banner.title}
                        </strong>

                        {banner.description && (
                          <span>
                            {banner.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`banner-status ${
                          banner.status === "active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {banner.status}
                      </span>
                    </td>

                    {/* Start Date */}
                    <td>
                      {banner.startDate
                        ? new Date(
                            banner.startDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* End Date */}
                    <td>
                      {banner.endDate
                        ? new Date(
                            banner.endDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="banner-actions">
                        <button
                          className="edit-banner-btn"
                          onClick={() => handleEdit(banner)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-banner-btn"
                          onClick={() =>
                            handleDelete(banner)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="no-banner"
                  >
                    No banners found
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

export default Banners;

