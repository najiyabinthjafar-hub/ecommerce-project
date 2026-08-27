const Wishlist = require("../models/Wishlist");

const getWishlist = async (userId) => {
  return await Wishlist.findOne({ user: userId }).populate("products");
};

const addToWishlist = async (userId, productId) => {
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

const clearWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();

  return wishlist;
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};