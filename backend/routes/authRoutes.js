const express = require("express");

const {
  register,
  verifyOtp,
  resendOtp,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Normal authentication
router.post("/register", register);

router.post(
  "/verify-otp",
  verifyOtp
);

router.post(
  "/resend-otp",
  resendOtp
);

router.post(
  "/login",
  login
);

// Google authentication
router.post(
  "/google",
  googleLogin
);

// Password recovery
router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;