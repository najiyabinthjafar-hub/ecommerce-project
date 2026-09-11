const Cart = require("../models/Cart");
const Coupon = require("../models/coupon");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");

const processCheckout = async ({
  userId,
  shippingAddress,
  paymentMethod,
  couponCode,
}) => {
  // 1. Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2. Calculate cart total
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error("Product not found");
    }

    // Check stock
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    // Use sale price if available, otherwise regular price
    const price =
      product.salePrice !== null && product.salePrice !== undefined
        ? product.salePrice
        : product.regularPrice;

    totalAmount += price * item.quantity;
  }

  // 3. Apply coupon
  let discountAmount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      throw new Error("Invalid coupon");
    }

    // Check expiry
    if (new Date() > coupon.expiryDate) {
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

      if (
        coupon.maximumDiscount !== null &&
        discountAmount > coupon.maximumDiscount
      ) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;

      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }
    }

    // Increase coupon usage count
    coupon.usedCount += 1;
    await coupon.save();
  }

  // 4. Calculate final amount
  const finalAmount = totalAmount - discountAmount;

  // 5. Prepare order items
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

  // 6. Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    totalAmount,
    discountAmount,
    finalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
    orderStatus: "PENDING",
  });

  // 7. Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    paymentMethod,
    amount: finalAmount,
    paymentStatus: "PENDING",
  });

  // 8. Update product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // 9. Clear cart
  cart.items = [];
  await cart.save();

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