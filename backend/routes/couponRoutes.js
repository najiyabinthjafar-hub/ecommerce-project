const express = require("express");
const couponController = require("../controllers/couponController");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Coupon routes working",
  });
});

// Create coupon
router.post("/create", couponController.createCoupon);

// Get all coupons
router.get("/all", couponController.getCoupons);

// Get coupon by code
router.get("/code/:code", couponController.getCouponByCode);

// Update coupon
router.put("/:id", couponController.updateCoupon);

// Delete coupon
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;