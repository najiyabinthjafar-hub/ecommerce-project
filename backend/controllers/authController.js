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

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email, phone and password are required",
      });
    }

    const result =
      await authService.registerUser({
        name,
        email,
        phone,
        password,
      });

    res.status(201).json(result);
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

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
        message:
          "Email and OTP are required",
      });
    }

    const result =
      await authService.verifyEmailOtp(
        email,
        otp
      );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error
    );

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

    const result =
      await authService.resendOtp(
        email
      );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "RESEND OTP ERROR:",
      error
    );

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
        message:
          "Email and password are required",
      });
    }

    const result =
      await authService.loginUser({
        email,
        password,
      });

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    res.status(401).json({
      message: error.message,
    });
  }
};

// ================= GOOGLE LOGIN =================

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message:
          "Google ID token is required",
      });
    }

    const result =
      await authService.googleLogin(
        idToken
      );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );

    res.status(401).json({
      message:
        error.message ||
        "Google login failed",
    });
  }
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    console.log(
      "Forgot password request received for:",
      email
    );

    const result =
      await authService.forgotPassword(
        email
      );

    console.log(
      "Forgot password successful"
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Email, OTP and new password are required",
      });
    }

    const result =
      await authService.resetPassword({
        email,
        otp,
        newPassword,
      });

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

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
  googleLogin,
  forgotPassword,
  resetPassword,
};