const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;

// const express = require("express");
// const { getProfile, updateProfile } = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");
// const { admin } = require("../middleware/adminMiddleware");

// const router = express.Router();

// router.get("/profile", protect, getProfile);
// router.put("/profile", protect, updateProfile);

// // Temporary admin test route
// router.get("/admin-test", protect, admin, (req, res) => {
//   res.json({
//     message: "Admin access successful",
//     user: req.user.email,
//     role: req.user.role,
//   });
// });

// module.exports = router;

