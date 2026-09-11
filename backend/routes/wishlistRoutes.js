const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.get("/", protect, (req, res, next) => {
  console.log("WISHLIST GET ROUTE HIT");
  next();
}, getWishlist);

router.post("/add", protect, (req, res, next) => {
  console.log("WISHLIST ADD ROUTE HIT");
  console.log("USER FROM ROUTE:", req.user);
  next();
}, addToWishlist);

router.delete("/remove/:productId", protect, removeFromWishlist);

router.delete("/clear", protect, clearWishlist);

module.exports = router;