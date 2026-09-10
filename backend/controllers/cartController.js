const cartService = require("../services/cartService");

// =========================
// GET CART
// =========================
const getCart = async (req, res) => {
  try {
    console.log("GET CART CONTROLLER HIT");
    console.log("REQ.USER:", req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;

    const cart = await cartService.getCart(userId);

    res.status(200).json({
      success: true,
      cart: cart || {
        user: userId,
        items: [],
      },
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADD TO CART
// =========================
const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;

    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const finalQuantity = quantity || 1;

    if (finalQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await cartService.addToCart(
      userId,
      productId,
      finalQuantity
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE CART ITEM
// =========================
const updateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await cartService.updateCartItem(
      userId,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// REMOVE FROM CART
// =========================
const removeFromCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await cartService.removeFromCart(
      userId,
      productId
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// CLEAR CART
// =========================
const clearCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;

    const cart = await cartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// EXPORT
// =========================
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};