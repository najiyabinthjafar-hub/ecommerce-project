const Banner = require("../models/Banner");

// CREATE BANNER
const createBanner = async (bannerData) => {
  return await Banner.create(bannerData);
};

// GET ALL BANNERS
const getAllBanners = async ({ search, status } = {}) => {
  const query = {};

  // Search by banner title
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // Status filter
  if (status && status !== "all") {
    query.status = status;
  }

  return await Banner.find(query);
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
      new: true,
      runValidators: true,
    }
  );
};

// DELETE BANNER
const deleteBanner = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};