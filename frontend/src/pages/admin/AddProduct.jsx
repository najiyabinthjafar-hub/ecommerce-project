import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const CATEGORY_API_URL = "http://localhost:5000/api/categories";
const PRODUCT_API_URL = "http://localhost:5000/api/products";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    sku: "",
    name: "",
    category: "",
    regularPrice: "",
    salePrice: "",
    stock: "",
    variants: [],
    description: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await fetch(CATEGORY_API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      console.log("Categories:", data);

      const categoryList = Array.isArray(data)
        ? data
        : data.categories || data.data || [];

      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SIZE SELECTION
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
  // IMAGE SELECTION
  // =========================
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    // No new files selected
    if (selectedImages.length === 0) {
      return;
    }

    // Existing + new images should not exceed 5
    if (images.length + selectedImages.length > 5) {
      alert("You can select a maximum of 5 images.");
      e.target.value = "";
      return;
    }

    // IMPORTANT:
    // Add new images to existing images
    // instead of replacing them
    setImages((prev) => [...prev, ...selectedImages]);

    // Clear input so user can select more images again
    e.target.value = "";
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const handleRemoveImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // IMAGE REQUIRED
    if (images.length === 0) {
      alert("Please add at least one product image.");
      return;
    }

    try {
      setSaving(true);

      // Create slug from product name
      const slug = product.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

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

        status: "active",
      };

      console.log("Sending product:", productData);

      // =========================
      // 1. CREATE PRODUCT
      // =========================
      const response = await fetch(PRODUCT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      console.log("Create product response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product"
        );
      }

      // =========================
      // 2. UPLOAD PRODUCT IMAGES
      // =========================
      if (data.product?._id && images.length > 0) {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        console.log("Uploading images...");

        const imageResponse = await fetch(
          `${PRODUCT_API_URL}/${data.product._id}/images`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imageData = await imageResponse.json();

        console.log(
          "Image upload response:",
          imageData
        );

        if (!imageResponse.ok) {
          throw new Error(
            imageData.message ||
              "Product added, but image upload failed"
          );
        }
      }

      // =========================
      // SUCCESS
      // =========================
      alert("Product and images added successfully!");

      // Reset product
      setProduct({
        sku: "",
        name: "",
        category: "",
        regularPrice: "",
        salePrice: "",
        stock: "",
        variants: [],
        description: "",
      });

      // Reset images
      setImages([]);

      // Go back to products
      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Error adding product:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while adding the product"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-content">

        {/* =========================
            HEADER
        ========================= */}
        <div className="add-product-header">
          <div className="add-product-heading">
            <h1>Add Product</h1>
            <p>
              Add a new fashion product to your store
            </p>
          </div>

          <button
            type="button"
            className="back-products-btn"
            onClick={() =>
              navigate("/admin/products")
            }
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
                SKU + PRODUCT NAME
            ========================= */}
            <div className="form-row">

              <div className="form-group">
                <label>SKU</label>

                <input
                  type="text"
                  name="sku"
                  placeholder="Example: SHIRT-001"
                  value={product.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Cotton Casual Shirt"
                  value={product.name}
                  onChange={handleChange}
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
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {!loadingCategories &&
                    categories.map((category) => (
                      <option
                        key={
                          category._id ||
                          category.id
                        }
                        value={
                          category._id ||
                          category.id
                        }
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
                  placeholder="Enter stock quantity"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

            </div>

            {/* =========================
                REGULAR PRICE + SALE PRICE
            ========================= */}
            <div className="form-row">

              <div className="form-group">
                <label>Regular Price</label>

                <input
                  type="number"
                  name="regularPrice"
                  placeholder="₹ Enter regular price"
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
                  placeholder="₹ Enter sale price (optional)"
                  value={product.salePrice}
                  onChange={handleChange}
                  min="0"
                />
              </div>

            </div>

            {/* =========================
                SIZE SELECTION
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

            </div>

            {/* =========================
                PRODUCT IMAGES
            ========================= */}
            <div className="form-group product-image-full">

              <label>
                Product Images <span>*</span>
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                required
                onChange={handleImageChange}
              />

              <small className="size-hint">
                Select at least 1 image, up to 5 images.
              </small>

              {/* IMAGE PREVIEW */}
              {images.length > 0 && (
                <div className="product-image-preview">

                  {images.map((image, index) => (
                    <div
                      className="preview-image-box"
                      key={`${image.name}-${index}`}
                    >

                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Product preview ${
                          index + 1
                        }`}
                      />

                      <button
                        type="button"
                        className="remove-preview-btn"
                        onClick={() =>
                          handleRemoveImage(index)
                        }
                        title="Remove image"
                      >
                        <i className="bi bi-x"></i>
                      </button>

                    </div>
                  ))}

                </div>
              )}

              {images.length > 0 && (
                <small className="size-hint">
                  {images.length} image
                  {images.length > 1
                    ? "s"
                    : ""}{" "}
                  selected
                </small>
              )}

            </div>

            {/* =========================
                DESCRIPTION
            ========================= */}
            <div className="form-group">

              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe the product..."
                value={product.description}
                onChange={handleChange}
                rows="5"
                required
              />

            </div>

            {/* =========================
                ACTION BUTTONS
            ========================= */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  navigate("/admin/products")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-btn"
                disabled={saving}
              >
                <i className="bi bi-plus-lg"></i>

                {saving
                  ? "Adding..."
                  : "Add Product"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;