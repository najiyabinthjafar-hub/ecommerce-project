const Coupon = require("../models/Coupon");

const createCoupon = async (couponData) => {
  const existingCoupon = await Coupon.findOne({
    code: couponData.code.toUpperCase(),
  });

  if (existingCoupon) {
    throw new Error("Coupon already exists");
  }

  const coupon = await Coupon.create({
    ...couponData,
    code: couponData.code.toUpperCase(),
  });

  return coupon;
};

const getCoupons = async () => {
  return await Coupon.find().sort({ createdAt: -1 });
};

const getCouponByCode = async (code) => {
  return await Coupon.findOne({
    code: code.toUpperCase(),
  });
};

// Update coupon
const updateCoupon = async (id, couponData) => {
  if (couponData.code) {
    couponData.code = couponData.code.toUpperCase();
  }

  return await Coupon.findByIdAndUpdate(
    id,
    couponData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete coupon
const deleteCoupon = async (id) => {
  return await Coupon.findByIdAndDelete(id);
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
};