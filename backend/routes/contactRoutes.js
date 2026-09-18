const express = require("express");

const {
  createContact,
  getAllContacts,
  deleteContact,
} = require("../controllers/contactController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer
router.post("/", createContact);

// Admin
router.get("/", protect, adminOnly, getAllContacts);
router.delete("/:id", protect, adminOnly, deleteContact);

module.exports = router;