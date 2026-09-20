const express = require("express");

const {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ================= ADMIN PROFILE =================

// GET /api/admin/profile
router.get(
  "/profile",
  protect,
  adminOnly,
  getAdminProfile
);

// PUT /api/admin/profile
router.put(
  "/profile",
  protect,
  adminOnly,
  updateAdminProfile
);

// PUT /api/admin/change-password
router.put(
  "/change-password",
  protect,
  adminOnly,
  changeAdminPassword
);

module.exports = router;