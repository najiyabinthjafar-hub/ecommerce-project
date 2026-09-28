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
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100),
    });

    console.log("Razorpay refund created:", refund);

    return refund;
  } catch (error) {
    console.error(
      "Razorpay refund error:",
      JSON.stringify(error, null, 2)
    );

    const razorpayError = error.error || {};

    const message =
      razorpayError.description ||
      error.description ||
      error.message ||
      "Unknown Razorpay refund error";

    throw new Error(message);
  }
};

const getRefund = async (refundId) => {
  try {
    const refund = await razorpay.refunds.fetch(refundId);

    console.log("Razorpay refund status:", refund);

    return refund;
  } catch (error) {
    console.error(
      "Razorpay get refund error:",
      JSON.stringify(error, null, 2)
    );

    const razorpayError = error.error || {};

    const message =
      razorpayError.description ||
      error.description ||
      error.message ||
      "Unable to fetch refund";

    throw new Error(message);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  createRefund,
  getRefund ,
};