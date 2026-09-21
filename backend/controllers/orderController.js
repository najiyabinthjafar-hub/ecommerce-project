const orderService = require("../services/orderService");


// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      user: req.user._id,
    };

    const order = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// GET LOGGED-IN USER'S ORDERS
const getOrders = async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET ORDERS CONTROLLER HIT");
    console.log("LOGGED IN USER:", req.user);
    console.log("LOGGED IN USER ID:", req.user?._id);
    console.log("=================================");

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication data not found",
      });
    }

    const userId = req.user._id;

    const orders = await orderService.getOrdersByUser(userId);

    console.log("ORDERS FOUND:", orders.length);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

// GET ALL CUSTOMERS' ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get all orders",
      error: error.message,
    });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.orderStatus
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// GET BEST SELLING PRODUCTS
const getBestSellingProducts = async (req, res) => {
  try {
    const products = await orderService.getBestSellingProducts();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get best selling products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get best selling products",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  getBestSellingProducts,
  updateOrderStatus,
  getOrderById,
};