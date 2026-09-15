const checkoutService = require("../services/checkoutService");

// PROCESS CHECKOUT
const processCheckout = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      shippingAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    const result = await checkoutService.processCheckout({
      userId,
      shippingAddress,
      paymentMethod,
      couponCode,
    });

    res.status(200).json({
      success: true,
      message: "Checkout completed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Checkout Error:", error);

    res.status(400).json({
      success: false,
      message: "Checkout failed",
      error: error.message,
    });
  }
};

module.exports = {
  processCheckout,
};