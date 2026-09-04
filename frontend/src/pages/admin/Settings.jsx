
import React from "react";
import "./Settings.css";

function Settings() {
  return (
    <div className="settings-page">

      {/* Page Header */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin preferences</p>
        </div>
      </div>

      <div className="settings-layout">

        {/* =========================
            GENERAL SETTINGS
        ========================= */}
        <section className="settings-card">

          <div className="settings-card-header">
            <div className="settings-icon general-icon">
              <i className="bi bi-sliders"></i>
            </div>

            <div>
              <h2>General Settings</h2>
              <p>Basic store information</p>
            </div>
          </div>

          <div className="settings-form">

            <div className="form-group">
              <label>Store Name</label>
              <input
                type="text"
                defaultValue="RIZO Store"
              />
            </div>

            <div className="form-group">
              <label>Store Email</label>
              <input
                type="email"
                defaultValue="admin@rizo.com"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                defaultValue="+91 98765 43210"
              />
            </div>

            <div className="form-group full-width">
              <label>Store Address</label>
              <textarea
                rows="3"
                defaultValue="Kerala, India"
              ></textarea>
            </div>

          </div>

          <div className="settings-actions">
            <button className="save-btn">
              <i className="bi bi-check2"></i>
              Save Changes
            </button>
          </div>

        </section>


        {/* =========================
            NOTIFICATIONS
        ========================= */}
        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon notification-icon">
              <i className="bi bi-bell"></i>
            </div>

            <div>
              <h2>Notifications</h2>
              <p>Notification preferences</p>
            </div>

          </div>


          <div className="setting-option">

            <div className="setting-option-info">
              <h3>Order Notifications</h3>
              <p>Receive notifications for new orders</p>
            </div>

            <span className="setting-status enabled">
              <i className="bi bi-check-circle-fill"></i>
              Enabled
            </span>

          </div>


          <div className="setting-option">

            <div className="setting-option-info">
              <h3>Low Stock Alerts</h3>
              <p>Get notified when stock is running low</p>
            </div>

            <span className="setting-status enabled">
              <i className="bi bi-check-circle-fill"></i>
              Enabled
            </span>

          </div>


          <div className="setting-option">

            <div className="setting-option-info">
              <h3>New Customer Notifications</h3>
              <p>Receive alerts when a new customer registers</p>
            </div>

            <span className="setting-status enabled">
              <i className="bi bi-check-circle-fill"></i>
              Enabled
            </span>

          </div>

        </section>


        {/* =========================
            STORE PREFERENCES
        ========================= */}
        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon preference-icon">
              <i className="bi bi-shop"></i>
            </div>

            <div>
              <h2>Store Preferences</h2>
              <p>Manage your store preferences</p>
            </div>

          </div>


          <div className="settings-form">

            <div className="form-group">
              <label>Currency</label>

              <select defaultValue="INR">
                <option value="INR">
                  Indian Rupee (₹)
                </option>

                <option value="USD">
                  US Dollar ($)
                </option>
              </select>
            </div>


            <div className="form-group">
              <label>Language</label>

              <select defaultValue="English">
                <option value="English">
                  English
                </option>
              </select>
            </div>


            <div className="form-group">
              <label>Time Zone</label>

              <select defaultValue="IST">
                <option value="IST">
                  India Standard Time (IST)
                </option>
              </select>
            </div>


            <div className="form-group">
              <label>Date Format</label>

              <select defaultValue="DD/MM/YYYY">
                <option value="DD/MM/YYYY">
                  DD/MM/YYYY
                </option>

                <option value="MM/DD/YYYY">
                  MM/DD/YYYY
                </option>
              </select>
            </div>

          </div>

        </section>


        {/* =========================
            SECURITY
        ========================= */}
        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon security-icon">
              <i className="bi bi-shield-lock"></i>
            </div>

            <div>
              <h2>Security</h2>
              <p>Manage your admin account security</p>
            </div>

          </div>


          <div className="security-row">

            <div className="security-info">
              <h3>Admin Password</h3>
              <p>
                Password is managed through admin authentication
              </p>
            </div>

            <button className="security-btn">
              Change Password
            </button>

          </div>


          <div className="security-row">

            <div className="security-info">
              <h3>Two-Factor Authentication</h3>
              <p>
                Add an extra layer of security to your account
              </p>
            </div>

            <span className="setting-status disabled">
              Disabled
            </span>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Settings;

