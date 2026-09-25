const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Normal registration -> required
    // Google registration -> can be empty initially
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      default: null,
    },

    // Normal registration -> password exists
    // Google registration -> password can be empty initially
    password: {
      type: String,
      minlength: 6,
      default: null,
    },

    // Google account unique ID
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      // IMPORTANT:
      // No default: null here.
      // Normal users should not have googleId field.
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);