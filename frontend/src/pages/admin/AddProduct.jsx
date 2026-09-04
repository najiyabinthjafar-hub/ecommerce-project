
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    size: "",
    description: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
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
      size: "",
      description: "",
    });

    navigate("/admin/products");
  };

  return (
    <div className="add-product-page">
      <div className="add-product-content">

        {/* Header */}
        <div className="add-product-header">

          {/* Heading + Subheading */}
          <div className="add-product-heading">
            <h1>Add Product</h1>
            <p>Add a new fashion product to your store</p>
          </div>

          {/* Back Button */}
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
                  <option value="">Select category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Bags">Bags</option>
                  <option value="Accessories">Accessories</option>
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

              <div className="form-group">
                <label>Available Size</label>

                <select
                  name="size"
                  value={product.size}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

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

