const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ================= GET PROFILE =================

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ================= UPDATE PROFILE =================

const updateProfile = async (userId, data) => {
  const allowedFields = [
    "name",
    "phone",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  if (user.name && user.phone) {
    user.profileCompleted = true;
    await user.save();
  }

  return user;
};

// ================= GET ALL USERS =================

const getAllUsers = async () => {
  const users = await User.find()
    .select(
      "-password -otp -otpExpiresAt -otpAttempts -resetOtp -resetOtpExpiresAt"
    )
    .sort({ createdAt: -1 });

  return users;
};

// ================= CHANGE PASSWORD =================

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!currentPassword || !newPassword) {
    throw new Error(
      "Current password and new password are required"
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "New password must be at least 6 characters"
    );
  }

  if (currentPassword === newPassword) {
    throw new Error(
      "New password must be different from current password"
    );
  }

  const passwordMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  return {
    message: "Password changed successfully",
  };
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  changePassword,
};