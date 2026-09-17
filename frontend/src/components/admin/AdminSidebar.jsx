import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
import logo from "../../assets/rizo-logo.png";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");

    // Remove logged-in user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Go to admin login page
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="RIZO" />
        <span>RIZO</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <NavLink to="/admin/dashboard">
          <i className="bi bi-house-door"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products">
          <i className="bi bi-box-seam"></i>
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/inventory">
          <i className="bi bi-boxes"></i>
          <span>Inventory</span>
        </NavLink>

        <NavLink to="/admin/categories">
          <i className="bi bi-grid"></i>
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/banners">
          <i className="bi bi-image"></i>
          <span>Banners</span>
        </NavLink>

        <NavLink to="/admin/customers">
          <i className="bi bi-people"></i>
          <span>Customers</span>
        </NavLink>

        <NavLink to="/admin/coupons">
          <i className="bi bi-ticket-perforated"></i>
          <span>Coupons</span>
        </NavLink>

        <NavLink to="/admin/orders">
          <i className="bi bi-cart3"></i>
          <span>Orders</span>
        </NavLink>

        

      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">

        <div className="sidebar-divider"></div>

        {/* Logout */}
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;