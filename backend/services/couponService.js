const Coupon = require("../models/coupon");

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

const getCoupons = async ({ search = "", status = "" } = {}) => {
  const query = {};

  const searchText = search.trim();

  if (searchText) {
    const escapedSearch = searchText.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    query.code = {
      $regex: escapedSearch,
      $options: "i",
    };
  }

  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "active") {
    query.isActive = true;
    query.expiry = { $gte: new Date() };
  } else if (normalizedStatus === "inactive") {
    query.isActive = false;
  } else if (normalizedStatus === "expired") {
    query.expiry = { $lt: new Date() };
  } else if (normalizedStatus) {
    throw new Error(
      "Invalid status. Use active, inactive, or expired."
    );
  }

  return await Coupon.find(query).sort({ createdAt: -1 });
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