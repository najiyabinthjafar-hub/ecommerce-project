// const express = require("express");

// const {
//   getProfile,
//   updateProfile,
//   getAllUsers,
//   changePassword,
// } = require("../controllers/userController");

// const {
//   protect,
//   adminOnly,
// } = require("../middleware/authMiddleware");

// const router = express.Router();

// // ================= USER PROFILE =================

// router.get(
//   "/profile",
//   protect,
//   getProfile
// );

// router.put(
//   "/profile",
//   protect,
//   updateProfile
// );

// // ================= CHANGE PASSWORD =================

// router.put(
//   "/change-password",
//   protect,
//   changePassword
// );

// // ================= ADMIN - ALL CUSTOMERS =================

// router.get(
//   "/",
//   protect,
//   adminOnly,
//   getAllUsers
// );

// module.exports = router;



const express = require("express");

const {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserStatus,
  changePassword,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ================= USER PROFILE =================

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

// ================= CHANGE PASSWORD =================

router.put(
  "/change-password",
  protect,
  changePassword
);

// ================= ADMIN - ALL CUSTOMERS =================

router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);

// ================= ADMIN - BLOCK / UNBLOCK CUSTOMER =================

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateUserStatus
);

module.exports = router;