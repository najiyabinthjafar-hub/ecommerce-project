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

// ================= CREATE CONTACT =================
// Customer can submit contact message
router.post("/", createContact);

// ================= GET ALL CONTACTS =================
// Admin only
router.get(
  "/",
  protect,
  adminOnly,
  getAllContacts
);

// ================= UPDATE CONTACT STATUS =================
// Admin only
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateContactStatus
);

// ================= DELETE CONTACT =================
// Admin only
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteContact
);

module.exports = router;