const Banner = require("../models/Banner");

// CREATE BANNER
const createBanner = async (bannerData) => {
  return await Banner.create(bannerData);
};

// GET ALL BANNERS
const getAllBanners = async () => {
  return await Banner.find();
};

// GET BANNER BY ID
const getBannerById = async (id) => {
  return await Banner.findById(id);
};


// UPDATE BANNER
const updateBanner = async (id, bannerData) => {
  return await Banner.findByIdAndUpdate(
    id,
    bannerData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

// DELETE BANNER
const deleteBanner = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

// GET ACTIVE BANNERS
const getActiveBanners = async () => {
  const today = new Date();

  return await Banner.find({
    status: "active",
    $and: [
      {
        $or: [
          { startDate: { $exists: false } },
          { startDate: { $lte: today } },
        ],
      },
      {
        $or: [
          { endDate: { $exists: false } },
          { endDate: { $gte: today } },
        ],
      },
    ],
  });
};

module.exports = {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};