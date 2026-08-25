const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

// Get user's cart
router.get("/", getCart);

// Add product to cart
router.post("/add", addToCart);

// Update product quantity
router.put("/update/:productId", updateCartItem);

// Remove product from cart
router.delete("/remove/:productId", removeFromCart);

// Clear entire cart
router.delete("/clear", clearCart);

module.exports = router;