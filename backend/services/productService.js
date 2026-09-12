const Product = require("../models/Product");

// ================= CREATE PRODUCT =================

const createProduct = async (productData) => {
  return await Product.create(productData);
};

// ================= GET ALL PRODUCTS / SEARCH / FILTER / SORT / PAGINATION =================

const getAllProducts = async ({
  search,
  category,
  minPrice,
  maxPrice,
  availability,
  sort,
  page,
  limit,
}) => {
  const query = {};

  // ================= SEARCH FILTER =================

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  // ================= CATEGORY FILTER =================

  if (category) {
    query.category = category;
  }

  // ================= PRICE FILTER =================

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.regularPrice = {};

    if (minPrice !== undefined) {
      query.regularPrice.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      query.regularPrice.$lte = Number(maxPrice);
    }
  }

  // ================= AVAILABILITY FILTER =================

  if (availability === "in-stock") {
    query.stock = { $gt: 0 };
  }

  if (availability === "out-of-stock") {
    query.stock = 0;
  }

  // ================= SORTING =================

  let sortOption = {};

  if (sort === "price-low") {
    sortOption.regularPrice = 1;
  }

  if (sort === "price-high") {
    sortOption.regularPrice = -1;
  }

  if (sort === "newest") {
    sortOption.createdAt = -1;
  }

  // ================= PAGINATION =================

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const skip = (pageNumber - 1) * limitNumber;

  const products = await Product.find(query)
    .populate({
      path: "category",
      populate: {
        path: "parent",
        select: "name slug",
      },
    })
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  const totalProducts = await Product.countDocuments(query);

  const totalPages = Math.ceil(totalProducts / limitNumber);

  return {
    products,
    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalProducts,
      totalPages,
    },
  };
};

// ================= GET ACTIVE PRODUCTS =================

const getActiveProducts = async () => {
  return await Product.find({
    status: "active",
  }).populate({
    path: "category",
    populate: {
      path: "parent",
      select: "name slug",
    },
  });
};

// ================= GET PRODUCT BY ID =================

const getProductById = async (id) => {
  return await Product.findById(id).populate({
    path: "category",
    populate: {
      path: "parent",
      select: "name slug",
    },
  });
};

// ================= UPDATE PRODUCT =================

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    returnDocument: "after",
    runValidators: true,
  }).populate({
    path: "category",
    populate: {
      path: "parent",
      select: "name slug",
    },
  });
};

// ================= DELETE PRODUCT =================

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// ================= UPDATE PRODUCT STOCK =================

const updateProductStock = async (id, stock) => {
  return await Product.findByIdAndUpdate(
    id,
    { stock },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).populate({
    path: "category",
    populate: {
      path: "parent",
      select: "name slug",
    },
  });
};

// ================= REDUCE PRODUCT STOCK =================

const reduceProductStock = async (id, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: id,
      stock: { $gte: quantity },
    },
    {
      $inc: { stock: -quantity },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getActiveProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
  reduceProductStock,
};