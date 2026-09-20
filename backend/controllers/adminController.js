const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ================= GET ADMIN PROFILE =================

const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admin profile fetched successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch admin profile",
    });
  }
};

// ================= UPDATE ADMIN PROFILE =================

const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Only allow admin profile fields to be updated
    if (name !== undefined) {
      admin.name = name;
    }

    if (email !== undefined) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: admin._id },
      });

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      admin.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: admin._id },
      });

      if (existingPhone) {
        return res.status(400).json({
          message: "Phone number already registered",
        });
      }

      admin.phone = phone;
    }

    await admin.save();

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("UPDATE ADMIN PROFILE ERROR:", error);

    res.status(400).json({
      message: error.message || "Failed to update admin profile",
    });
  }
};

// ================= CHANGE ADMIN PASSWORD =================

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Check current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;

    await admin.save();

    res.status(200).json({
      message: "Admin password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE ADMIN PASSWORD ERROR:", error);

    res.status(400).json({
      message: error.message || "Failed to change password",
    });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
};