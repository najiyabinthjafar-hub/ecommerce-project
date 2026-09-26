const Address = require("../models/Address");

// ================= GET ADDRESSES =================

const getAddresses = async (userId) => {
  return await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

// ================= ADD ADDRESS =================

const addAddress = async (userId, data) => {
  const existingAddresses =
    await Address.countDocuments({
      user: userId,
    });

  // First address automatically becomes default.
  // If user explicitly selects default,
  // it also becomes default.
  const shouldBeDefault =
    existingAddresses === 0 ||
    data.isDefault === true;

  // If this address should become default,
  // remove default status from existing addresses.
  if (shouldBeDefault) {
    await Address.updateMany(
      {
        user: userId,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  // Only use fields that belong to the Address model.
  const allowedFields = [
    "fullName",
    "phone",
    "addressLine1",
    "addressLine2",
    "landmark",
    "city",
    "state",
    "postalCode",
    "country",
    "addressType",
  ];

  const addressData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      addressData[field] = data[field];
    }
  });

  const address = await Address.create({
    ...addressData,
    user: userId,
    isDefault: shouldBeDefault,
  });

  return address;
};

// ================= UPDATE ADDRESS =================

const updateAddress = async (
  userId,
  addressId,
  data
) => {
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
        _id: {
          $ne: addressId,
        },
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    address.isDefault = true;
  }

  // Prevent accidentally removing the only default address.
  if (
    data.isDefault === false &&
    address.isDefault === true
  ) {
    const otherAddresses =
      await Address.countDocuments({
        user: userId,
        _id: {
          $ne: addressId,
        },
      });

    if (otherAddresses > 0) {
      // Current address will no longer be default.
      address.isDefault = false;

      // Find another address to become default.
      const newDefaultAddress =
        await Address.findOne({
          user: userId,
          _id: {
            $ne: addressId,
          },
        }).sort({
          createdAt: -1,
        });

      if (newDefaultAddress) {
        // Make sure all other addresses are false first.
        await Address.updateMany(
          {
            user: userId,
            _id: {
              $ne: newDefaultAddress._id,
            },
          },
          {
            $set: {
              isDefault: false,
            },
          }
        );

        newDefaultAddress.isDefault = true;

        await newDefaultAddress.save();
      }
    } else {
      // If this is the only address,
      // it MUST remain the default address.
      address.isDefault = true;
    }
  }

  // ================= UPDATE ONLY ALLOWED FIELDS =================

  const allowedFields = [
    "fullName",
    "phone",
    "addressLine1",
    "addressLine2",
    "landmark",
    "city",
    "state",
    "postalCode",
    "country",
    "addressType",
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

const deleteAddress = async (
  userId,
  addressId
) => {
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
  const remainingAddresses =
    await Address.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

  // If there are remaining addresses,
  // make the latest one default.
  if (remainingAddresses.length > 0) {
    const newDefaultAddress =
      remainingAddresses[0];

    // Make all remaining addresses non-default first.
    await Address.updateMany(
      {
        user: userId,
        _id: {
          $ne: newDefaultAddress._id,
        },
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    newDefaultAddress.isDefault = true;

    await newDefaultAddress.save();
  }

  return address;
};

// ================= SET DEFAULT ADDRESS =================

const setDefaultAddress = async (
  userId,
  addressId
) => {
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
      _id: {
        $ne: addressId,
      },
    },
    {
      $set: {
        isDefault: false,
      },
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