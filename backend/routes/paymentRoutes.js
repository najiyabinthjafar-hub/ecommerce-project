const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// Test payment route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes working",
  });
});

// Create payment
router.post("/", paymentController.createPayment);

// Get all payments of a user
router.get("/", paymentController.getPayments);

// Get payment by ID
router.get("/:id", paymentController.getPaymentById);

// Update payment status
router.put("/:id/status", paymentController.updatePaymentStatus);

module.exports = router;