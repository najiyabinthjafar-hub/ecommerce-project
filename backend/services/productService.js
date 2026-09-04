const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (productData) => {
  return await Product.create(productData);
};

// GET ALL PRODUCTS / SEARCH / FILTER
const getAllProducts = async ({
  search,
  category,
  minPrice,
  maxPrice,
  availability,
}) => {
  const query = {};

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.regularPrice = {};

    if (minPrice !== undefined) {
      query.regularPrice.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      query.regularPrice.$lte = Number(maxPrice);
    }
  }

  // Availability filter
  if (availability === "in-stock") {
    query.stock = { $gt: 0 };
  }

  if (availability === "out-of-stock") {
    query.stock = 0;
  }

  return await Product.find(query).populate("category");
};

// GET PRODUCT BY ID
const getProductById = async (id) => {
  return await Product.findById(id).populate("category");
};

// UPDATE PRODUCT
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(
    id,
    productData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category");
};

// DELETE PRODUCT
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// UPDATE PRODUCT STOCK
const updateProductStock = async (id, stock) => {
  return await Product.findByIdAndUpdate(
    id,
    { stock },
    {
      new: true,
      runValidators: true,
    }
  ).populate("category");
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
};