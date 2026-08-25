const addressService = require("../services/addressService");

const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(
      req.user._id
    );

    res.status(200).json({
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const address = await addressService.addAddress(
      req.user._id,
      req.body
    );

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await addressService.updateAddress(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await addressService.deleteAddress(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const address = await addressService.setDefaultAddress(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};