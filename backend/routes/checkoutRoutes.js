const express = require("express");
const checkoutController = require("../controllers/checkoutController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Checkout routes working",
  });
});

router.post("/", checkoutController.processCheckout);

module.exports = router;