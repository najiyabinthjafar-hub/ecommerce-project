import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Customers.css";

const API_URL = "http://localhost:5000/api";

const Customers = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);

  const limit = 10;

  const token = localStorage.getItem("token");

  /* =========================================================
     SAFE RESPONSE PARSER
  ========================================================= */

  const getResponseData = async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {
        message: text || "Something went wrong",
      };
    }
  };

  /* =========================================================
     FETCH CUSTOMERS
  ========================================================= */

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token not found.");
        setCustomers([]);
        return;
      }

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);
      params.append("sort", sort);

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}/users?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch customers"
        );
      }

      setCustomers(
        Array.isArray(data.users) ? data.users : []
      );

      setTotalPages(data.totalPages || 1);
      setTotalRegisteredUsers(data.total || 0);
    } catch (err) {
      console.error("Customer fetch error:", err);

      setError(
        err.message || "Failed to load customers"
      );

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = async () => {
    try {
      if (!token) return;

      const response = await fetch(
        `${API_URL}/orders/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await getResponseData(response);

      if (!response.ok) {
        console.error(
          "Orders fetch error:",
          data.message
        );
        return;
      }

      let orderList = [];

      if (Array.isArray(data)) {
        orderList = data;
      } else if (Array.isArray(data.orders)) {
        orderList = data.orders;
      } else if (Array.isArray(data.data)) {
        orderList = data.data;
      }

      setOrders(orderList);
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  /* =========================================================
     CUSTOMER FETCH
  ========================================================= */

  useEffect(() => {
    fetchCustomers();
  }, [page, sort, statusFilter]);

  /* =========================================================
     ORDERS FETCH
  ========================================================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  useEffect(() => {
  const timer = setTimeout(() => {
    fetchCustomers();
  }, 400);

  return () => clearTimeout(timer);
}, [page, search, sort, statusFilter]);
  /* =========================================================
     CUSTOMER ORDER MATCHING
  ========================================================= */

  const customerData = useMemo(() => {
    return customers.map((customer) => {
      const customerId =
        customer?._id?.toString();

      const customerOrders = orders.filter(
        (order) => {
          const orderUserId =
            order?.user?._id?.toString() ||
            order?.user?.id?.toString() ||
            order?.userId?.toString();

          const orderEmail =
            order?.user?.email ||
            order?.email ||
            order?.shippingAddress?.email;

          const orderPhone =
            order?.user?.phone ||
            order?.phone ||
            order?.shippingAddress?.phone;

          const orderName =
            order?.user?.name ||
            order?.customerName ||
            order?.shippingAddress?.name;

          const customerEmail =
            customer?.email;

          const customerPhone =
            customer?.phone;

          const customerName =
            customer?.name;

          /* Match by ID */

          if (customerId && orderUserId) {
            if (customerId === orderUserId) {
              return true;
            }
          }

          /* Match by email */

          if (
            customerEmail &&
            orderEmail &&
            customerEmail.toLowerCase() ===
              orderEmail.toLowerCase()
          ) {
            return true;
          }

          /* Match by phone */

          if (
            customerPhone &&
            orderPhone &&
            customerPhone === orderPhone
          ) {
            return true;
          }

          /* Match by name */

          if (
            customerName &&
            orderName &&
            customerName.toLowerCase() ===
              orderName.toLowerCase()
          ) {
            return true;
          }

          return false;
        }
      );

      /* =====================================================
         TOTAL SPENT
      ===================================================== */

      const totalSpent =
        customerOrders.reduce(
          (total, order) => {
            const amount =
              Number(
                order?.finalAmount ??
                  order?.totalAmount ??
                  order?.total ??
                  order?.amount ??
                  0
              ) || 0;

            return total + amount;
          },
          0
        );

      return {
        ...customer,

        orders: customerOrders,

        orderCount:
          customerOrders.length,

        totalSpent,
      };
    });
  }, [customers, orders]);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  /* =========================================================
     STATUS CHANGE
  ========================================================= */

  const handleStatusChange = async (customer) => {
    if (!customer?._id) return;

    const newStatus =
      customer.status === "blocked"
        ? "active"
        : "blocked";

    const actionText =
      newStatus === "blocked"
        ? "block"
        : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${customer.name}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(customer._id);

      if (!token) {
        alert(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/users/${customer._id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data =
        await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update customer status"
        );
      }

      setCustomers(
        (previousCustomers) =>
          previousCustomers.map(
            (item) =>
              item._id === customer._id
                ? {
                    ...item,
                    status: newStatus,
                  }
                : item
          )
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        err.message ||
          "Failed to update customer status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================================================
     VIEW CUSTOMER
  ========================================================= */

  const handleViewCustomer = (customer) => {
    if (!customer?._id) return;

    const selectedCustomer =
      customerData.find(
        (item) =>
          item._id === customer._id
      ) || customer;

    navigate(
      `/admin/customers/${customer._id}`,
      {
        state: {
          customer: selectedCustomer,
        },
      }
    );
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePrevious = () => {
    if (page > 1) {
      setPage(
        (previousPage) =>
          previousPage - 1
      );
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(
        (previousPage) =>
          previousPage + 1
      );
    }
  };

  /* =========================================================
     SUMMARY COUNTS
  ========================================================= */

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status !== "blocked"
    ).length;

  const blockedCustomers =
    customers.filter(
      (customer) =>
        customer.status === "blocked"
    ).length;

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="customers-page">
        <div className="customers-loading">
          Loading customers...
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="customers-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="customers-header">

        <div>
          <h1>Customers</h1>

          <p>
            Manage registered customers
            and their accounts.
          </p>
        </div>

        <div className="customers-total">
          <span>Total Customers</span>

          <strong>
            {totalRegisteredUsers}
          </strong>
        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="customers-summary-cards">

        {/* Total Customers */}

        <div className="customer-summary-card">

          <div className="summary-card-icon total">
            <i className="bi bi-people"></i>
          </div>

          <div className="summary-card-content">

            <span>
              Total Customers
            </span>

            <strong>
              {totalRegisteredUsers}
            </strong>

          </div>

        </div>


        {/* Active Customers */}

        <div className="customer-summary-card">

          <div className="summary-card-icon active">
            <i className="bi bi-person-check"></i>
          </div>

          <div className="summary-card-content">

            <span>
              Active Customers
            </span>

            <strong>
              {activeCustomers}
            </strong>

          </div>

        </div>


        {/* Blocked Customers */}

        <div className="customer-summary-card">

          <div className="summary-card-icon blocked">
            <i className="bi bi-person-x"></i>
          </div>

          <div className="summary-card-content">

            <span>
              Blocked Customers
            </span>

            <strong>
              {blockedCustomers}
            </strong>

          </div>

        </div>


        {/* Total Orders */}

        <div className="customer-summary-card">

          <div className="summary-card-icon orders">
            <i className="bi bi-bag-check"></i>
          </div>

          <div className="summary-card-content">

            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTER TOOLBAR
      ===================================================== */}

      <div className="customers-toolbar">

        {/* Search */}

        <div className="customers-search">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        {/* Filters */}

        <div className="customers-filter-group">

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target.value
              );

              setPage(1);
            }}
          >

            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="blocked">
              Blocked
            </option>

          </select>


          <select
            value={sort}
            onChange={(event) => {
              setSort(
                event.target.value
              );

              setPage(1);
            }}
          >

            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="name_asc">
              Name A-Z
            </option>

            <option value="name_desc">
              Name Z-A
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="customers-error">
          {error}
        </div>
      )}


      {/* =====================================================
          CUSTOMER TABLE
      ===================================================== */}

      <div className="customers-table-wrapper">

        <table className="customers-table">

          <thead>

            <tr>

              <th>
                Customer
              </th>

              <th>
                Joined
              </th>

              <th>
                Contact
              </th>

              <th>
                Orders
              </th>

              <th>
                Total Spent
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {customerData.length > 0 ? (

              customerData.map(
                (customer) => (

                  <tr
                    key={customer._id}
                  >

                    {/* ================= CUSTOMER ================= */}

                    <td>

                      <div className="customer-info">

                        <div className="customer-avatar">

                          {customer.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}

                        </div>

                        <div className="customer-name">

                          <strong>
                            {customer.name ||
                              "Unknown"}
                          </strong>

                        </div>

                      </div>

                    </td>


                    {/* ================= JOINED ================= */}

                    <td>

                      {formatDate(
                        customer.createdAt
                      )}

                    </td>


                    {/* ================= CONTACT ================= */}

                    <td>

                      <div className="customer-contact">

                        <span>
                          {customer.email ||
                            "-"}
                        </span>

                        <small>
                          {customer.phone ||
                            "-"}
                        </small>

                      </div>

                    </td>


                    {/* ================= ORDERS ================= */}

                    <td>

                      <span className="orders-count">

                        {customer.orderCount ||
                          0}

                      </span>

                    </td>


                    {/* ================= TOTAL SPENT ================= */}

                    <td>

                      <strong>
                        {formatCurrency(
                          customer.totalSpent
                        )}
                      </strong>

                    </td>


                    {/* ================= STATUS ================= */}

                    <td>

                      <span
                        className={`customer-status ${
                          customer.status ===
                          "blocked"
                            ? "blocked"
                            : "active"
                        }`}
                      >

                        {customer.status ===
                        "blocked"
                          ? "Blocked"
                          : "Active"}

                      </span>

                    </td>


                    {/* ================= ACTION ================= */}

                    <td>

                      <div className="customer-actions">

                        {/* View */}

                        <button
                          type="button"
                          className="icon-action-btn view"
                          title="View Customer"
                          aria-label="View Customer"
                          onClick={() =>
                            handleViewCustomer(
                              customer
                            )
                          }
                        >

                          <i className="bi bi-eye"></i>

                        </button>


                        {/* Block / Unblock */}

                        <button
                          type="button"
                          className={`icon-action-btn ${
                            customer.status ===
                            "blocked"
                              ? "unblock"
                              : "block"
                          }`}
                          title={
                            customer.status ===
                            "blocked"
                              ? "Unblock Customer"
                              : "Block Customer"
                          }
                          aria-label={
                            customer.status ===
                            "blocked"
                              ? "Unblock Customer"
                              : "Block Customer"
                          }
                          disabled={
                            actionLoading ===
                            customer._id
                          }
                          onClick={() =>
                            handleStatusChange(
                              customer
                            )
                          }
                        >

                          {actionLoading ===
                          customer._id ? (

                            <i className="bi bi-three-dots"></i>

                          ) : customer.status ===
                            "blocked" ? (

                            <i className="bi bi-unlock"></i>

                          ) : (

                            <i className="bi bi-slash-circle"></i>

                          )}

                        </button>

                      </div>

                    </td>

                  </tr>

                )

              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="customers-empty"
                >
                  No customers found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div className="customers-pagination">

        <button
          type="button"
          onClick={handlePrevious}
          disabled={page <= 1}
        >

          <i className="bi bi-chevron-left"></i>

          Previous

        </button>


        <span>

          Page{" "}

          <strong>
            {page}
          </strong>

          {" "}of{" "}

          <strong>
            {totalPages}
          </strong>

        </span>


        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages}
        >

          Next

          <i className="bi bi-chevron-right"></i>

        </button>

      </div>

    </div>
  );
};

export default Customers;