const Product = require("../models/Product");
const notificationService = require("./notificationService");
const mongoose = require("mongoose");

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
  const categoryIds = category
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => new mongoose.Types.ObjectId(id));

  if (categoryIds.length === 1) {
    query.category = categoryIds[0];
  } else {
    query.category = { $in: categoryIds };
  }
}

  // ================= AVAILABILITY FILTER =================

 if (availability === "in-stock") {
  query.stock = { $gt: 10 };
}

if (availability === "low-stock") {
  query.stock = {
    $gt: 0,
    $lte: 10,
  };
}

if (availability === "out-of-stock") {
  query.stock = 0;
}
  // ================= PAGINATION =================

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const skip = (pageNumber - 1) * limitNumber;

  // ================= AGGREGATION =================

  const pipeline = [
    // Apply search/category/availability filters
    {
      $match: query,
    },

    // ================= EFFECTIVE PRICE =================
    // If salePrice exists and is greater than 0,
    // use salePrice.
    // Otherwise use regularPrice.

    {
      $addFields: {
        effectivePrice: {
          $cond: [
            {
              $and: [
                { $ne: ["$salePrice", null] },
                { $gt: ["$salePrice", 0] },
              ],
            },
            "$salePrice",
            "$regularPrice",
          ],
        },
      },
    },
  ];

  // ================= PRICE FILTER =================

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter = {};

    if (minPrice !== undefined) {
      priceFilter.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      priceFilter.$lte = Number(maxPrice);
    }

    pipeline.push({
      $match: {
        effectivePrice: priceFilter,
      },
    });
  }

  // ================= SORTING =================

  if (sort === "price-low") {
    pipeline.push({
      $sort: {
        effectivePrice: 1,
      },
    });
  }

  if (sort === "price-high") {
    pipeline.push({
      $sort: {
        effectivePrice: -1,
      },
    });
  }

  if (sort === "newest") {
    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });
  }

  if (sort === "featured") {
  pipeline.push({
    $sort: {
      isBestSeller: -1,
      createdAt: -1,
    },
  });
}

  // ================= PAGINATION =================

  pipeline.push(
    {
      $facet: {
        products: [
          { $skip: skip },
          { $limit: limitNumber },
        ],

        total: [
          { $count: "count" },
        ],
      },
    }
  );

  const result = await Product.aggregate(pipeline);

  const products = result[0]?.products || [];

  const totalProducts =
    result[0]?.total?.[0]?.count || 0;

  const totalPages = Math.ceil(
    totalProducts / limitNumber
  );

  // ================= POPULATE CATEGORY =================

  const populatedProducts = await Product.populate(products, {
    path: "category",
    populate: {
      path: "parent",
      select: "name slug",
    },
  });

  return {
    products: populatedProducts,

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

// ================= GET BEST SELLER PRODUCTS =================

const getBestSellerProducts = async () => {
  return await Product.find({
    isBestSeller: true,
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
  return await Product.findByIdAndUpdate(
    id,
    productData,
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

// ================= DELETE PRODUCT =================

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// ================= UPDATE PRODUCT STOCK =================

const updateProductStock = async (id, stock) => {
  const product = await Product.findByIdAndUpdate(
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

  // ================= STOCK NOTIFICATIONS =================

  if (product) {
    const admin = await notificationService.getAdminUser();

    if (admin) {
      // OUT OF STOCK

      if (product.stock === 0) {
        await notificationService.createNotification({
          user: admin._id,
          title: "Product Out of Stock",
          message: `${product.name} is out of stock.`,
          type: "PRODUCT",
        });
      }

      // LOW STOCK

      else if (product.stock <= 5) {
        await notificationService.createNotification({
          user: admin._id,
          title: "Low Stock Alert",
          message: `${product.name} has only ${product.stock} items left.`,
          type: "PRODUCT",
        });
      }
    }
  }

  return product;
};

// ================= GET BEST SELLERS WITH FILTER / SORT / PAGINATION =================

const getBestSellers = async ({
  search,
  category,
  minPrice,
  maxPrice,
  availability,
  sort,
  page,
  limit,
}) => {
  const query = {
    isBestSeller: true,
    status: "active",
  };

  // ================= SEARCH =================

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  // ================= CATEGORY =================

  if (category) {
    const categoryIds = category
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => new mongoose.Types.ObjectId(id));

    if (categoryIds.length === 1) {
      query.category = categoryIds[0];
    } else {
      query.category = { $in: categoryIds };
    }
  }

  // ================= AVAILABILITY =================

  if (availability === "in-stock") {
    query.stock = { $gt: 0 };
  }

  if (availability === "out-of-stock") {
    query.stock = 0;
  }

  // ================= PAGINATION =================

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);

  const skip = (pageNumber - 1) * limitNumber;

  // ================= AGGREGATION =================

  const pipeline = [
    {
      $match: query,
    },

    // Effective price:
    // salePrice if available, otherwise regularPrice
    {
      $addFields: {
        effectivePrice: {
          $cond: [
            {
              $and: [
                { $ne: ["$salePrice", null] },
                { $gt: ["$salePrice", 0] },
              ],
            },
            "$salePrice",
            "$regularPrice",
          ],
        },
      },
    },
  ];

  // ================= PRICE FILTER =================

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter = {};

    if (minPrice !== undefined) {
      priceFilter.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      priceFilter.$lte = Number(maxPrice);
    }

    pipeline.push({
      $match: {
        effectivePrice: priceFilter,
      },
    });
  }

  // ================= SORT =================

  if (sort === "price-low") {
    pipeline.push({
      $sort: {
        effectivePrice: 1,
      },
    });
  } else if (sort === "price-high") {
    pipeline.push({
      $sort: {
        effectivePrice: -1,
      },
    });
  } else if (sort === "featured") {
    pipeline.push({
      $sort: {
        isBestSeller: -1,
        createdAt: -1,
      },
    });
  } else {
    // newest is the default
    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });
  }

  // ================= PAGINATION =================

  pipeline.push({
    $facet: {
      products: [
        { $skip: skip },
        { $limit: limitNumber },
      ],
      total: [
        { $count: "count" },
      ],
    },
  });

  const result = await Product.aggregate(pipeline);

  const products = result[0]?.products || [];

  const totalProducts =
    result[0]?.total?.[0]?.count || 0;

  const totalPages = Math.ceil(
    totalProducts / limitNumber
  );

  // ================= POPULATE CATEGORY =================

  const populatedProducts = await Product.populate(products, {
    path: "category",
    populate: {
      path: "parent",
      select: "name slug",
    },
  });

  return {
    products: populatedProducts,

    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalProducts,
      totalPages,
    },
  };
};

// ================= REDUCE PRODUCT STOCK =================

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
      $inc: {
        stock: -quantity,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  // ================= STOCK NOTIFICATIONS =================

  if (product) {
    const admin = await notificationService.getAdminUser();

    if (admin) {

      // OUT OF STOCK
      if (product.stock === 0) {
        await notificationService.createNotification({
          user: admin._id,
          title: "Product Out of Stock",
          message: `${product.name} is out of stock.`,
          type: "PRODUCT",
        });
      }

      // LOW STOCK
      else if (product.stock <= 5) {
        await notificationService.createNotification({
          user: admin._id,
          title: "Low Stock Alert",
          message: `${product.name} has only ${product.stock} items left.`,
          type: "PRODUCT",
        });
      }
    }
  }

  return product;
};

// ================= EXPORTS =================

module.exports = {
  createProduct,
  getAllProducts,
  getActiveProducts,
  getBestSellerProducts,
  getProductById,
  getBestSellers,
  updateProduct,
  deleteProduct,
  updateProductStock,
  reduceProductStock,
};