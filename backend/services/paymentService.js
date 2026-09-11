const Payment = require("../models/Payment");

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

const updatePaymentStatus = async (paymentId, paymentStatus, transactionId) => {
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      paymentStatus,
      transactionId,
      ...(paymentStatus === "PAID" && { paidAt: new Date() }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return payment;
};

module.exports = {
  createPayment,
  getPaymentsByUser,
  getPaymentById,
  updatePaymentStatus,
};