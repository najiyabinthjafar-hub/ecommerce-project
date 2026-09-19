const Notification = require("../models/Notification");

// CREATE NOTIFICATION
const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

// GET USER NOTIFICATIONS
const getUserNotifications = async (userId) => {
  return await Notification.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

// MARK ONE AS READ
const markAsRead = async (id, userId) => {
  return await Notification.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// MARK ALL AS READ
const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );
};

// DELETE NOTIFICATION
const deleteNotification = async (id, userId) => {
  return await Notification.findOneAndDelete({
    _id: id,
    user: userId,
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};