const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon"
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },

  type: {
    type: String,
    enum: [
      "booking_created",
      "booking_confirmed",
      "booking_cancelled",
      "booking_completed",
      "booking_reminder",
      "new_review",
      "system",
      "admin_alert"
    ],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  metadata: {
    type: Object
  },

  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    }
  },

  status: {
    type: String,
    enum: [
      "pending",
      "sent",
      "failed"
    ],
    default: "pending"
  },

  isRead: {
    type: Boolean,
    default: false
  },

  readAt: {
    type: Date
  },

  scheduledFor: {
    type: Date
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
});


/* =============================== */
/* DATABASE INDEXES */
/* =============================== */

notificationSchema.index({ userId: 1, createdAt: -1 });

notificationSchema.index({ ownerId: 1, createdAt: -1 });

notificationSchema.index({ salonId: 1 });

notificationSchema.index({ type: 1 });

notificationSchema.index({ status: 1 });

notificationSchema.index({ isRead: 1 });

notificationSchema.index({ isDeleted: 1 });


/* =============================== */
/* METHODS */
/* =============================== */

notificationSchema.methods.markAsRead = function () {

  this.isRead = true;
  this.readAt = new Date();

  return this.save();

};


/* =============================== */
/* STATIC METHODS */
/* =============================== */

notificationSchema.statics.findUserNotifications = function (userId) {

  return this.find({
    userId,
    isDeleted: false
  }).sort({ createdAt: -1 });

};


notificationSchema.statics.findOwnerNotifications = function (ownerId) {

  return this.find({
    ownerId,
    isDeleted: false
  }).sort({ createdAt: -1 });

};


const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;