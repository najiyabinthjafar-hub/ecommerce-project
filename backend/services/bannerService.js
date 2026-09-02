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