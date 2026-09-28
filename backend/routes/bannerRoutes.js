const express = require("express");

const router = express.Router();

const bannerController = require("../controllers/bannerController");
const upload = require("../middleware/uploadMiddleware");

// CREATE
router.post(
  "/",
  upload.single("image"),
  bannerController.createBanner
);

// GET ALL
router.get("/", bannerController.getBanners);

// GET SINGLE
router.get("/:id", bannerController.getBanner);

// UPDATE
router.put("/:id", bannerController.updateBanner);

// DELETE
router.delete("/:id", bannerController.deleteBanner);

router.post(
  "/:id/image",
  upload.single("image"),
  bannerController.uploadBannerImage
);



module.exports = router;