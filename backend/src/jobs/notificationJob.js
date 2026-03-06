/**
 * Notification Job
 * Handles scheduled notification tasks
 */

const cron = require("node-cron");

const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const Salon = require("../models/Salon");

const { NOTIFICATION_TYPES } = require("../constants/notificationTypes");
const { BOOKING_STATUS } = require("../constants/bookingStatus");


/**
 * Send appointment reminder notifications
 */
const sendBookingReminders = async () => {

  try {

    const now = new Date();

    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const bookings = await Booking.find({
      status: BOOKING_STATUS.CONFIRMED,
      date: {
        $gte: now,
        $lte: oneHourLater
      }
    });

    for (const booking of bookings) {

      const existingNotification = await Notification.findOne({
        userId: booking.userId,
        type: NOTIFICATION_TYPES.BOOKING_REMINDER,
        bookingId: booking._id
      });

      if (existingNotification) continue;

      await Notification.create({
        userId: booking.userId,
        type: NOTIFICATION_TYPES.BOOKING_REMINDER,
        message: "Your appointment is scheduled in 1 hour",
        bookingId: booking._id
      });

    }

    console.log("Booking reminder notifications sent");

  } catch (error) {

    console.error("Notification reminder job error:", error);

  }

};


/**
 * Notify salon owner of new bookings
 */
const notifyOwnersOfBookings = async () => {

  try {

    const recentBookings = await Booking.find({
      status: BOOKING_STATUS.PENDING
    }).populate("salonId");

    for (const booking of recentBookings) {

      const salon = await Salon.findById(booking.salonId);

      if (!salon) continue;

      await Notification.create({
        userId: salon.ownerId,
        type: NOTIFICATION_TYPES.BOOKING_CREATED,
        message: "You have a new booking request",
        bookingId: booking._id
      });

    }

    console.log("Owner booking notifications sent");

  } catch (error) {

    console.error("Owner notification job error:", error);

  }

};


/**
 * Cleanup old notifications
 */
const cleanupOldNotifications = async () => {

  try {

    const expirationDate = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    await Notification.deleteMany({
      createdAt: { $lt: expirationDate }
    });

    console.log("Old notifications cleaned");

  } catch (error) {

    console.error("Notification cleanup error:", error);

  }

};


/**
 * Start notification jobs
 */
const startNotificationJob = () => {

  /**
   * Booking reminders every 10 minutes
   */
  cron.schedule("*/10 * * * *", async () => {

    console.log("Running booking reminder job");

    await sendBookingReminders();

  });


  /**
   * Owner booking alerts every 5 minutes
   */
  cron.schedule("*/5 * * * *", async () => {

    console.log("Running owner booking notification job");

    await notifyOwnersOfBookings();

  });


  /**
   * Notification cleanup daily at 3 AM
   */
  cron.schedule("0 3 * * *", async () => {

    console.log("Running notification cleanup job");

    await cleanupOldNotifications();

  });

};


module.exports = startNotificationJob;