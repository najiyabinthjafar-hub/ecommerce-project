const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // <--- ADD THIS

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

// Get user's cart
router.get("/", protect, getCart);

// Add product to cart
router.post("/add", protect, addToCart);

// Update product quantity
router.put("/update/:productId", protect, updateCartItem);

// Remove product from cart
router.delete("/remove/:productId", protect, removeFromCart);

// Clear entire cart
router.delete("/clear", protect, clearCart);

module.exports = router;