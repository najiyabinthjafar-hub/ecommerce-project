const authService = require("../services/authService");

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message:
          "Name, email, phone and password are required",
      });
    }

    const result = await authService.registerUser({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= VERIFY OTP =================

const verifyOtp = async (req, res) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const result = await authService.verifyEmailOtp(
      email,
      otp
    );

    // Result now contains:
    // message
    // token
    // user

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= RESEND OTP =================

const resendOtp = async (req, res) => {
  try {
    const {
      email,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await authService.resendOtp(email);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await authService.loginUser({
      email,
      password,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (req, res) => {
  try {
    const {
      email,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await authService.forgotPassword(email);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message:
          "Email, OTP and new password are required",
      });
    }

    const result = await authService.resetPassword({
      email,
      otp,
      newPassword,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
};