const express = require("express");
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

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
router.get("/", protect, orderController.getOrders);

// ALL ORDERS
router.get("/all", protect, orderController.getAllOrders);

// SINGLE ORDER
router.get("/:id", protect, orderController.getOrderById);

// UPDATE ORDER STATUS
router.put("/:id/status", protect, orderController.updateOrderStatus);

// CUSTOMER REQUEST RETURN
router.post("/:id/return", protect, orderController.requestReturn);

// ADMIN APPROVE / REJECT RETURN
router.put("/:id/return-status", protect, orderController.updateReturnStatus);

module.exports = router;
