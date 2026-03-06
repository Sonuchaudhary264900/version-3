const Notification = require("../models/Notification");

const asyncHandler = require("../helpers/asyncHandler");
const ERROR_MESSAGES = require("../constants/errorMessages");

const { emitNotification } = require("../config/socket");


/* =====================================================
   CREATE NOTIFICATION (Internal System Use)
===================================================== */

exports.createNotification = asyncHandler(async (req, res) => {

  const { userId, type, message } = req.body;

  const notification = await Notification.create({
    userId,
    type,
    message
  });

  emitNotification(userId, notification);

  res.json({
    success: true,
    data: notification
  });

});


/* =====================================================
   GET USER NOTIFICATIONS
===================================================== */

exports.getUserNotifications = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    success: true,
    data: notifications
  });

});


/* =====================================================
   GET UNREAD NOTIFICATIONS
===================================================== */

exports.getUnreadNotifications = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  const notifications = await Notification.find({
    userId,
    isRead: false
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: notifications
  });

});


/* =====================================================
   MARK NOTIFICATION AS READ
===================================================== */

exports.markNotificationAsRead = asyncHandler(async (req, res) => {

  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM?.RESOURCE_NOT_FOUND || "Notification not found"
    });
  }

  notification.isRead = true;

  await notification.save();

  res.json({
    success: true,
    message: "Notification marked as read"
  });

});


/* =====================================================
   MARK ALL NOTIFICATIONS AS READ
===================================================== */

exports.markAllNotificationsAsRead = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  res.json({
    success: true,
    message: "All notifications marked as read"
  });

});


/* =====================================================
   DELETE NOTIFICATION
===================================================== */

exports.deleteNotification = asyncHandler(async (req, res) => {

  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SYSTEM?.RESOURCE_NOT_FOUND || "Notification not found"
    });
  }

  await notification.deleteOne();

  res.json({
    success: true,
    message: "Notification deleted successfully"
  });

});


/* =====================================================
   ADMIN: SEND NOTIFICATION TO ONE USER
===================================================== */

exports.sendNotificationToUser = asyncHandler(async (req, res) => {

  const { userId, message } = req.body;

  const notification = await Notification.create({
    userId,
    type: "admin",
    message
  });

  emitNotification(userId, notification);

  res.json({
    success: true,
    message: "Notification sent",
    data: notification
  });

});


/* =====================================================
   ADMIN: BROADCAST NOTIFICATION
===================================================== */

exports.broadcastNotification = asyncHandler(async (req, res) => {

  const { message } = req.body;

  const notification = await Notification.create({
    type: "broadcast",
    message
  });

  res.json({
    success: true,
    message: "Broadcast notification created",
    data: notification
  });

});