import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products API response:", data);

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="products-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your products and inventory</p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          <i className="bi bi-plus-lg"></i>
          Add Product
        </button>
      </div>

      {/* Products Card */}
      <div className="product-card">

        <div className="product-top">
          <div>
            <h2>All Products</h2>
            <p>View and manage all products in your store</p>
          </div>

          <div className="product-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <table>

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    <i className="bi bi-arrow-repeat"></i>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    <i className="bi bi-box-seam"></i>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {

                  const stock =
                    product.stock ??
                    product.quantity ??
                    0;

                  const status =
                    stock === 0
                      ? "Out of Stock"
                      : stock <= 10
                      ? "Low Stock"
                      : "Active";

                  return (
                    <tr
                      key={
                        product._id ||
                        product.id
                      }
                    >

                      {/* Product */}
                      <td>
                        <div className="product-name">
                          <div className="product-icon">
                            <i className="bi bi-box-seam"></i>
                          </div>

                          <strong>
                            {product.name ||
                              product.productName ||
                              "-"}
                          </strong>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        {product.category?.name ||
                          product.category ||
                          "-"}
                      </td>

                      {/* Price */}
                      <td>
                        ₹{product.price ?? 0}
                      </td>

                      {/* Stock */}
                      <td>
                        {stock}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`status ${
                            status === "Active"
                              ? "active"
                              : status === "Low Stock"
                              ? "low"
                              : "out"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="product-actions">

                          <button
                            className="edit-btn"
                            title="Edit product"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="delete-btn"
                            title="Delete product"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default Products;