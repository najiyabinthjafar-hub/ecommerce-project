import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      <div className="sidebar-logo">
        RIZO ADMIN
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/admin/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          Products
        </NavLink>

        <NavLink to="/admin/categories">
          Categories
        </NavLink>

        <NavLink to="/admin/orders">
          Orders
        </NavLink>

      </nav>

      <div className="sidebar-bottom">
        <button>Logout</button>
      </div>

    </aside>
  );
}

export default AdminSidebar;