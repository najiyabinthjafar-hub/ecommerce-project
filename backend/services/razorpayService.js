const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (amount, receipt) => {
  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return razorpayOrder;
};

const verifyPaymentSignature = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
};

const createRefund = async (paymentId, amount) => {
  const refund = await razorpay.payments.refund(paymentId, {
    amount: Math.round(amount * 100),
    speed: "normal",
  });

  return refund;
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  createRefund,
};
