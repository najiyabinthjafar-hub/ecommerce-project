
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const CATEGORY_API_URL = "http://localhost:5000/api/categories";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    size: [],
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await fetch(CATEGORY_API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      console.log("Categories:", data);

      setCategories(data.categories || []);
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

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSizeChange = (size) => {
    setProduct((prev) => {
      const alreadySelected = prev.size.includes(size);

      return {
        ...prev,
        size: alreadySelected
          ? prev.size.filter((item) => item !== size)
          : [...prev.size, size],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Product:", product);

    alert("Product added successfully!");

    setProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      size: [],
      description: "",
    });

    navigate("/admin/products");
  };

  return (
    <div className="add-product-page">
      <div className="add-product-content">

        {/* Header */}
        <div className="add-product-header">
          <div className="add-product-heading">
            <h1>Add Product</h1>
            <p>Add a new fashion product to your store</p>
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

        {/* Form Card */}
        <div className="add-product-card">
          <form onSubmit={handleSubmit}>

            {/* Product Name + Category */}
            <div className="form-row">

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
                        key={category._id || category.id}
                        value={category._id || category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

            </div>

            {/* Price + Stock */}
            <div className="form-row">

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  placeholder="₹ Enter price"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
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

            {/* Size + Image */}
            <div className="form-row">

              {/* Size Selection */}
              <div className="form-group">
                <label>Available Sizes</label>

                <div className="size-selection">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`size-option ${
                        product.size.includes(size) ? "selected" : ""
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <small className="size-hint">
                  {product.size.length === 0
                    ? "Select one or more sizes"
                    : `${product.size.length} size${
                        product.size.length > 1 ? "s" : ""
                      } selected`}
                </small>
              </div>

              {/* Product Image */}
              <div className="form-group">
                <label>Product Image</label>

                <input
                  type="file"
                  accept="image/*"
                />
              </div>

            </div>

            {/* Description */}
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

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-btn"
              >
                <i className="bi bi-plus-lg"></i>
                Add Product
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
