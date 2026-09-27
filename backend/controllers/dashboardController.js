const dashboardService = require("../services/dashboardService");

// ================= SUMMARY =================

const getSummary = async (req, res) => {
  try {
    const data =
      await dashboardService.getDashboardSummary();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "DASHBOARD SUMMARY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REVENUE =================

const getRevenue = async (req, res) => {
  try {
    const period =
      req.query.period || "daily";

    const data =
      await dashboardService.getRevenueData(
        period
      );

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error(
      "DASHBOARD REVENUE ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ORDER STATUS =================

const getOrderStatus = async (req, res) => {
  try {
    const data =
      await dashboardService.getOrderStatusData();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "DASHBOARD ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= STOCK ALERTS =================

const getStockAlerts = async (req, res) => {
  try {
    const lowStockLimit =
      req.query.limit || 5;

    const data =
      await dashboardService.getStockAlerts(
        lowStockLimit
      );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "DASHBOARD STOCK ALERT ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RECENT ORDERS =================

const getRecentOrders = async (req, res) => {
  try {
    const limit =
      req.query.limit || 10;

    const data =
      await dashboardService.getRecentOrders(
        limit
      );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "DASHBOARD RECENT ORDERS ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getRevenue,
  getOrderStatus,
  getStockAlerts,
  getRecentOrders,
};