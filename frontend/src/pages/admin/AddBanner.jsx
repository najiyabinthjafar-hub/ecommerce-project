import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBanner.css";

const API_URL = "http://localhost:5000/api/banners";

function AddBanner() {
  const navigate = useNavigate();

  const [banner, setBanner] = useState({
    title: "",
    description: "",
    link: "",
    status: "active",
    startDate: "",
    endDate: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text/select/date changes
  const handleChange = (e) => {
    setBanner({
      ...banner,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      setImage(null);
      return;
    }

    // Only allow image files
    if (!selectedImage.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedImage);
  };

  // Submit banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!banner.title.trim()) {
      alert("Please enter banner title.");
      return;
    }

    if (!banner.description.trim()) {
      alert("Please enter banner description.");
      return;
    }

    if (!image) {
      alert("Please select a banner image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", banner.title.trim());
      formData.append("description", banner.description.trim());
      formData.append("link", banner.link.trim());
      formData.append("status", banner.status);

      if (banner.startDate) {
        formData.append("startDate", banner.startDate);
      }

      if (banner.endDate) {
        formData.append("endDate", banner.endDate);
      }

      // Image field
      formData.append("image", image);

      console.log("Submitting banner...");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      // Read response as text first
      const responseText = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add banner");
      }

      alert(data.message || "Banner added successfully!");

      navigate("/admin/banners");
    } catch (error) {
      console.error("Error adding banner:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* Start Date + End Date */}
            <div className="form-row">

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={banner.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={banner.endDate}
                  onChange={handleChange}
                />
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

              {/* Image Preview */}
              {image && (
                <div className="banner-image-preview">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Banner preview"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-banner-btn"
                onClick={() => navigate("/admin/banners")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-banner-btn"
                disabled={loading}
              >
                <i className="bi bi-plus-lg"></i>

                {loading ? "Adding..." : "Add Banner"}
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddBanner;