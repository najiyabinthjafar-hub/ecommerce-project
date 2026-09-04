import React, { useState } from "react";

import "./Banners.css";

import rizoBanner1 from "../../assets/Rizo Banner 1.png";
import rizoBanner2 from "../../assets/Rizo Banner 2.png";
import rizoBanner3 from "../../assets/Rizo Banner 3.png";

function Banners() {
  const [banners, setBanners] = useState([
  {
    id: 1,
    title: "Special Offers",
    image: rizoBanner1,
    status: "Active",
  },
  {
    id: 2,
    title: "Summer Collections",
    image: rizoBanner2,
    status: "Active",
  },
  {
    id: 3,
    title: "New Arrivals",
    image: rizoBanner3,
    status: "Inactive",
  },
]);

  const toggleStatus = (id) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status:
                banner.status === "Active" ? "Inactive" : "Active",
            }
          : banner
      )
    );
  };

  const deleteBanner = (id) => {
    setBanners((prev) =>
      prev.filter((banner) => banner.id !== id)
    );
  };

  return (
    <div className="banners-page">

      {/* Page Header */}
      <div className="banners-header">
        <div>
          <h1>Banners</h1>
          <p>Manage promotional banners for your store</p>
        </div>

        <button className="add-banner-btn">
          <i className="bi bi-plus-lg"></i>
          Add Banner
        </button>
      </div>

      {/* Banner Stats */}
      <div className="banner-stats">

        <div className="banner-stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-images"></i>
          </div>

          <div>
            <span>Total Banners</span>
            <strong>{banners.length}</strong>
          </div>
        </div>

        <div className="banner-stat-card">
          <div className="stat-icon green">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>Active</span>
            <strong>
              {
                banners.filter(
                  (banner) => banner.status === "Active"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="banner-stat-card">
          <div className="stat-icon gray">
            <i className="bi bi-pause-circle"></i>
          </div>

          <div>
            <span>Inactive</span>
            <strong>
              {
                banners.filter(
                  (banner) => banner.status === "Inactive"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* Banner Section */}
      <div className="banners-card">

        <div className="banners-card-header">
          <div>
            <h2>All Banners</h2>
            <p>View and manage your promotional banners</p>
          </div>

          <div className="banner-count">
            {banners.length} banners
          </div>
        </div>

        {/* Banner Grid */}
        <div className="banner-grid">

          {banners.length === 0 ? (
            <div className="empty-banners">
              <i className="bi bi-images"></i>
              <h3>No banners found</h3>
              <p>
                Add a banner to display promotions on your store.
              </p>
            </div>
          ) : (
            banners.map((banner) => (
              <div className="banner-item" key={banner.id}>

                {/* Banner Image */}
                <div className="banner-image-wrapper">
                  <img
                    src={banner.image}
                    alt={banner.title}
                  />

                  <span
                    className={`banner-status ${
                      banner.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {banner.status}
                  </span>
                </div>

                {/* Banner Details */}
                <div className="banner-details">

                  <div>
                    <h3>{banner.title}</h3>
                    <p>Banner #{banner.id}</p>
                  </div>

                  <div className="banner-actions">

                    {/* Toggle Status */}
                    <button
                      className="status-btn"
                      onClick={() => toggleStatus(banner.id)}
                      title="Change status"
                    >
                      <i
                        className={
                          banner.status === "Active"
                            ? "bi bi-pause"
                            : "bi bi-play"
                        }
                      ></i>
                    </button>

                    {/* Edit */}
                    <button
                      className="edit-banner-btn"
                      title="Edit banner"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    {/* Delete */}
                    <button
                      className="delete-banner-btn"
                      onClick={() => deleteBanner(banner.id)}
                      title="Delete banner"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}

export default Banners;