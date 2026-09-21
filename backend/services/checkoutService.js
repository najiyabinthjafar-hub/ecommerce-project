const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/coupon");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

const processCheckout = async ({
  userId,
  shippingAddress,
  paymentMethod,
  couponCode,
}) => {
  // 1. Validate payment method
  if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
    throw new Error("Invalid payment method");
  }

  // 2. Get user's cart
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 3. Calculate cart total and validate products/stock
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status !== "active") {
      throw new Error(`${product.name} is not available`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
      );
    }

    const price =
      product.salePrice !== null && product.salePrice !== undefined
        ? product.salePrice
        : product.regularPrice;

    totalAmount += price * item.quantity;
  }

  // 4. Validate coupon and calculate discount
  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      throw new Error("Invalid coupon");
    }

    // Check coupon expiry
    if (new Date() > new Date(coupon.expiry)) {
      throw new Error("Coupon has expired");
    }

    // Check minimum purchase
    if (totalAmount < coupon.minimumPurchase) {
      throw new Error(
        `Minimum purchase amount is ${coupon.minimumPurchase}`
      );
    }

    // Check usage limit
    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      throw new Error("Coupon usage limit reached");
    }

    // Calculate discount
    if (coupon.discountType === "percentage") {
      discountAmount = (totalAmount * coupon.discountValue) / 100;

      // Maximum discount limit
      if (
        coupon.maximumDiscount !== null &&
        coupon.maximumDiscount !== undefined &&
        discountAmount > coupon.maximumDiscount
      ) {
        discountAmount = coupon.maximumDiscount;
      }
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;

      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }
    }

    appliedCoupon = coupon;
  }

  // 5. Calculate final amount
  const finalAmount = totalAmount - discountAmount;

  // 6. Prepare order items
  const orderItems = cart.items.map((item) => {
    const product = item.product;

    const price =
      product.salePrice !== null && product.salePrice !== undefined
        ? product.salePrice
        : product.regularPrice;

    return {
      product: product._id,
      quantity: item.quantity,
      price,
    };
  });

  // 7. Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    totalAmount,
    discountAmount,
    finalAmount,
    paymentMethod,
    paymentStatus: "PENDING",
    orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
  });

  // 8. Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    paymentMethod,
    amount: finalAmount,
    paymentStatus: "PENDING",
  });

  // 9. Process COD checkout
  if (paymentMethod === "COD") {
    payment.paymentStatus = "PENDING";
    await payment.save();

    // Increase coupon usage after successful order
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();
  }

  // 10. Return checkout result
  return {
    order,
    payment,
    totalAmount,
    discountAmount,
    finalAmount,
  };
};

module.exports = {
  processCheckout,
};