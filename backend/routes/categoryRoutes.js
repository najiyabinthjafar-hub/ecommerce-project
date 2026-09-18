const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/tree", categoryController.getCategoryTree);
router.get("/active", categoryController.getActiveCategories);
router.post("/", categoryController.createCategory);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id",categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
module.exports = router;