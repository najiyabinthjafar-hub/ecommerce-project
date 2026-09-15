const Cart = require("../models/Cart");
const Product = require("../models/Product");

// =========================
// GET CART
// =========================
const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

// =========================
// ADD TO CART
// =========================
const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.status !== "active") {
    throw new Error("Product is not available");
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} items are available in stock`);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
        },
      ],
    });

    return await cart.populate("items.product");
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error(
        `Only ${product.stock} items are available in stock`
      );
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return await cart.populate("items.product");
};

// =========================
// UPDATE CART ITEM
// =========================
const updateCartItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.status !== "active") {
    throw new Error("Product is not available");
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} items are available in stock`);
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error("Product not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return await cart.populate("items.product");
};

// =========================
// REMOVE FROM CART
// =========================
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();

  return await cart.populate("items.product");
};

// =========================
// CLEAR CART
// =========================
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  return cart;
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