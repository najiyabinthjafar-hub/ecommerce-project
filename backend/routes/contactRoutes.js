const express = require("express");

const {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ================= CUSTOMER =================

// Submit contact form
router.post("/", createContact);

// ================= ADMIN =================

// Get all contact messages
router.get("/", protect, adminOnly, getAllContacts);

// Update contact status
router.put("/:id/status", protect, adminOnly, updateContactStatus);

// Delete contact message
router.delete("/:id", protect, adminOnly, deleteContact);

module.exports = router;