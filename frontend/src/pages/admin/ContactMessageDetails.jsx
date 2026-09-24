import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ContactMessageDetails.css";

const API_URL = "http://localhost:5000/api/contacts";

function ContactMessageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ================= GET CONTACT MESSAGE =================

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
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

        const contacts =
          data.contacts ||
          data.messages ||
          data.data ||
          [];

        const selectedContact = contacts.find(
          (item) => String(item._id) === String(id)
        );

        if (!selectedContact) {
          throw new Error("Contact message not found");
        }

        setContact(selectedContact);
      } catch (err) {
        console.error("Fetch contact error:", err);
        setError(err.message || "Failed to load contact message");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, token]);

  // ================= UPDATE STATUS =================

  const handleStatusChange = async (newStatus) => {
    if (!contact || newStatus === contact.status) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `${API_URL}/${contact._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      const updatedContact =
        data.contact ||
        data.messageData ||
        data.data;

      if (updatedContact) {
        setContact(updatedContact);
      } else {
        setContact((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }

      alert("Contact message status updated successfully");
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ================= DELETE CONTACT =================

  const handleDelete = async () => {
    if (!contact) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/${contact._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete contact message"
        );
      }

      alert("Contact message deleted successfully");

      navigate("/admin/contact-messages");
    } catch (err) {
      console.error("Delete contact error:", err);
      alert(err.message || "Failed to delete contact message");
    } finally {
      setDeleting(false);
    }
  };

  // ================= DATE FORMAT =================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================= STATUS =================

  const isResolved = contact?.status === "resolved";

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="contact-details-page">
        <div className="contact-details-loading">
          <div className="contact-loading-spinner"></div>
          <p>Loading contact message...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error || !contact) {
    return (
      <div className="contact-details-page">
        <div className="contact-details-error">
          <i className="bi bi-exclamation-circle"></i>

          <h3>Contact message not found</h3>

          <p>
            {error || "Something went wrong."}
          </p>

          <button
            className="contact-back-btn"
            onClick={() =>
              navigate("/admin/contact-messages")
            }
          >
            <i className="bi bi-arrow-left"></i>
            Back to Contact Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-details-page">

      {/* ================= HEADER ================= */}

      <div className="contact-details-header">

        <div className="contact-details-heading">
          <div>
            <h1>Contact Message</h1>

            <p>
              View and manage customer enquiry details
            </p>
          </div>

          <span
            className={`contact-status-badge ${
              isResolved ? "resolved" : "pending"
            }`}
          >
            <span className="contact-status-dot"></span>

            {isResolved ? "Resolved" : "Pending"}
          </span>
        </div>

      </div>

      {/* ================= MAIN CARD ================= */}

      <div className="contact-details-card">

        {/* ================= CUSTOMER SECTION ================= */}

        <section className="contact-info-section">

          <div className="contact-section-title">

            <div className="contact-section-icon">
              <i className="bi bi-person"></i>
            </div>

            <div>
              <h2>Customer Information</h2>

              <p>
                Customer details submitted with the enquiry
              </p>
            </div>

          </div>

          <div className="contact-info-grid">

            {/* Name */}

            <div className="contact-info-item">

              <span className="contact-info-label">
                Name
              </span>

              <span className="contact-info-value">
                {contact.name || "—"}
              </span>

            </div>

            {/* Email */}

            <div className="contact-info-item">

              <span className="contact-info-label">
                Email
              </span>

              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="contact-info-value contact-email"
                >
                  {contact.email}
                </a>
              ) : (
                <span className="contact-info-value">
                  —
                </span>
              )}

            </div>

            {/* Phone */}

            <div className="contact-info-item">

              <span className="contact-info-label">
                Phone
              </span>

              {contact.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="contact-info-value contact-phone"
                >
                  {contact.phone}
                </a>
              ) : (
                <span className="contact-info-value">
                  —
                </span>
              )}

            </div>

            {/* Received On */}

            <div className="contact-info-item">

              <span className="contact-info-label">
                Received On
              </span>

              <span className="contact-info-value">
                {formatDate(contact.createdAt)}
              </span>

            </div>

          </div>

        </section>

        {/* ================= MESSAGE SECTION ================= */}

        <section className="contact-message-section">

          <div className="contact-section-title">

            <div className="contact-section-icon">
              <i className="bi bi-chat-left-text"></i>
            </div>

            <div>
              <h2>Message Details</h2>

              <p>
                Customer enquiry information
              </p>
            </div>

          </div>

          <div className="contact-message-content">

            {/* Subject */}

            <div className="contact-subject-block">

              <span className="contact-info-label">
                Subject
              </span>

              <h3>
                {contact.subject || "No subject"}
              </h3>

            </div>

            {/* Message */}

            <div className="contact-message-block">

              <span className="contact-info-label">
                Message
              </span>

              <div className="contact-message-text">
                {contact.message ||
                  "No message available."}
              </div>

            </div>

          </div>

        </section>

        {/* ================= STATUS SECTION ================= */}

        <section className="contact-status-section">

          <div className="contact-section-title">

            <div className="contact-section-icon">
              <i className="bi bi-check2-circle"></i>
            </div>

            <div>
              <h2>Message Status</h2>

              <p>
                Update the current status of this enquiry
              </p>
            </div>

          </div>

          <div className="contact-status-control">

            <label htmlFor="contact-status">
              Current Status
            </label>

            <select
              id="contact-status"
              value={contact.status || "pending"}
              onChange={(e) =>
                handleStatusChange(e.target.value)
              }
              disabled={updating}
            >
              <option value="pending">
                Pending
              </option>

              <option value="resolved">
                Resolved
              </option>
            </select>

            {updating && (
              <span className="contact-updating-text">
                Updating...
              </span>
            )}

          </div>

        </section>

        {/* ================= ACTIONS ================= */}

        <div className="contact-details-actions">

          <button
            className="contact-action-back"
            onClick={() =>
              navigate("/admin/contact-messages")
            }
          >
            <i className="bi bi-arrow-left"></i>
            Back to Contact Messages
          </button>

          <button
            className="contact-action-delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            <i className="bi bi-trash3"></i>

            {deleting
              ? "Deleting..."
              : "Delete Message"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ContactMessageDetails;