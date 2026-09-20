const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const checkoutController = require("../controllers/checkoutController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Checkout routes working",
  });
});

router.post("/", protect, checkoutController.processCheckout);

module.exports = router;