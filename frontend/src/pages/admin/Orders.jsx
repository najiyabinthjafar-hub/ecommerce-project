import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const orders = [
    {
      id: "#ORD-1001",
      customer: "Rahul Kumar",
      date: "02 Sep 2026",
      items: 3,
      total: 2450,
      status: "Delivered",
    },
    {
      id: "#ORD-1002",
      customer: "Anjali S",
      date: "02 Sep 2026",
      items: 2,
      total: 1299,
      status: "Processing",
    },
    {
      id: "#ORD-1003",
      customer: "Mohammed Shafi",
      date: "01 Sep 2026",
      items: 1,
      total: 899,
      status: "Shipped",
    },
    {
      id: "#ORD-1004",
      customer: "Fathima N",
      date: "01 Sep 2026",
      items: 4,
      total: 3490,
      status: "Pending",
    },
    {
      id: "#ORD-1005",
      customer: "Arun Raj",
      date: "31 Aug 2026",
      items: 2,
      total: 1750,
      status: "Cancelled",
    },
  ];

  return (
    <div className="orders-page">

      {/* Page Header */}
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders</p>
        </div>

        <div className="orders-summary">
          <div className="summary-item">
            <span>Total Orders</span>
            <strong>128</strong>
          </div>

          <div className="summary-item">
            <span>Pending</span>
            <strong>12</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="orders-toolbar">

        <div className="orders-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search orders or customers..."
          />
        </div>

        <div className="orders-filters">
          <select defaultValue="All">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select defaultValue="Newest">
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>

      </div>

      {/* Orders Card */}
      <div className="orders-card">

        <div className="orders-card-header">
          <div>
            <h2>All Orders</h2>
            <p>View and manage recent customer orders</p>
          </div>

          <span className="order-count">
            {orders.length} Orders
          </span>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>

                  <td>
                    <strong className="order-id">
                      {order.id}
                    </strong>
                  </td>

                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {order.customer.charAt(0)}
                      </div>

                      <span>{order.customer}</span>
                    </div>
                  </td>

                  <td>{order.date}</td>

                  <td>{order.items}</td>

                  <td>
                    <strong>₹{order.total.toLocaleString()}</strong>
                  </td>

                  <td>
                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="view-order-btn"
                      onClick={() =>
                        navigate(`/admin/orders/${order.id.replace("#", "")}`)
                      }
                    >
                      View
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

export default Orders;