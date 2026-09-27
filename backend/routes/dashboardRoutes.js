const express = require("express");

const {
  getSummary,
  getRevenue,
  getOrderStatus,
  getStockAlerts,
  getRecentOrders,
} = require("../controllers/dashboardController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ================= ADMIN DASHBOARD =================

// Dashboard Summary
router.get(
  "/summary",
  protect,
  adminOnly,
  getSummary
);

// Revenue / Sales
router.get(
  "/revenue",
  protect,
  adminOnly,
  getRevenue
);

// Order Status
router.get(
  "/order-status",
  protect,
  adminOnly,
  getOrderStatus
);

// Stock Alerts
router.get(
  "/stock-alerts",
  protect,
  adminOnly,
  getStockAlerts
);

// Recent Orders
router.get(
  "/recent-orders",
  protect,
  adminOnly,
  getRecentOrders
);

module.exports = router;