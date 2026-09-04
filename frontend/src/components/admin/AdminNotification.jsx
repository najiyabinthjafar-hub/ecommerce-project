
import React, { useState } from "react";
import "./AdminNotification.css";

function AdminNotification() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="notification-wrapper">

      {/* Notification Button */}
      <button
        className="notification-btn"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <i className="bi bi-bell"></i>
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="notification-panel">

          {/* Header */}
          <div className="notification-panel-header">
            <div>
              <h3>Notifications</h3>
              <p>Recent updates from your store</p>
            </div>

            <button
              className="notification-close-btn"
              onClick={() => setShowNotifications(false)}
              aria-label="Close notifications"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Notification List */}
          <div className="notification-list">

            {/* New Order */}
            <div className="notification-item">
              <div className="notification-icon order">
                <i className="bi bi-bag-check"></i>
              </div>

              <div className="notification-content">
                <h4>New Order Received</h4>
                <p>Order #RZ1024 has been placed.</p>
                <span>5 minutes ago</span>
              </div>
            </div>

            {/* Low Stock */}
            <div className="notification-item">
              <div className="notification-icon stock">
                <i className="bi bi-box-seam"></i>
              </div>

              <div className="notification-content">
                <h4>Low Stock Alert</h4>
                <p>Some products are running low on stock.</p>
                <span>20 minutes ago</span>
              </div>
            </div>

            {/* New Customer */}
            <div className="notification-item">
              <div className="notification-icon customer">
                <i className="bi bi-person-plus"></i>
              </div>

              <div className="notification-content">
                <h4>New Customer</h4>
                <p>A new customer registered in your store.</p>
                <span>1 hour ago</span>
              </div>
            </div>

          </div>

          {/* View All */}
          <button
            className="view-all-notifications"
            onClick={() => setShowNotifications(false)}
          >
            View All Notifications
            <i className="bi bi-arrow-right"></i>
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminNotification;

