const paymentService = require("../services/paymentService");

const createPayment = async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      user: req.body.user,
    };

    const payment = await paymentService.createPayment(paymentData);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const userId = req.query.userId;

    const payments = await paymentService.getPaymentsByUser(userId);

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get payments",
      error: error.message,
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get payment",
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await paymentService.updatePaymentStatus(
      req.params.id,
      req.body.paymentStatus,
      req.body.transactionId
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
};