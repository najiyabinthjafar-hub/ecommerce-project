const Address = require("../models/Address");

// ================= GET ADDRESSES =================

const getAddresses = async (userId) => {
  return await Address.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

// ================= ADD ADDRESS =================

const addAddress = async (userId, data) => {
  const existingAddresses = await Address.countDocuments({
    user: userId,
  });

  // First address automatically becomes default.
  // If user explicitly selects default, it also becomes default.
  const shouldBeDefault =
    existingAddresses === 0 || data.isDefault === true;

  // If this address should become default,
  // remove default status from existing addresses.
  if (shouldBeDefault) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create({
    ...data,
    user: userId,
    isDefault: shouldBeDefault,
  });

  return address;
};

// ================= UPDATE ADDRESS =================

const updateAddress = async (userId, addressId, data) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // If user wants this address to become default,
  // remove default status from all other addresses.
  if (data.isDefault === true) {
    await Address.updateMany(
      {
        user: userId,
        _id: { $ne: addressId },
      },
      {
        $set: { isDefault: false },
      }
    );

    address.isDefault = true;
  }

  // Prevent accidentally removing the only default address.
  if (data.isDefault === false && address.isDefault === true) {
    const otherAddresses = await Address.countDocuments({
      user: userId,
      _id: { $ne: addressId },
    });

    if (otherAddresses > 0) {
      address.isDefault = false;

      const newDefaultAddress = await Address.findOne({
        user: userId,
        _id: { $ne: addressId },
      }).sort({
        createdAt: -1,
      });

      if (newDefaultAddress) {
        newDefaultAddress.isDefault = true;
        await newDefaultAddress.save();
      }
    }
  }

  // Update only the fields supplied by the user.
  const allowedFields = [
    "fullName",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
    "isDefault",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      address[field] = data[field];
    }
  });

  await address.save();

  return address;
};

// ================= DELETE ADDRESS =================

const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // If deleted address was NOT the default,
  // nothing else needs to be changed.
  if (!address.isDefault) {
    return address;
  }

  // Find remaining addresses.
  const remainingAddresses = await Address.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  // If there are remaining addresses,
  // make the latest one default.
  if (remainingAddresses.length > 0) {
    const newDefaultAddress = remainingAddresses[0];

    newDefaultAddress.isDefault = true;

    await newDefaultAddress.save();
  }

  return address;
};

// ================= SET DEFAULT ADDRESS =================

const setDefaultAddress = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // Remove default from all other addresses.
  await Address.updateMany(
    {
      user: userId,
      _id: { $ne: addressId },
    },
    {
      $set: { isDefault: false },
    }
  );

  // Set selected address as default.
  address.isDefault = true;

  await address.save();

  return address;
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};