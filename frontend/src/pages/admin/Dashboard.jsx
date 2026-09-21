import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api";

const PRODUCTS_API_URL = `${API_URL}/products?limit=1000`;
const ACTIVE_PRODUCTS_API_URL = `${API_URL}/products/active`;
const BEST_SELLERS_API_URL = `${API_URL}/orders/best-sellers`;
const ORDERS_API_URL = `${API_URL}/orders/all`;
const CUSTOMERS_API_URL = `${API_URL}/users?limit=1`;
const CATEGORIES_API_URL = `${API_URL}/categories`;
const COUPONS_API_URL = `${API_URL}/coupons`;

const PERIODS = ["Weekly", "Monthly", "Yearly"];

const ORDER_STATUS_CONFIG = [
  {
    key: "pending",
    label: "Pending",
    color: "#f59e0b",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    color: "#8b5cf6",
  },
  {
    key: "processing",
    label: "Processing",
    color: "#f97316",
  },
  {
    key: "shipped",
    label: "Shipped",
    color: "#3b82f6",
  },
  {
    key: "delivered",
    label: "Delivered",
    color: "#22c55e",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    color: "#ef4444",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("Weekly");

  const [products, setProducts] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);

  const [totalProductCount, setTotalProductCount] = useState(0);
  const [activeProductCount, setActiveProductCount] = useState(0);

  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [periodLoading, setPeriodLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      };

      const fetchApi = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        const text = await response.text();

        let data = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.message || `Request failed: ${response.status}`
          );
        }

        return data;
      };

      const results = await Promise.allSettled([
        fetchApi(PRODUCTS_API_URL),
        fetchApi(ACTIVE_PRODUCTS_API_URL),
        fetchApi(BEST_SELLERS_API_URL),
        fetchApi(ORDERS_API_URL),
        fetchApi(CUSTOMERS_API_URL),
        fetchApi(CATEGORIES_API_URL),
        fetchApi(COUPONS_API_URL),
      ]);

      const [
        productsResult,
        activeProductsResult,
        bestSellersResult,
        ordersResult,
        customersResult,
        categoriesResult,
        couponsResult,
      ] = results;

      /* PRODUCTS */

      if (productsResult.status === "fulfilled") {
        const response = productsResult.value;

        const productData = Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data?.products)
          ? response.data.products
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setProducts(productData);

        const backendTotal =
          Number(response?.totalProducts) ||
          Number(response?.total) ||
          Number(response?.count) ||
          Number(response?.data?.totalProducts) ||
          Number(response?.data?.total) ||
          Number(response?.data?.count) ||
          productData.length;

        setTotalProductCount(backendTotal);
      } else {
        console.error("Products API Error:", productsResult.reason);
        setProducts([]);
        setTotalProductCount(0);
      }

      /* ACTIVE PRODUCTS */

      if (activeProductsResult.status === "fulfilled") {
        const response = activeProductsResult.value;

        const activeData = Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data?.products)
          ? response.data.products
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setActiveProducts(activeData);

        const backendActiveTotal =
          Number(response?.totalProducts) ||
          Number(response?.total) ||
          Number(response?.count) ||
          Number(response?.activeProducts) ||
          Number(response?.data?.totalProducts) ||
          Number(response?.data?.total) ||
          Number(response?.data?.count) ||
          Number(response?.data?.activeProducts) ||
          activeData.length;

        setActiveProductCount(backendActiveTotal);
      } else {
        console.error(
          "Active Products API Error:",
          activeProductsResult.reason
        );

        setActiveProducts([]);
        setActiveProductCount(0);
      }

      /* BEST SELLERS */

      if (bestSellersResult.status === "fulfilled") {
        const response = bestSellersResult.value;

        const bestSellerData = Array.isArray(response)
          ? response
          : Array.isArray(response?.bestSellers)
          ? response.bestSellers
          : Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data?.bestSellers)
          ? response.data.bestSellers
          : Array.isArray(response?.data?.products)
          ? response.data.products
          : Array.isArray(response?.data)
          ? response.data
          : [];

        setBestSellingProducts(bestSellerData);
      } else {
        console.error(
          "Best Sellers API Error:",
          bestSellersResult.reason
        );

        setBestSellingProducts([]);
      }

      /* ORDERS */

      if (ordersResult.status === "fulfilled") {
        const response = ordersResult.value;

        const orderData = Array.isArray(response?.orders)
          ? response.orders
          : Array.isArray(response?.data?.orders)
          ? response.data.orders
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setOrders(orderData);
      } else {
        console.error("Orders API Error:", ordersResult.reason);
        setOrders([]);
      }

      /* CUSTOMERS */

      if (customersResult.status === "fulfilled") {
        const response = customersResult.value;

        const totalCustomers =
          Number(response?.total) ||
          Number(response?.totalUsers) ||
          Number(response?.count) ||
          Number(response?.data?.total) ||
          Number(response?.data?.totalUsers) ||
          Number(response?.data?.count);

        if (Number.isFinite(totalCustomers) && totalCustomers > 0) {
          setCustomerCount(totalCustomers);
        } else if (Array.isArray(response?.users)) {
          setCustomerCount(response.users.length);
        } else if (Array.isArray(response?.data?.users)) {
          setCustomerCount(response.data.users.length);
        } else {
          setCustomerCount(0);
        }
      } else {
        console.error(
          "Customers API Error:",
          customersResult.reason
        );

        setCustomerCount(0);
      }

      /* CATEGORIES */

      if (categoriesResult.status === "fulfilled") {
        const response = categoriesResult.value;

        const categoryData = Array.isArray(response?.categories)
          ? response.categories
          : Array.isArray(response?.data?.categories)
          ? response.data.categories
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setCategories(categoryData);
      } else {
        console.error(
          "Categories API Error:",
          categoriesResult.reason
        );

        setCategories([]);
      }

      /* COUPONS */

      if (couponsResult.status === "fulfilled") {
        const response = couponsResult.value;

        const couponData = Array.isArray(response?.coupons)
          ? response.coupons
          : Array.isArray(response?.data?.coupons)
          ? response.data.coupons
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setCoupons(couponData);
      } else {
        console.error(
          "Coupons API Error:",
          couponsResult.reason
        );

        setCoupons([]);
      }

      const failedApis = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedApis.length === results.length) {
        setError("Unable to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
      setPeriodLoading(false);
    }
  };

  /* =========================================================
     PERIOD CHANGE
  ========================================================= */

  useEffect(() => {
    if (!loading) {
      setPeriodLoading(true);

      const timer = setTimeout(() => {
        setPeriodLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [period, loading]);

  /* =========================================================
     STOCK
  ========================================================= */

  const getProductStock = (product) => {
    return Number(product?.stock) || 0;
  };

  const lowStockProducts = useMemo(() => {
    return products
      .filter((product) => {
        const stock = getProductStock(product);
        return stock > 0 && stock <= 10;
      })
      .sort(
        (a, b) =>
          getProductStock(a) - getProductStock(b)
      );
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter(
      (product) => getProductStock(product) === 0
    ).length;
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((product) => {
      const stock = getProductStock(product);
      return stock > 0 && stock <= 10;
    }).length;
  }, [products]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const summary = useMemo(() => {
    const totalProducts = totalProductCount;
    const activeProductsCount = activeProductCount;

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) =>
        String(order.orderStatus || "").toUpperCase() ===
        "PENDING"
    ).length;

    const deliveredOrders = orders.filter(
      (order) =>
        String(order.orderStatus || "").toUpperCase() ===
        "DELIVERED"
    ).length;

    const cancelledOrders = orders.filter(
      (order) =>
        String(order.orderStatus || "").toUpperCase() ===
        "CANCELLED"
    ).length;

    const revenue = orders.reduce((total, order) => {
      const paymentStatus = String(
        order.paymentStatus || ""
      ).toUpperCase();

      const orderStatus = String(
        order.orderStatus || ""
      ).toUpperCase();

      if (paymentStatus !== "PAID") {
        return total;
      }

      if (orderStatus === "CANCELLED") {
        return total;
      }

      return total + Number(order.finalAmount || 0);
    }, 0);

    return {
      totalProducts,
      activeProducts: activeProductsCount,
      categories: categories.length,
      coupons: coupons.length,
      customers: customerCount,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenue,
    };
  }, [
    totalProductCount,
    activeProductCount,
    orders,
    categories,
    coupons,
    customerCount,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(
    () => [
      {
        title: "Total Products",
        value: summary.totalProducts,
        icon: "bi-box-seam",
        className: "products",
      },
      {
        title: "Active Products",
        value: summary.activeProducts,
        icon: "bi-check-circle",
        className: "active",
      },
      {
        title: "Categories",
        value: summary.categories,
        icon: "bi-grid",
        className: "categories",
      },
      {
        title: "Coupons",
        value: summary.coupons,
        icon: "bi-ticket-perforated",
        className: "coupons",
      },
      {
        title: "Customers",
        value: summary.customers,
        icon: "bi-people",
        className: "customers",
      },
      {
        title: "Total Orders",
        value: summary.totalOrders,
        icon: "bi-cart3",
        className: "orders",
      },
      {
        title: "Pending Orders",
        value: summary.pendingOrders,
        icon: "bi-hourglass-split",
        className: "pending",
      },
      {
        title: "Delivered Orders",
        value: summary.deliveredOrders,
        icon: "bi-check2-circle",
        className: "delivered",
      },
      {
        title: "Cancelled Orders",
        value: summary.cancelledOrders,
        icon: "bi-x-circle",
        className: "cancelled",
      },
      {
        title: "Total Revenue",
        value: formatCurrency(summary.revenue),
        icon: "bi-graph-up-arrow",
        className: "revenue",
      },
    ],
    [summary]
  );

  /* =========================================================
     ORDER STATUS
  ========================================================= */

  const orderStatus = useMemo(() => {
    const result = {};

    ORDER_STATUS_CONFIG.forEach((item) => {
      result[item.key] = 0;
    });

    orders.forEach((order) => {
      const status = String(
        order.orderStatus || ""
      )
        .toLowerCase()
        .trim();

      const matched = ORDER_STATUS_CONFIG.find(
        (item) => item.key === status
      );

      if (matched) {
        result[matched.key] += 1;
      }
    });

    return result;
  }, [orders]);

  const totalStatusOrders =
    ORDER_STATUS_CONFIG.reduce(
      (total, item) =>
        total + Number(orderStatus[item.key] || 0),
      0
    );

  /* =========================================================
     DONUT
  ========================================================= */

  const donutBackground = useMemo(() => {
    if (!totalStatusOrders) {
      return "#eeeeee";
    }

    let current = 0;

    const sections = ORDER_STATUS_CONFIG.map((item) => {
      const value = Number(
        orderStatus[item.key] || 0
      );

      const start = current;

      current +=
        (value / totalStatusOrders) * 100;

      return `${item.color} ${start}% ${current}%`;
    });

    return `conic-gradient(${sections.join(", ")})`;
  }, [orderStatus, totalStatusOrders]);

  /* =========================================================
     PERIOD RANGE
  ========================================================= */

  const getPeriodRange = () => {
    const now = new Date();

    if (period === "Weekly") {
      const start = new Date(now);

      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      return {
        start,
        count: 7,
      };
    }

    if (period === "Monthly") {
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      return {
        start,
        count: now.getDate(),
      };
    }

    const start = new Date(
      now.getFullYear(),
      0,
      1
    );

    return {
      start,
      count: now.getMonth() + 1,
    };
  };

  /* =========================================================
     REVENUE
  ========================================================= */

  const isRevenueOrder = (order) => {
    const paymentStatus = String(
      order.paymentStatus || ""
    ).toUpperCase();

    const orderStatus = String(
      order.orderStatus || ""
    ).toUpperCase();

    return (
      paymentStatus === "PAID" &&
      orderStatus !== "CANCELLED"
    );
  };

  const revenueData = useMemo(() => {
    const { start, count } = getPeriodRange();

    const labels = [];
    const values = [];

    for (let i = 0; i < count; i++) {
      const current = new Date(start);

      if (period === "Weekly") {
        current.setDate(start.getDate() + i);

        labels.push(
          current.toLocaleDateString("en-IN", {
            weekday: "short",
          })
        );
      }

      if (period === "Monthly") {
        current.setDate(i + 1);

        labels.push(
          current.toLocaleDateString("en-IN", {
            day: "2-digit",
          })
        );
      }

      if (period === "Yearly") {
        current.setMonth(i);

        labels.push(
          current.toLocaleDateString("en-IN", {
            month: "short",
          })
        );
      }

      let total = 0;

      orders.forEach((order) => {
        if (!isRevenueOrder(order)) {
          return;
        }

        const orderDate = new Date(
          order.createdAt
        );

        if (Number.isNaN(orderDate.getTime())) {
          return;
        }

        let matches = false;

        if (period === "Weekly") {
          matches =
            orderDate.toDateString() ===
            current.toDateString();
        }

        if (period === "Monthly") {
          matches =
            orderDate.getFullYear() ===
              current.getFullYear() &&
            orderDate.getMonth() ===
              current.getMonth() &&
            orderDate.getDate() ===
              current.getDate();
        }

        if (period === "Yearly") {
          matches =
            orderDate.getFullYear() ===
              current.getFullYear() &&
            orderDate.getMonth() ===
              current.getMonth();
        }

        if (matches) {
          total += Number(
            order.finalAmount || 0
          );
        }
      });

      values.push(total);
    }

    return {
      labels,
      values,
      total: values.reduce(
        (sum, value) => sum + value,
        0
      ),
    };
  }, [orders, period]);

  const revenueLabels = revenueData.labels;

  const revenueValues = revenueData.values.map(
    (value) => Number(value) || 0
  );

  const revenueMax = Math.max(
    ...revenueValues,
    1
  );

  const revenueTotal = revenueData.total;

  /* =========================================================
     ORDERS GRAPH
  ========================================================= */

  const ordersGraph = useMemo(() => {
    const { start, count } = getPeriodRange();

    const labels = [];
    const values = [];

    for (let i = 0; i < count; i++) {
      const current = new Date(start);

      if (period === "Weekly") {
        current.setDate(start.getDate() + i);

        labels.push(
          current.toLocaleDateString("en-IN", {
            weekday: "short",
          })
        );
      }

      if (period === "Monthly") {
        current.setDate(i + 1);

        labels.push(
          current.toLocaleDateString("en-IN", {
            day: "2-digit",
          })
        );
      }

      if (period === "Yearly") {
        current.setMonth(i);

        labels.push(
          current.toLocaleDateString("en-IN", {
            month: "short",
          })
        );
      }

      let countOrders = 0;

      orders.forEach((order) => {
        const orderDate = new Date(
          order.createdAt
        );

        if (Number.isNaN(orderDate.getTime())) {
          return;
        }

        let matches = false;

        if (period === "Weekly") {
          matches =
            orderDate.toDateString() ===
            current.toDateString();
        }

        if (period === "Monthly") {
          matches =
            orderDate.getFullYear() ===
              current.getFullYear() &&
            orderDate.getMonth() ===
              current.getMonth() &&
            orderDate.getDate() ===
              current.getDate();
        }

        if (period === "Yearly") {
          matches =
            orderDate.getFullYear() ===
              current.getFullYear() &&
            orderDate.getMonth() ===
              current.getMonth();
        }

        if (matches) {
          countOrders += 1;
        }
      });

      values.push(countOrders);
    }

    return {
      labels,
      values,
      total: values.reduce(
        (sum, value) => sum + value,
        0
      ),
    };
  }, [orders, period]);

  const orderLabels = ordersGraph.labels;

  const orderValues = ordersGraph.values.map(
    (value) => Number(value) || 0
  );

  const orderMax = Math.max(
    ...orderValues,
    1
  );

  const orderTotal = ordersGraph.total;

  /* =========================================================
     BEST SELLERS
  ========================================================= */

  const getBestSellerTotal = (item) => {
    const product = item?.product || item;

    return Number(
      item?.totalSold ??
        product?.totalSold ??
        0
    );
  };

  const sortedBestSellingProducts = useMemo(() => {
    return [...bestSellingProducts].sort(
      (a, b) =>
        getBestSellerTotal(b) -
        getBestSellerTotal(a)
    );
  }, [bestSellingProducts]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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

  const getStatusClass = (status) => {
    if (!status) {
      return "pending";
    }

    return String(status)
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <div className="dashboard-title-row">
            <h1>Dashboard</h1>
          </div>

          <p>
            Welcome back, Admin. Here's what's
            happening with your store.
          </p>
        </div>

        {/* WEEKLY / MONTHLY / YEARLY */}

        <div className="dashboard-header-actions">
          <div className="dashboard-period-control">
            <i className="bi bi-calendar3"></i>

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
              disabled={periodLoading}
            >
              {PERIODS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <i className="bi bi-chevron-down"></i>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          <i className="bi bi-exclamation-circle"></i>

          <span>{error}</span>

          <button
            type="button"
            onClick={fetchDashboardData}
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.title}
          >
            <div
              className={`stat-icon ${stat.className}`}
            >
              <i
                className={`bi ${stat.icon}`}
              ></i>
            </div>

            <div className="stat-content">
              <p>{stat.title}</p>

              <h2>
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString(
                      "en-IN"
                    )
                  : stat.value}
              </h2>
            </div>
          </div>
        ))}
      </section>

      {/* =====================================================
          REVENUE + ORDER GRAPH
      ===================================================== */}

      <section className="dashboard-chart-grid">

        {/* REVENUE */}

        <div className="dashboard-card revenue-card">
          <div className="card-header">
            <div>
              <h3>Revenue Overview</h3>
              <p>
                Sales performance for the selected
                period
              </p>
            </div>

            <div className="chart-period-label">
              {period}
            </div>
          </div>

          <div className="chart-summary">
            <div>
              <span>Total Revenue</span>

              <strong>
                {formatCurrency(revenueTotal)}
              </strong>
            </div>
          </div>

          <div className="bar-chart">
            <div className="chart-y-labels">
              <span>
                {formatCompactCurrency(
                  revenueMax
                )}
              </span>

              <span>
                {formatCompactCurrency(
                  revenueMax * 0.75
                )}
              </span>

              <span>
                {formatCompactCurrency(
                  revenueMax * 0.5
                )}
              </span>

              <span>
                {formatCompactCurrency(
                  revenueMax * 0.25
                )}
              </span>

              <span>₹0</span>
            </div>

            <div className="chart-bars-area">
              <div className="chart-grid-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="chart-bars">
                {revenueValues.length > 0 ? (
                  revenueValues.map(
                    (value, index) => (
                      <div
                        className="bar-column"
                        key={`${index}-revenue`}
                      >
                        <div className="bar-value">
                          {formatCompactCurrency(
                            value
                          )}
                        </div>

                        <div className="bar-track">
                          <div
                            className="revenue-bar"
                            style={{
                              height: `${Math.max(
                                (value /
                                  revenueMax) *
                                  100,
                                value > 0 ? 5 : 0
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <span className="bar-label">
                          {revenueLabels[index] ||
                            "-"}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <div className="chart-empty">
                    No revenue data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS */}

        <div className="dashboard-card order-graph-card">
          <div className="card-header">
            <div>
              <h3>Order Overview</h3>
              <p>
                Orders for the selected period
              </p>
            </div>

            <div className="chart-period-label">
              {period}
            </div>
          </div>

          <div className="chart-summary">
            <div>
              <span>Total Orders</span>

              <strong>
                {Number(orderTotal).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          </div>

          <div className="line-chart">
            <div className="line-chart-y">
              <span>{orderMax}</span>
              <span>
                {Math.round(orderMax * 0.75)}
              </span>
              <span>
                {Math.round(orderMax * 0.5)}
              </span>
              <span>
                {Math.round(orderMax * 0.25)}
              </span>
              <span>0</span>
            </div>

            <div className="line-chart-area">
              <div className="chart-grid-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              {orderValues.length > 0 ? (
                <div className="order-line-bars">
                  {orderValues.map(
                    (value, index) => (
                      <div
                        className="order-line-column"
                        key={`${index}-order`}
                      >
                        <div
                          className="order-line-point"
                          style={{
                            bottom: `${Math.max(
                              (value /
                                orderMax) *
                                100,
                              value > 0 ? 4 : 0
                            )}%`,
                          }}
                        >
                          <span>{value}</span>
                        </div>

                        <div
                          className="order-line-fill"
                          style={{
                            height: `${Math.max(
                              (value /
                                orderMax) *
                                100,
                              value > 0 ? 4 : 0
                            )}%`,
                          }}
                        ></div>

                        <span className="order-line-label">
                          {orderLabels[index] ||
                            "-"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="chart-empty">
                  No order data available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORDER STATUS + STOCK ALERT
      ===================================================== */}

      <section className="dashboard-middle-grid">

        {/* ORDER STATUS */}

        <div className="dashboard-card order-summary-card">
          <div className="card-header">
            <div>
              <h3>Order Status</h3>

              <p>
                Current order status breakdown
              </p>
            </div>
          </div>

          <div className="order-summary-content">

            {/* DONUT */}

            <div className="order-chart-section">
              <div
                className="order-donut"
                style={{
                  background: donutBackground,
                }}
              >
                <div className="order-donut-center">
                  <strong>
                    {totalStatusOrders.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <span>Total Orders</span>
                </div>
              </div>
            </div>

            {/* STATUS LIST */}

            <div className="order-status-list">
              {ORDER_STATUS_CONFIG.map(
                (item) => {
                  const count =
                    Number(
                      orderStatus[item.key]
                    ) || 0;

                  const percentage =
                    totalStatusOrders > 0
                      ? Math.round(
                          (count /
                            totalStatusOrders) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="order-status-item"
                      key={item.key}
                    >
                      <span
                        className="status-dot"
                        style={{
                          backgroundColor:
                            item.color,
                        }}
                      ></span>

                      <div className="status-info">
                        <div className="status-name-row">
                          <span>
                            {item.label}
                          </span>

                          <strong>
                            {count.toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>

                        <div className="status-progress">
                          <span
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                item.color,
                            }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* STOCK ALERT */}

        <div className="dashboard-card stock-alert-card">
          <div className="card-header">
            <div>
              <h3>Stock Alerts</h3>

              <p>
                Products that need attention
              </p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() =>
                navigate("/admin/inventory")
              }
            >
              View Inventory
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="stock-alert-summary">
            <div className="stock-alert-box out">
              <div className="stock-alert-icon">
                <i className="bi bi-x-circle"></i>
              </div>

              <div>
                <span>Out of Stock</span>

                <strong>
                  {outOfStockCount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>

            <div className="stock-alert-box low">
              <div className="stock-alert-icon">
                <i className="bi bi-exclamation-triangle"></i>
              </div>

              <div>
                <span>Low Stock</span>

                <strong>
                  {lowStockCount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>
          </div>

          <div className="stock-product-list">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(
                (product, index) => {
                  const stock =
                    getProductStock(product);

                  return (
                    <div
                      className="stock-product-item"
                      key={
                        product._id ||
                        product.id ||
                        index
                      }
                    >
                      <div className="stock-product-icon">
                        <i className="bi bi-box"></i>
                      </div>

                      <div className="stock-product-info">
                        <strong>
                          {product.name ||
                            "Unnamed Product"}
                        </strong>

                        <span>
                          {stock} units left
                        </span>
                      </div>

                      <span className="stock-warning">
                        Low
                      </span>
                    </div>
                  );
                }
              )
            ) : (
              <div className="stock-empty">
                <i className="bi bi-check-circle"></i>

                <p>
                  No low stock products
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          BEST SELLING + RECENT ORDERS
          TWO COLUMNS
      ===================================================== */}

      <section className="dashboard-bottom-grid">

        {/* BEST SELLING */}

        <div className="dashboard-card best-selling-card">
          <div className="card-header">
            <div>
              <h3>Best Selling Products</h3>

              <p>
                Top products based on total
                quantity sold
              </p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              View Products
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="best-selling-list">
            {sortedBestSellingProducts.length >
            0 ? (
              sortedBestSellingProducts
                .slice(0, 10)
                .map((item, index) => {
                  const product =
                    item.product || item;

                  const totalSold = Number(
                    item.totalSold ??
                      product.totalSold ??
                      0
                  );

                  return (
                    <div
                      className="best-selling-item"
                      key={
                        product._id ||
                        product.id ||
                        index
                      }
                    >
                      <div className="best-selling-rank">
                        #{index + 1}
                      </div>

                      <div className="best-selling-product-icon">
                        {product.images?.[0] ? (
                          <img
                            src={
                              product.images[0]
                            }
                            alt={
                              product.name ||
                              "Product"
                            }
                          />
                        ) : (
                          <i className="bi bi-image"></i>
                        )}
                      </div>

                      <div className="best-selling-product-info">
                        <strong>
                          {product.name ||
                            "Unnamed Product"}
                        </strong>

                        <span>
                          {totalSold.toLocaleString(
                            "en-IN"
                          )}{" "}
                          units sold
                        </span>
                      </div>

                      <div className="best-selling-product-price">
                        {product.price !==
                        undefined
                          ? formatCurrency(
                              product.price
                            )
                          : product.salePrice !==
                            undefined
                          ? formatCurrency(
                              product.salePrice
                            )
                          : "-"}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="best-selling-empty">
                <i className="bi bi-bar-chart-line"></i>

                <h4>
                  No best selling products
                </h4>

                <p>
                  Best selling products will
                  appear here once orders are
                  placed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RECENT ORDERS */}

        <div className="dashboard-card recent-orders-card">
          <div className="card-header">
            <div>
              <h3>Recent Orders</h3>

              <p>
                Latest orders from your
                customers
              </p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() =>
                navigate("/admin/orders")
              }
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
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  [...orders]
                    .sort(
                      (a, b) =>
                        new Date(
                          b.createdAt || 0
                        ) -
                        new Date(
                          a.createdAt || 0
                        )
                    )
                    .slice(0, 6)
                    .map((order, index) => {
                      const customerName =
                        order.user?.name ||
                        order.shippingAddress
                          ?.fullName ||
                        "Customer";

                      const orderId =
                        order.orderNumber ||
                        order.orderId ||
                        order._id ||
                        "-";

                      return (
                        <tr
                          key={
                            order._id ||
                            order.id ||
                            index
                          }
                        >
                          <td>
                            <strong>
                              {String(
                                orderId
                              ).slice(-10)}
                            </strong>
                          </td>

                          <td>
                            <div className="customer-cell">
                              <div className="customer-avatar">
                                {getInitial(
                                  customerName
                                )}
                              </div>

                              <span>
                                {customerName}
                              </span>
                            </div>
                          </td>

                          <td>
                            {formatDate(
                              order.createdAt
                            )}
                          </td>

                          <td>
                            <strong>
                              {formatCurrency(
                                order.finalAmount
                              )}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`order-status payment-${getStatusClass(
                                order.paymentStatus ||
                                  "PENDING"
                              )}`}
                            >
                              {formatStatus(
                                order.paymentStatus ||
                                  "PENDING"
                              )}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`order-status ${getStatusClass(
                                order.orderStatus ||
                                  "PENDING"
                              )}`}
                            >
                              {formatStatus(
                                order.orderStatus ||
                                  "PENDING"
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="empty-table"
                    >
                      <i className="bi bi-inbox"></i>

                      <span>
                        No recent orders
                        available
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PERIOD LOADING */}

      {periodLoading && (
        <div className="period-loading">
          <div className="mini-spinner"></div>
          Updating dashboard...
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  const number = Number(value) || 0;

  return `₹${number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function formatCompactCurrency(value) {
  const number = Number(value) || 0;

  if (number >= 10000000) {
    return `₹${(number / 10000000).toFixed(1)}Cr`;
  }

  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  }

  if (number >= 1000) {
    return `₹${(number / 1000).toFixed(1)}K`;
  }

  return `₹${number}`;
}

function getInitial(name) {
  if (!name) {
    return "C";
  }

  return String(name)
    .trim()
    .charAt(0)
    .toUpperCase();
}

function formatStatus(status) {
  if (!status) {
    return "-";
  }

  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default Dashboard;