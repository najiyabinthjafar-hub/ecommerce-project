const bannerService = require("../services/bannerService");
const cloudinary = require("../config/cloudinary");

// CREATE BANNER
// CREATE BANNER
const createBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce/banners",
      },
      async (error, result) => {
        if (error) {
          return next(error);
        }

        const bannerData = {
          ...req.body,
          image: result.secure_url,
        };

        const banner = await bannerService.createBanner(bannerData);

        res.status(201).json({
          success: true,
          message: "Banner created successfully",
          banner,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

// GET ALL BANNERS
const getBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getAllBanners();

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE BANNER
const getBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE BANNER
const updateBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.updateBanner(
      req.params.id,
      req.body
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE BANNER
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.deleteBanner(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// UPLOAD BANNER IMAGE
const uploadBannerImage = async (req, res, next) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce/banners",
      },
      async (error, result) => {
        if (error) {
          return next(error);
        }

        banner.image = result.secure_url;

        await banner.save();

        res.status(200).json({
          success: true,
          message: "Banner image uploaded successfully",
          image: banner.image,
          banner,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBanner,
  getBanners,
  getBanner,
  updateBanner,
  uploadBannerImage,
  deleteBanner,
};