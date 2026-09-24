import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactMessages.css";

const API_URL = "http://localhost:5000/api/contacts";

const ContactMessages = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // FETCH CONTACT MESSAGES
  // =========================================================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch contact messages"
        );
      }

      setMessages(data.contacts || data.messages || []);
    } catch (error) {
      console.error("Fetch contact messages error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const getName = (message) => {
    return (
      message?.name ||
      message?.fullName ||
      message?.user?.name ||
      "Unknown Customer"
    );
  };

  const getEmail = (message) => {
    return (
      message?.email ||
      message?.user?.email ||
      "No email"
    );
  };

  const getPhone = (message) => {
    return (
      message?.phone ||
      message?.user?.phone ||
      "No phone"
    );
  };

  const getSubject = (message) => {
    return message?.subject || "General Enquiry";
  };

  const getMessageText = (message) => {
    return (
      message?.message ||
      message?.description ||
      message?.content ||
      "No message"
    );
  };

  const getStatus = (message) => {
    const status = message?.status || "pending";

    // Backend allows ONLY pending / resolved
    return ["pending", "resolved"].includes(status.toLowerCase())
      ? status.toLowerCase()
      : "pending";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // FILTER MESSAGES
  // =========================================================

  const filteredMessages = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return messages.filter((message) => {
      const name = getName(message).toLowerCase();
      const email = getEmail(message).toLowerCase();
      const subject = getSubject(message).toLowerCase();
      const messageText = getMessageText(message).toLowerCase();
      const phone = getPhone(message).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        subject.includes(searchValue) ||
        messageText.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(message) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalMessages = messages.length;

  const pendingMessages = messages.filter(
    (message) => getStatus(message) === "pending"
  ).length;

  const resolvedMessages = messages.filter(
    (message) => getStatus(message) === "resolved"
  ).length;

  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete contact message"
        );
      }

      setMessages((prevMessages) =>
        prevMessages.filter(
          (message) => message._id !== id
        )
      );
    } catch (error) {
      console.error("Delete message error:", error);

      alert(
        error.message ||
          "Failed to delete contact message"
      );
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    if (status === "resolved") {
      return "status-resolved";
    }

    return "status-pending";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="contact-messages-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="contact-page-header">
        <div>
          <h1>Contact Messages</h1>

          <p>
            Manage customer enquiries and contact requests.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchMessages}
          type="button"
          title="Refresh"
        >
          <i className="bi bi-arrow-clockwise"></i>
          <span>Refresh</span>
        </button>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="contact-stats">

        {/* Total */}

        <div className="contact-stat-card">
          <div className="stat-icon">
            <i className="bi bi-envelope"></i>
          </div>

          <div>
            <span>Total Messages</span>
            <strong>{totalMessages}</strong>
          </div>
        </div>

        {/* Pending */}

        <div className="contact-stat-card">
          <div className="stat-icon pending-icon">
            <i className="bi bi-clock"></i>
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingMessages}</strong>
          </div>
        </div>

        {/* Resolved */}

        <div className="contact-stat-card">
          <div className="stat-icon resolved-icon">
            <i className="bi bi-check2-circle"></i>
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedMessages}</strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="contact-toolbar">

        {/* Search */}

        <div className="contact-search">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}

        <div className="contact-filter">
          <i className="bi bi-funnel"></i>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="resolved">
              Resolved
            </option>
          </select>
        </div>

      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="contact-table-card">

        {/* Table Header */}

        <div className="contact-table-header">
          <div>
            <h2>Customer Enquiries</h2>

            <p>
              {filteredMessages.length} message
              {filteredMessages.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <div className="contact-loading">
            <i className="bi bi-arrow-repeat"></i>

            <span>
              Loading messages...
            </span>
          </div>
        ) : filteredMessages.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="contact-empty">

            <div className="empty-icon">
              <i className="bi bi-envelope-open"></i>
            </div>

            <h3>
              No contact messages found
            </h3>

            <p>
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Customer contact messages will appear here."}
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="contact-table-wrapper">

            <table className="contact-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredMessages.map((message) => {

                  const status = getStatus(message);

                  const createdDate =
                    message.createdAt ||
                    message.created_at;

                  return (
                    <tr key={message._id}>

                      {/* =============================
                          CUSTOMER
                      ============================== */}

                      <td>
                        <div className="customer-cell">

                          <div className="customer-avatar">
                            {getName(message)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="customer-info">

                            <strong>
                              {getName(message)}
                            </strong>

                            <span>
                              {getEmail(message)}
                            </span>

                          </div>

                        </div>
                      </td>

                      {/* =============================
                          SUBJECT
                      ============================== */}

                      <td>
                        <div className="subject-cell">
                          {getSubject(message)}
                        </div>
                      </td>

                      {/* =============================
                          MESSAGE
                      ============================== */}

                      <td>
                        <div className="message-preview">
                          {getMessageText(message)}
                        </div>
                      </td>

                      {/* =============================
                          DATE
                      ============================== */}

                      <td>
                        <div className="date-cell">

                          <strong>
                            {formatDate(createdDate)}
                          </strong>

                          <span>
                            {formatTime(createdDate)}
                          </span>

                        </div>
                      </td>

                      {/* =============================
                          STATUS
                      ============================== */}

                      <td>

                        <span
                          className={`message-status ${getStatusClass(
                            status
                          )}`}
                        >
                          <span className="status-dot"></span>

                          {status === "resolved"
                            ? "Resolved"
                            : "Pending"}
                        </span>

                      </td>

                      {/* =============================
                          ACTIONS
                      ============================== */}

                      <td>

                        <div className="contact-actions">

                          {/* View */}

                          <button
                            type="button"
                            className="icon-action view-action"
                            title="View message"
                            onClick={() =>
                              navigate(
                                `/admin/contact-messages/${message._id}`
                              )
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            className="icon-action delete-action"
                            title="Delete message"
                            onClick={() =>
                              deleteMessage(
                                message._id
                              )
                            }
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default ContactMessages;