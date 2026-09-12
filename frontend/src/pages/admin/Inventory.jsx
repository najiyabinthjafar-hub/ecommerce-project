import React, { useState } from "react";
import "./Inventory.css";

function Inventory() {
  const [search, setSearch] = useState("");

  const inventory = [
    {
      id: 1,
      product: "Classic T-Shirt",
      category: "Men",
      stock: 45,
      price: "₹899",
      status: "In Stock",
    },
    {
      id: 2,
      product: "Denim Jacket",
      category: "Women",
      stock: 8,
      price: "₹1,999",
      status: "Low Stock",
    },
    {
      id: 3,
      product: "Running Shoes",
      category: "Footwear",
      stock: 0,
      price: "₹2,499",
      status: "Out of Stock",
    },
    {
      id: 4,
      product: "Cotton Hoodie",
      category: "Men",
      stock: 25,
      price: "₹1,299",
      status: "In Stock",
    },
    {
      id: 5,
      product: "Handbag",
      category: "Accessories",
      stock: 12,
      price: "₹1,599",
      status: "In Stock",
    },
  ];

  const filteredInventory = inventory.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-page">

      {/* Page Header */}
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor and manage your product stock</p>
        </div>

        <button className="inventory-btn">
          + Update Stock
        </button>
      </div>

      {/* Summary Cards */}
      <div className="inventory-stats">

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon products-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div>
            <span>Total Products</span>
            <h2>120</h2>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon stock-icon">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>In Stock</span>
            <h2>96</h2>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon low-icon">
            <i className="bi bi-exclamation-circle"></i>
          </div>

          <div>
            <span>Low Stock</span>
            <h2>18</h2>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon out-icon">
            <i className="bi bi-x-circle"></i>
          </div>

          <div>
            <span>Out of Stock</span>
            <h2>6</h2>
          </div>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="inventory-card">

        <div className="inventory-card-header">
          <div>
            <h2>Stock Overview</h2>
            <p>Current stock information of all products</p>
          </div>

          <div className="inventory-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">

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
              {filteredInventory.map((item) => (
                <tr key={item.id}>

                  <td>
                    <div className="inventory-product">
                      <div className="product-placeholder">
                        <i className="bi bi-box"></i>
                      </div>

                      <strong>{item.product}</strong>
                    </div>
                  </td>

                  <td>{item.category}</td>

                  <td>{item.price}</td>

                  <td>
                    <strong>{item.stock}</strong>
                  </td>

                  <td>
                    <span
                      className={`inventory-status ${
                        item.status === "In Stock"
                          ? "in-stock"
                          : item.status === "Low Stock"
                          ? "low-stock"
                          : "out-stock"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button className="inventory-edit-btn">
                      <i className="bi bi-pencil"></i>
                      Edit
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default Inventory;