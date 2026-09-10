const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// Get user's wishlist
router.get("/", getWishlist);

// Add product to wishlist
router.post("/add", addToWishlist);

// Remove product from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Clear entire wishlist
router.delete("/clear", clearWishlist);

module.exports = router;