import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;