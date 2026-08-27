const wishlistService = require("../services/wishlistService");

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistService.getWishlist(userId);

    res.status(200).json({
      success: true,
      wishlist: wishlist || {
        user: userId,
        products: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const wishlist = await wishlistService.addToWishlist(
      userId,
      productId
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await wishlistService.removeFromWishlist(
      userId,
      productId
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistService.clearWishlist(userId);

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};