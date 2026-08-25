import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Products.css";

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    category: "Men",
    price: "₹799",
    stock: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "Women Handbag",
    category: "Women",
    price: "₹1,499",
    stock: 12,
    status: "Active",
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Shoes",
    price: "₹2,299",
    stock: 8,
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Electronics",
    price: "₹3,999",
    stock: 0,
    status: "Out of Stock",
  },
];

function Products() {
  return (
    <>
      <AdminSidebar />

      <div className="admin-page">
        <div className="admin-content">

          <div className="page-header">
            <div>
              <h1>Products</h1>
              <p>Manage your products and inventory</p>
            </div>

            <button
  className="add-product-btn"
  onClick={() => {
    window.location.href = "/admin/products/add";
  }}
>
  + Add Product
</button>
          </div>

          <div className="product-card">

            <div className="product-top">
              <h2>All Products</h2>

              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
              />
            </div>

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
                  {products.map((product) => (
                    <tr key={product.id}>

                      <td>
                        <strong>{product.name}</strong>
                      </td>

                      <td>{product.category}</td>

                      <td>{product.price}</td>

                      <td>{product.stock}</td>

                      <td>
                        <span
                          className={`status ${
                            product.status === "Active"
                              ? "active"
                              : product.status === "Low Stock"
                              ? "low"
                              : "out"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td>
                        <button className="edit-btn">
                          Edit
                        </button>

                        <button className="delete-btn">
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Products;