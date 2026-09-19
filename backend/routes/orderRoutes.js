const express = require("express");

const orderController = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");



const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes working",
  });
});

router.post("/", protect, orderController.createOrder);

// Get best selling products
router.get("/best-sellers", orderController.getBestSellingProducts);

router.get("/", protect, orderController.getOrders);

// ALL ORDERS
router.get("/all", orderController.getAllOrders);

// SINGLE ORDER
router.get("/:id", protect, orderController.getOrderById);
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;