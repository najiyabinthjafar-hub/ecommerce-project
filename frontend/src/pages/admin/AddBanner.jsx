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

  // Maximum image size: 5MB
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

    // Maximum file size: 5MB
    if (selectedImage.size > MAX_IMAGE_SIZE) {
      alert(
        "Image size must be 5MB or less. Please choose a smaller image."
      );
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

    // Final 5MB validation before upload
    if (image.size > MAX_IMAGE_SIZE) {
      alert(
        "Image size must be 5MB or less. Please choose a smaller image."
      );
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // STEP 1: CREATE BANNER DETAILS
      // ==========================================

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: banner.title.trim(),
          description: banner.description.trim(),
          link: banner.link.trim(),
          status: banner.status,

          ...(banner.startDate && {
            startDate: banner.startDate,
          }),

          ...(banner.endDate && {
            endDate: banner.endDate,
          }),
        }),
      });

      // Read response as text first
      const responseText = await response.text();

      console.log("Create Banner Status:", response.status);
      console.log("Create Banner Response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create banner");
      }

      // Get newly created banner ID
      const bannerId = data.banner?._id;

      if (!bannerId) {
        throw new Error(
          "Banner created, but banner ID was not returned."
        );
      }

      // ==========================================
      // STEP 2: UPLOAD BANNER IMAGE
      // ==========================================

      const formData = new FormData();

      formData.append("image", image);

      const imageResponse = await fetch(
        `${API_URL}/${bannerId}/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Read image upload response as text
      const imageResponseText = await imageResponse.text();

      console.log(
        "Upload Image Status:",
        imageResponse.status
      );

      console.log(
        "Upload Image Response:",
        imageResponseText
      );

      let imageData;

      try {
        imageData = JSON.parse(imageResponseText);
      } catch {
        throw new Error(
          `Image upload returned non-JSON response (${imageResponse.status})`
        );
      }

      if (!imageResponse.ok) {
        throw new Error(
          imageData.message ||
            "Banner created, but image upload failed."
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      alert("Banner added successfully!");

      navigate("/admin/banners");
    } catch (error) {
      console.error("Error adding banner:", error);

      alert(
        error.message || "Something went wrong"
      );
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

            <p>
              Create a new promotional banner for your store
            </p>
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
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
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

              {/* Image Guidelines */}
              <small className="image-upload-note">
                <i className="bi bi-info-circle"></i>

                Maximum image size: <strong>5MB</strong>
                {" • "}
                Only image files are allowed.
              </small>

              {/* Selected Image Size */}
              {image && (
                <small className="selected-image-size">
                  Selected image:{" "}
                  <strong>
                    {(image.size / (1024 * 1024)).toFixed(2)} MB
                  </strong>
                </small>
              )}

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

                {loading
                  ? "Adding..."
                  : "Add Banner"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddBanner;