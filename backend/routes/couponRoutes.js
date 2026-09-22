const express = require("express");
const couponController = require("../controllers/couponController");

const router = express.Router();

// Get coupons with optional search and status filters
// GET /api/coupons
// GET /api/coupons?search=SAVE
// GET /api/coupons?status=active
// GET /api/coupons?status=inactive
// GET /api/coupons?status=expired
router.get("/", couponController.getCoupons);

// Existing get-all endpoint preserved
router.get("/all", couponController.getCoupons);

// Optional test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Coupon routes working",
  });
});

// Create coupon
router.post("/create", couponController.createCoupon);

// Get coupon by code
router.get("/code/:code", couponController.getCouponByCode);

// Update coupon
router.put("/:id", couponController.updateCoupon);

// Delete coupon
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;