import React, { useState } from "react";
import "./Customers.css";

function Customers() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 43210",
      orders: 12,
      spent: 24500,
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Thomas",
      email: "sarah@example.com",
      phone: "+91 87654 32109",
      orders: 8,
      spent: 16800,
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Joseph",
      email: "michael@example.com",
      phone: "+91 76543 21098",
      orders: 5,
      spent: 9200,
      status: "Inactive",
    },
    {
      id: 4,
      name: "Anjali Menon",
      email: "anjali@example.com",
      phone: "+91 95432 10987",
      orders: 16,
      spent: 32400,
      status: "Active",
    },
    {
      id: 5,
      name: "David Mathew",
      email: "david@example.com",
      phone: "+91 94321 09876",
      orders: 3,
      spent: 5400,
      status: "Inactive",
    },
  ];

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">

      {/* Page Header */}
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage and view your customers</p>
        </div>

        <div className="customer-count">
          <span>{customers.length}</span>
          <small>Total Customers</small>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="customer-stats">

        <div className="customer-stat-card">
          <div className="customer-stat-icon blue">
            <i className="bi bi-people"></i>
          </div>

          <div>
            <span>Total Customers</span>
            <strong>1,248</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon green">
            <i className="bi bi-person-check"></i>
          </div>

          <div>
            <span>Active Customers</span>
            <strong>1,086</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon purple">
            <i className="bi bi-cart-check"></i>
          </div>

          <div>
            <span>Total Orders</span>
            <strong>3,842</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon orange">
            <i className="bi bi-currency-rupee"></i>
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>₹8.4L</strong>
          </div>
        </div>

      </div>

      {/* Customers Table Card */}
      <div className="customers-card">

        <div className="customers-card-header">
          <div>
            <h2>All Customers</h2>
            <p>Customer information and activity</p>
          </div>

          <div className="customer-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="customers-table-wrapper">
          <table className="customers-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>

                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {customer.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{customer.name}</strong>
                          <span>Customer #{customer.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-info">
                        <span>{customer.email}</span>
                        <small>{customer.phone}</small>
                      </div>
                    </td>

                    <td>
                      <strong className="orders-count">
                        {customer.orders}
                      </strong>
                    </td>

                    <td>
                      <strong className="spent">
                        ₹{customer.spent.toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`customer-status ${
                          customer.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td>
                      <div className="customer-actions">
                        <button
                          className="view-btn"
                          title="View Customer"
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="more-btn"
                          title="More"
                        >
                          <i className="bi bi-three-dots"></i>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-customers">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default Customers;