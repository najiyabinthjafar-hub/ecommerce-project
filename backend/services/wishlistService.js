const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// =========================
// GET WISHLIST
// =========================
const getWishlist = async (userId) => {
  return await Wishlist.findOne({ user: userId }).populate("products");
};

// =========================
// ADD TO WISHLIST
// =========================
const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.status !== "active") {
    throw new Error("Product is not available");
  }

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });

    return await wishlist.populate("products");
  }

  const productExists = wishlist.products.some(
    (product) => product.toString() === productId.toString()
  );

  if (!productExists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return await wishlist.populate("products");
};

// =========================
// REMOVE FROM WISHLIST
// =========================
const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (product) => product.toString() !== productId.toString()
  );

  await wishlist.save();

  return await wishlist.populate("products");
};

// =========================
// CLEAR WISHLIST
// =========================
const clearWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();

  return wishlist;
};

// =========================
// EXPORT
// =========================
module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};