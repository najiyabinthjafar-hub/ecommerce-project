import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AddProduct.css";

function AddProduct() {
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

    console.log(product);
    alert("Product added successfully!");

    setProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      size: "",
      description: "",
    });
  };

  return (
    <>
      <AdminSidebar />

      <div className="add-product-page">
        <div className="add-product-content">

          <div className="add-product-header">
            <div>
              <h1>Add Product</h1>
              <p>Add a new fashion product to your store</p>
            </div>
          </div>

          <div className="add-product-card">

            <form onSubmit={handleSubmit}>

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

              <div className="form-row">

                <div className="form-group">
                  <label>Price</label>

                  <input
                    type="number"
                    name="price"
                    placeholder="₹ Enter price"
                    value={product.price}
                    onChange={handleChange}
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
                    required
                  />
                </div>

              </div>

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

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                >
                  Add Product
                </button>

              </div>

            </form>

          </div>

        </div>
      </div>
    </>
  );
}

export default AddProduct;