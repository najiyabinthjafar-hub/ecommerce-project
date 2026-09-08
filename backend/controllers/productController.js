const productService = require("../services/productService");
const cloudinary = require("../config/cloudinary");

// CREATE PRODUCT
const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PRODUCTS / SEARCH / FILTER PRODUCTS
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      availability,
        sort,
         page,
        limit,
    } = req.query;

    const result = await productService.getAllProducts({
      search,
      category,
      minPrice,
      maxPrice,
      availability,
      sort,
       page,
       limit,
    });

res.status(200).json({
  success: true,
  products: result.products,
  pagination: result.pagination,
});
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT
const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// UPLOAD PRODUCT IMAGES
const uploadProductImages = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ecommerce/products",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        stream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    product.images.push(...imageUrls);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product images uploaded successfully",
      images: product.images,
      product,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    console.log("UPLOAD ERROR MESSAGE:", error.message);
    console.log("UPLOAD ERROR RESPONSE:", error.response);

    next(error);
  }
};

// UPDATE PRODUCT STOCK
const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Stock is required",
      });
    }

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative number",
      });
    }

    const product = await productService.updateProductStock(
      req.params.id,
      stock
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      stock: product.stock,
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  updateProductStock,
};