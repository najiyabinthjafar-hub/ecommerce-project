const Notification = require("../models/Notification");
const User = require("../models/User");

// CREATE NOTIFICATION
const createNotification = async (
  notificationData,
  session = null
) => {
  if (session) {
    const notifications =
      await Notification.create(
        [notificationData],
        { session }
      );

    return notifications[0];
  }

  return await Notification.create(
    notificationData
  );
};

// GET USER NOTIFICATIONS
const getUserNotifications = async (
  userId
) => {
  return await Notification.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

// MARK ONE AS READ
const markAsRead = async (
  id,
  userId
) => {
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
const markAllAsRead = async (
  userId
) => {
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
const deleteNotification = async (
  id,
  userId
) => {
  return await Notification.findOneAndDelete({
    _id: id,
    user: userId,
  });
};

// GET ADMIN USER
const getAdminUser = async (
  session = null
) => {
  if (session) {
    return await User.findOne(
      { role: "admin" }
    ).session(session);
  }

  return await User.findOne({
    role: "admin",
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  getAdminUser,
  markAllAsRead,
  deleteNotification,
};