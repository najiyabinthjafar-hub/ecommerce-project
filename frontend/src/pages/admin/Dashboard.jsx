import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Products",
      value: "248",
      change: "+12.5%",
      icon: "bi-box-seam",
    },
    {
      title: "Total Orders",
      value: "1,284",
      change: "+8.2%",
      icon: "bi-cart3",
    },
    {
      title: "Customers",
      value: "856",
      change: "+5.7%",
      icon: "bi-people",
    },
    {
      title: "Total Revenue",
      value: "₹2,48,560",
      change: "+14.8%",
      icon: "bi-graph-up-arrow",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1024",
      customer: "Ameen K",
      date: "03 Sep 2026",
      amount: "₹4,250",
      status: "Delivered",
    },
    {
      id: "#ORD-1023",
      customer: "Fathima P",
      date: "03 Sep 2026",
      amount: "₹2,890",
      status: "Processing",
    },
    {
      id: "#ORD-1022",
      customer: "Rahul M",
      date: "02 Sep 2026",
      amount: "₹6,450",
      status: "Shipped",
    },
    {
      id: "#ORD-1021",
      customer: "Niya S",
      date: "02 Sep 2026",
      amount: "₹1,980",
      status: "Pending",
    },
    {
      id: "#ORD-1020",
      customer: "Shahil A",
      date: "01 Sep 2026",
      amount: "₹3,720",
      status: "Delivered",
    },
  ];

  const topProducts = [
    {
      name: "Premium Cotton Shirt",
      category: "Men",
      sales: "128 sold",
    },
    {
      name: "Classic Handbag",
      category: "Women",
      sales: "96 sold",
    },
    {
      name: "Running Sneakers",
      category: "Footwear",
      sales: "84 sold",
    },
    {
      name: "Smart Watch",
      category: "Accessories",
      sales: "72 sold",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, Admin. Here's what's happening with your store.
          </p>
        </div>

        <button className="dashboard-date">
          <i className="bi bi-calendar3"></i>
          <span>September 2026</span>
        </button>
      </div>

      {/* =========================
          STAT CARDS
      ========================= */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>

            <div className="stat-card-top">
              <div className="stat-icon">
                <i className={`bi ${stat.icon}`}></i>
              </div>

              <span className="stat-change">
                {stat.change}
              </span>
            </div>

            <div className="stat-card-bottom">
              <p>{stat.title}</p>
              <h2>{stat.value}</h2>
            </div>

          </div>
        ))}
      </section>

      {/* =========================
          MAIN DASHBOARD GRID
      ========================= */}
      <section className="dashboard-grid">

        {/* SALES OVERVIEW */}
        <div className="dashboard-card sales-card">

          <div className="card-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Revenue performance for the last 7 days</p>
            </div>

            <button className="card-menu">
              <i className="bi bi-three-dots"></i>
            </button>
          </div>

          <div className="sales-summary">
            <div>
              <span>Total Sales</span>
              <strong>₹68,420</strong>
            </div>

            <div className="sales-growth">
              <i className="bi bi-arrow-up"></i>
              12.8%
            </div>
          </div>

          <div className="sales-chart">

            <div className="chart-y-axis">
              <span>20K</span>
              <span>15K</span>
              <span>10K</span>
              <span>5K</span>
              <span>0</span>
            </div>

            <div className="chart-area">

              <div className="chart-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="chart-bars">
                <div className="bar-wrapper">
                  <div className="chart-bar bar-1"></div>
                  <small>Mon</small>
                </div>

                <div className="bar-wrapper">
                  <div className="chart-bar bar-2"></div>
                  <small>Tue</small>
                </div>

                <div className="bar-wrapper">
                  <div className="chart-bar bar-3"></div>
                  <small>Wed</small>
                </div>

                <div className="bar-wrapper">
                  <div className="chart-bar bar-4"></div>
                  <small>Thu</small>
                </div>

                <div className="bar-wrapper">
                  <div className="chart-bar bar-5"></div>
                  <small>Fri</small>
                </div>

                <div className="bar-wrapper">
                  <div className="chart-bar bar-6"></div>
                  <small>Sat</small>
                </div>

                <div className="bar-wrapper">
                  <div className="chart-bar bar-7"></div>
                  <small>Sun</small>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="dashboard-card order-summary-card">

          <div className="card-header">
            <div>
              <h3>Order Summary</h3>
              <p>Current order status</p>
            </div>

            <button className="card-menu">
              <i className="bi bi-three-dots"></i>
            </button>
          </div>

          <div className="order-summary-content">

            <div className="order-circle">
              <div>
                <strong>1,284</strong>
                <span>Orders</span>
              </div>
            </div>

            <div className="order-status-list">

              <div className="order-status-item">
                <span className="status-dot delivered"></span>
                <span>Delivered</span>
                <strong>742</strong>
              </div>

              <div className="order-status-item">
                <span className="status-dot processing"></span>
                <span>Processing</span>
                <strong>284</strong>
              </div>

              <div className="order-status-item">
                <span className="status-dot shipped"></span>
                <span>Shipped</span>
                <strong>168</strong>
              </div>

              <div className="order-status-item">
                <span className="status-dot pending"></span>
                <span>Pending</span>
                <strong>90</strong>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* =========================
          BOTTOM GRID
      ========================= */}
      <section className="dashboard-bottom-grid">

        {/* RECENT ORDERS */}
       <div className="dashboard-card recent-orders-card">

  <div className="card-header">
    <div>
      <h3>Recent Orders</h3>
      <p>Latest orders from your customers</p>
    </div>

    <button
      className="view-all-btn"
      onClick={() => navigate("/admin/orders")}
    >
      View All
      <i className="bi bi-arrow-right"></i>
    </button>
  </div>

          <div className="orders-table-wrapper">
            <table className="orders-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>

                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.date}</td>

                    <td>
                      <strong>{order.amount}</strong>
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

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

        {/* TOP PRODUCTS */}
        <div className="dashboard-card top-products-card">

          <div className="card-header">
            <div>
              <h3>Top Products</h3>
              <p>Best selling products this month</p>
            </div>

            <button className="card-menu">
              <i className="bi bi-three-dots"></i>
            </button>
          </div>

          <div className="top-products-list">

            {topProducts.map((product, index) => (
              <div className="top-product" key={product.name}>

                <div className="product-rank">
                  0{index + 1}
                </div>

                <div className="product-info">
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                </div>

                <div className="product-sales">
                  {product.sales}
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;

