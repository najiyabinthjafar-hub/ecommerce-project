const Coupon = require("../models/Coupon");

const createCoupon = async (couponData) => {
  const coupon = await Coupon.create(couponData);
  return coupon;
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return coupons;
};

const getCouponByCode = async (code) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  return coupon;
};

const updateCoupon = async (couponId, updateData) => {
  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return coupon;
};

const deleteCoupon = async (couponId) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);
  return coupon;
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
};