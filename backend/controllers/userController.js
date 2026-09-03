const userService = require("../services/userService");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user._id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

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

module.exports = {
  getProfile,
  updateProfile,
};