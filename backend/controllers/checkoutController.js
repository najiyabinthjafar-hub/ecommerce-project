const checkoutService = require("../services/checkoutService");

const processCheckout = async (req, res) => {
  try {
    const {
      userId,
      shippingAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "shippingAddress is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod is required",
      });
    }

    const result = await checkoutService.processCheckout({
      userId,
      shippingAddress,
      paymentMethod,
      couponCode,
    });

    res.status(201).json({
      success: true,
      message: "Checkout completed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Checkout failed",
      error: error.message,
    });
  }
};

module.exports = {
  processCheckout,
};