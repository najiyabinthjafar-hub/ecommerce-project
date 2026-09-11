
import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="admin-main">

        {/* Admin Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;

