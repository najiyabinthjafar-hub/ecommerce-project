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

// ================= CREATE CONTACT =================
// Customer can submit contact message
router.post("/", createContact);

// ================= GET ALL CONTACTS =================
// Admin only
router.get("/", protect, adminOnly, getAllContacts);

// ================= DELETE CONTACT =================
// Admin only
router.delete("/:id", protect, adminOnly, deleteContact);

module.exports = router;