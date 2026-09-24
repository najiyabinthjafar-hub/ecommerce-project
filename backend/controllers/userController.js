const userService = require("../services/userService");

// ================= GET PROFILE =================

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(
      req.user._id
    );

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(
      req.user._id,
      req.body
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= GET ALL USERS =================

const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      page,
      limit,
      sort,
      status,
    } = req.query;

    const result = await userService.getAllUsers({
      search,
      page,
      limit,
      sort,
      status,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= UPDATE USER STATUS =================

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const user =
      await userService.updateUserStatus(
        req.params.id,
        status
      );

    res.status(200).json({
      message: `User status updated to ${user.status}`,
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= CHANGE PASSWORD =================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const result =
      await userService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserStatus,
  changePassword,
};