const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const notificationController = require("../controllers/notificationController");

// GET USER NOTIFICATIONS
router.get(
  "/",
  protect,
  notificationController.getNotifications
);

// MARK ONE AS READ
router.put(
  "/:id/read",
  protect,
  notificationController.markAsRead
);

// MARK ALL AS READ
router.put(
  "/read-all",
  protect,
  notificationController.markAllAsRead
);

// DELETE NOTIFICATION
router.delete(
  "/:id",
  protect,
  notificationController.deleteNotification
);

module.exports = router;