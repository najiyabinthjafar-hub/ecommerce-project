const couponService = require("../services/couponService");

const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getCoupons();

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get coupons",
      error: error.message,
    });
  }
};

const getCouponByCode = async (req, res) => {
  try {
    const coupon = await couponService.getCouponByCode(req.params.code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get coupon",
      error: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponByCode,
};