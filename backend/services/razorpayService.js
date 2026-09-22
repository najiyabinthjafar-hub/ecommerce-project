const Razorpay = require("razorpay");
const crypto = require("crypto");



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (amount, receipt) => {
  const options = {
    amount: Math.round(amount * 100), // ₹ → paise
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


module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
};