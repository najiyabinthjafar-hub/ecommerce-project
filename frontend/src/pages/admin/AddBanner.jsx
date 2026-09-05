import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBanner.css";

function AddBanner() {
  const navigate = useNavigate();

  const [banner, setBanner] = useState({
    title: "",
    description: "",
    link: "",
    status: "Active",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setBanner({
      ...banner,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Banner:", banner);
    console.log("Image:", image);

    alert("Banner added successfully!");

    navigate("/admin/banners");
  };

  return (
    <div className="add-banner-page">
      <div className="add-banner-content">

        {/* Header */}
        <div className="add-banner-header">
          <div className="add-banner-heading">
            <h1>Add Banner</h1>
            <p>Create a new promotional banner for your store</p>
          </div>

          <button
            type="button"
            className="back-banners-btn"
            onClick={() => navigate("/admin/banners")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Banners
          </button>
        </div>

        {/* Form Card */}
        <div className="add-banner-card">
          <form onSubmit={handleSubmit}>

            {/* Banner Title */}
            <div className="form-group">
              <label>Banner Title</label>

              <input
                type="text"
                name="title"
                placeholder="Example: Summer Sale"
                value={banner.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter banner description..."
                value={banner.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            {/* Link + Status */}
            <div className="form-row">

              <div className="form-group">
                <label>Banner Link</label>

                <input
                  type="text"
                  name="link"
                  placeholder="/shop"
                  value={banner.link}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={banner.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* Banner Image */}
            <div className="form-group">
              <label>Banner Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

              <small>
                Upload a suitable banner image for your store.
              </small>
            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-banner-btn"
                onClick={() => navigate("/admin/banners")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-banner-btn"
              >
                <i className="bi bi-plus-lg"></i>
                Add Banner
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddBanner;