const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const productController = require("../controllers/productController");

// CREATE
router.post("/", productController.createProduct);

// GET ALL
router.get("/", productController.getProducts);

router.put("/:id/stock", productController.updateProductStock);

router.get("/active", productController.getActiveProducts);

// GET SINGLE
router.get("/:id", productController.getProduct);

// UPDATE
router.put("/:id", productController.updateProduct);

// DELETE
router.delete("/:id", productController.deleteProduct);

router.post(
  "/:id/images",
  upload.array("images", 5),
  productController.uploadProductImages
);

module.exports = router;