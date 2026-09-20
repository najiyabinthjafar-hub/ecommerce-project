const express = require("express");

const orderController = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// TEST
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes working",
  });
});

// CREATE ORDER
router.post("/", protect, orderController.createOrder);

// BEST SELLING PRODUCTS
router.get(
  "/best-sellers",
  protect,
  orderController.getBestSellingProducts
);

// LOGGED-IN USER ORDERS
router.get(
  "/",
  protect,
  orderController.getOrders
);

// ALL ORDERS - ADMIN ONLY
router.get(
  "/all",
  protect,
  adminOnly,
  orderController.getAllOrders
);

// SINGLE ORDER
router.get(
  "/:id",
  protect,
  orderController.getOrderById
);

// UPDATE ORDER STATUS - ADMIN ONLY
router.put(
  "/:id/status",
  protect,
  adminOnly,
  orderController.updateOrderStatus
);

module.exports = router;