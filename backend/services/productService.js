const Product = require("../models/Product");

const getAllProducts = async () => {
  return await Product.find().populate("category");
};

module.exports = {
  getAllProducts,
};