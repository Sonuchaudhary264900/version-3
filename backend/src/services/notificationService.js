/**
 * Notification Service
 * Handles notification logic for users and salon owners
 */

const Notification = require("../models/Notification");
const User = require("../models/User");

const { NOTIFICATION_TYPES } = require("../constants/notificationTypes");


/**
 * Create notification
 */
const createNotification = async (data) => {

  const notification = new Notification({
    userId: data.userId,
    type: data.type,
    message: data.message,
    meta: data.meta || {}
  });

  await notification.save();

  return notification;

};



/**
 * Send booking confirmation notification
 */
const sendBookingConfirmation = async (userId, bookingId) => {

  return await createNotification({
    userId,
    type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    message: "Your booking has been confirmed",
    meta: { bookingId }
  });

};



/**
 * Send booking cancellation notification
 */
const sendBookingCancellation = async (userId, bookingId) => {

  return await createNotification({
    userId,
    type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
    message: "Your booking has been cancelled",
    meta: { bookingId }
  });

};



/**
 * Send booking reminder
 */
const sendBookingReminder = async (userId, bookingId) => {

  return await createNotification({
    userId,
    type: NOTIFICATION_TYPES.BOOKING_REMINDER,
    message: "Reminder: Your appointment is coming up",
    meta: { bookingId }
  });

};



/**
 * Send review reminder
 */
const sendReviewReminder = async (userId, bookingId) => {

  return await createNotification({
    userId,
    type: NOTIFICATION_TYPES.REVIEW_REMINDER,
    message: "Please leave a review for your recent booking",
    meta: { bookingId }
  });

};



/**
 * Send admin notification to user
 */
const sendAdminNotification = async (userId, message) => {

  return await createNotification({
    userId,
    type: NOTIFICATION_TYPES.ADMIN_MESSAGE,
    message
  });

};



/**
 * Broadcast notification to all users
 */
const broadcastNotification = async (message) => {

  const users = await User.find({}, "_id");

  const notifications = users.map(user => ({
    userId: user._id,
    type: NOTIFICATION_TYPES.SYSTEM,
    message
  }));

  await Notification.insertMany(notifications);

  return true;

};



/**
 * Get user notifications
 */
const getUserNotifications = async (userId, limit = 20) => {

  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

};



/**
 * Get unread notifications
 */
const getUnreadNotifications = async (userId) => {

  return await Notification.find({
    userId,
    isRead: false
  });

};



/**
 * Mark notification as read
 */
const markNotificationAsRead = async (notificationId) => {

  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );

};



/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (userId) => {

  return await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

};



/**
 * Delete notification
 */
const deleteNotification = async (notificationId) => {

  return await Notification.findByIdAndDelete(notificationId);

};



module.exports = {
  createNotification,
  sendBookingConfirmation,
  sendBookingCancellation,
  sendBookingReminder,
  sendReviewReminder,
  sendAdminNotification,
  broadcastNotification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};