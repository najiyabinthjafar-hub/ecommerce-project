const express = require("express");
const couponController = require("../controllers/couponController");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Coupon routes working - UPDATED"
  });
});

router.post("/create", couponController.createCoupon);

router.get("/all", couponController.getCoupons);

router.get("/code/:code", couponController.getCouponByCode);

module.exports = router;