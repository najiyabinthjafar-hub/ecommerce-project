import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddProduct.css";

const PRODUCT_API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    sku: "",
    name: "",
    category: "",
    regularPrice: "",
    salePrice: "",
    stock: "",
    variants: [],
    description: "",
    status: "active",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // =========================
  // FETCH PRODUCT
  // =========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${PRODUCT_API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        const p = data.product;

        setProduct({
          sku: p.sku || "",
          name: p.name || "",
          category: p.category?._id || p.category || "",
          regularPrice: p.regularPrice ?? "",
          salePrice: p.salePrice ?? "",
          stock: p.stock ?? "",
          variants: p.variants || [],
          description: p.description || "",
          status: p.status || "active",
          images: p.images || [],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        alert(error.message || "Failed to load product");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORY_API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        const categoryList = Array.isArray(data)
          ? data
          : data.categories || data.data || [];

        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SIZE CHANGE
  // =========================
  const handleSizeChange = (size) => {
    setProduct((prev) => {
      const alreadySelected = prev.variants.includes(size);

      return {
        ...prev,
        variants: alreadySelected
          ? prev.variants.filter((item) => item !== size)
          : [...prev.variants, size],
      };
    });
  };

  // =========================
  // REMOVE EXISTING IMAGE
  // =========================
  const handleRemoveExistingImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  // =========================
  // NEW IMAGE SELECT
  // =========================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    // Maximum 5 images total for backend upload
    if (selectedFiles.length > 5) {
      alert("You can select a maximum of 5 images at a time.");
      e.target.value = "";
      return;
    }

    setNewImages(selectedFiles);

    const previews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImagePreviews(previews);
  };

  // =========================
  // REMOVE NEW IMAGE
  // =========================
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );

    setNewImagePreviews((prev) => {
      const previewToRemove = prev[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return prev.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      // =========================
      // VALIDATION
      // =========================
      if (!product.sku.trim()) {
        throw new Error("SKU is required.");
      }

      if (!product.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!product.category) {
        throw new Error("Please select a category.");
      }

      // =========================
      // GENERATE SLUG
      // =========================
      const slug = product.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // =========================
      // PRODUCT DATA
      // =========================
      const productData = {
        sku: product.sku.trim(),
        name: product.name.trim(),
        slug,
        description: product.description.trim(),
        category: product.category,
        regularPrice: Number(product.regularPrice),
        salePrice:
          product.salePrice === ""
            ? null
            : Number(product.salePrice),
        stock: Number(product.stock),
        variants: product.variants,
        status: product.status,

        // Keep current images after removing unwanted ones
        images: product.images,
      };

      // =========================
      // STEP 1
      // UPDATE PRODUCT DETAILS
      // =========================
      const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        );
      }

      let finalImages = product.images;

      // =========================
      // STEP 2
      // UPLOAD NEW IMAGES
      // =========================
      if (newImages.length > 0) {
        const formData = new FormData();

        newImages.forEach((file) => {
          formData.append("images", file);
        });

        const imageResponse = await fetch(
          `${PRODUCT_API_URL}/${id}/images`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imageData = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            imageData.message ||
              "Product updated, but image upload failed."
          );
        }

        /*
          Backend returns uploaded image URLs in imageData.images.

          We only want the newly uploaded URLs here.
        */
        const uploadedImages = Array.isArray(imageData.images)
          ? imageData.images
          : [];

        /*
          If backend returns the complete product image array,
          take only the newly uploaded count from the end.
        */
        let newUploadedUrls = uploadedImages;

        if (
          uploadedImages.length > newImages.length &&
          imageData.product?.images
        ) {
          const backendImages = imageData.product.images;

          newUploadedUrls = backendImages.slice(
            backendImages.length - newImages.length
          );
        }

        // Combine remaining old images + newly uploaded images
        finalImages = [
          ...product.images,
          ...newUploadedUrls,
        ];

        // =========================
        // STEP 3
        // SAVE FINAL IMAGE ARRAY
        // =========================
        const finalUpdateResponse = await fetch(
          `${PRODUCT_API_URL}/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...productData,
              images: finalImages,
            }),
          }
        );

        const finalUpdateData =
          await finalUpdateResponse.json();

        if (!finalUpdateResponse.ok) {
          throw new Error(
            finalUpdateData.message ||
              "Images uploaded but final image update failed."
          );
        }
      }

      alert("Product updated successfully!");

      // Cleanup preview URLs
      newImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);

      alert(
        error.message ||
          "Something went wrong while updating the product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="add-product-page">
        <div className="add-product-content">
          <div className="add-product-card">
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="add-product-page">
      <div className="add-product-content">

        {/* =========================
            HEADER
        ========================= */}
        <div className="add-product-header">
          <div className="add-product-heading">
            <h1>Edit Product</h1>
            <p>Update your product details</p>
          </div>

          <button
            type="button"
            className="back-products-btn"
            onClick={() => navigate("/admin/products")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Products
          </button>
        </div>

        {/* =========================
            FORM CARD
        ========================= */}
        <div className="add-product-card">
          <form onSubmit={handleSubmit}>

            {/* =========================
                SKU + NAME
            ========================= */}
            <div className="form-row">

              <div className="form-group">
                <label>SKU</label>

                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  placeholder="Example: TSH-BLK-003"
                  required
                />

                <small className="size-hint">
                  SKU must be unique
                </small>
              </div>

              <div className="form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

            </div>

            {/* =========================
                CATEGORY + STOCK
            ========================= */}
            <div className="form-row">

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

            </div>

            {/* =========================
                PRICES
            ========================= */}
            <div className="form-row">

              <div className="form-group">
                <label>Regular Price</label>

                <input
                  type="number"
                  name="regularPrice"
                  value={product.regularPrice}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sale Price</label>

                <input
                  type="number"
                  name="salePrice"
                  value={product.salePrice}
                  onChange={handleChange}
                  min="0"
                  placeholder="Optional"
                />
              </div>

            </div>

            {/* =========================
                SIZES + STATUS
            ========================= */}
            <div className="form-row">

              <div className="form-group">
                <label>Available Sizes</label>

                <div className="size-selection">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`size-option ${
                        product.variants.includes(size)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSizeChange(size)
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <small className="size-hint">
                  {product.variants.length === 0
                    ? "Select one or more sizes"
                    : `${product.variants.length} size${
                        product.variants.length > 1
                          ? "s"
                          : ""
                      } selected`}
                </small>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={product.status}
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

            {/* =========================
                DESCRIPTION
            ========================= */}
            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="5"
                placeholder="Add details about fabric, fit, style and care..."
                required
              />
            </div>

            {/* =========================
                CURRENT IMAGES
            ========================= */}
            <div className="form-group">
              <label>Current Images</label>

              {product.images.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    flexWrap: "wrap",
                    marginTop: "12px",
                  }}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      style={{
                        position: "relative",
                        width: "110px",
                        height: "110px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        background: "#f8f8f8",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveExistingImage(index)
                        }
                        title="Remove image"
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          width: "26px",
                          height: "26px",
                          border: "none",
                          borderRadius: "50%",
                          background: "#ffffff",
                          color: "#111",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow:
                            "0 2px 8px rgba(0,0,0,0.18)",
                          fontSize: "13px",
                        }}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "20px",
                    border: "1px dashed #d5d5d5",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#888",
                    fontSize: "13px",
                  }}
                >
                  No images selected.
                </div>
              )}

              {product.images.length > 0 && (
                <small className="size-hint">
                  Click × to remove an existing image.
                </small>
              )}
            </div>

            {/* =========================
                ADD NEW IMAGES
            ========================= */}
            <div className="form-group">
              <label>Add New Images</label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <small className="size-hint">
                Select up to 5 new images.
              </small>

              {/* NEW IMAGE PREVIEWS */}
              {newImages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    flexWrap: "wrap",
                    marginTop: "14px",
                  }}
                >
                  {newImages.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      style={{
                        position: "relative",
                        width: "110px",
                        height: "110px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        background: "#f8f8f8",
                      }}
                    >
                      <img
                        src={newImagePreviews[index]}
                        alt={file.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />

                      {/* REMOVE NEW IMAGE */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveNewImage(index)
                        }
                        title="Remove selected image"
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          width: "26px",
                          height: "26px",
                          border: "none",
                          borderRadius: "50%",
                          background: "#ffffff",
                          color: "#111",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow:
                            "0 2px 8px rgba(0,0,0,0.18)",
                          fontSize: "13px",
                        }}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newImages.length > 0 && (
                <small
                  className="size-hint"
                  style={{
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  {newImages.length} new image
                  {newImages.length > 1 ? "s" : ""} selected
                </small>
              )}
            </div>

            {/* =========================
                BUTTONS
            ========================= */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  navigate("/admin/products")
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-btn"
                disabled={saving}
              >
                <i className="bi bi-check-lg"></i>

                {saving
                  ? "Updating..."
                  : "Update Product"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;