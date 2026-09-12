const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateOtp = require("../utils/generateOtp");

const generateToken = require("../utils/generateToken");

const {
  sendOtpEmail,
  sendResetOtpEmail,
} = require("./emailService");

// ================= REGISTER USER =================

const registerUser = async ({
  name,
  email,
  phone,
  password,
}) => {
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new Error("Email already registered");
  }

  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    throw new Error("Phone number already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOtp();

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    otpAttempts: 0,
  });

  await sendOtpEmail(email, otp);

  return {
    userId: user._id,
    message: "Registration successful. OTP sent to your email.",
  };
};

// ================= VERIFY EMAIL OTP =================

const verifyEmailOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error("OTP not found");
  }

  if (new Date() > user.otpExpiresAt) {
    throw new Error("OTP expired");
  }

  if (user.otpAttempts >= 5) {
    throw new Error("Too many OTP attempts");
  }

  if (user.otp !== otp) {
    user.otpAttempts += 1;
    await user.save();

    throw new Error("Invalid OTP");
  }

  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;

  await user.save();

  return {
    message: "Email verified successfully",
  };
};

// ================= RESEND OTP =================

const resendOtp = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  const otp = generateOtp();

  user.otp = otp;

  user.otpExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  user.otpAttempts = 0;

  await user.save();

  await sendOtpEmail(email, otp);

  return {
    message: "New OTP sent successfully",
  };
};

// ================= LOGIN USER =================

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  if (user.status !== "active") {
    throw new Error("Your account is blocked");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
  };
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();

  user.resetOtp = otp;

  user.resetOtpExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  await sendResetOtpEmail(email, otp);

  return {
    message: "Password reset OTP sent to your email",
  };
};

// ================= RESET PASSWORD =================

const resetPassword = async ({
  email,
  otp,
  newPassword,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.resetOtp || !user.resetOtpExpiresAt) {
    throw new Error("Reset OTP not found");
  }

  if (new Date() > user.resetOtpExpiresAt) {
    throw new Error("Reset OTP expired");
  }

  if (user.resetOtp !== otp) {
    throw new Error("Invalid reset OTP");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  user.password = hashedPassword;

  user.resetOtp = null;
  user.resetOtpExpiresAt = null;

  await user.save();

  return {
    message: "Password reset successfully",
  };
};

module.exports = {
  registerUser,
  verifyEmailOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  resetPassword,
};