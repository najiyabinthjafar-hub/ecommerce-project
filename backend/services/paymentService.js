const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createPayment = async (paymentData) => {
  const payment = await Payment.create(paymentData);
  return payment;
};

const getPaymentsByUser = async (userId) => {
  const payments = await Payment.find({ user: userId })
    .populate("order")
    .sort({ createdAt: -1 });

  return payments;
};

const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("order")
    .populate("user", "-password");

  return payment;
};

const updatePaymentStatus = async (
  paymentId,
  paymentStatus,
  transactionId
) => {
  console.log("UPDATE PAYMENT SERVICE CALLED");
  console.log("Payment ID:", paymentId);
  console.log("Payment Status:", paymentStatus);

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      paymentStatus,
      transactionId,
      ...(paymentStatus === "PAID" && {
        paidAt: new Date(),
      }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!payment) {
    console.log("Payment not found");
    return null;
  }

  console.log("Payment updated:", payment._id);

  // Update related Order payment status
  if (paymentStatus === "PAID") {
    const updatedOrder = await Order.findByIdAndUpdate(
      payment.order,
      {
        $set: {
          paymentStatus: "PAID",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("Payment Order ID:", payment.order);
    console.log("Updated Order:", updatedOrder);
  }

  return payment;
};

module.exports = {
  createPayment,
  getPaymentsByUser,
  getPaymentById,
  updatePaymentStatus,
};