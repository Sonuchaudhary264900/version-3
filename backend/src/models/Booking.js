const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  bookingDate: {
    type: Date,
    required: true
  },

  slotStart: {
    type: String,
    required: true
  },

  slotEnd: {
    type: String,
    required: true
  },

  /* Unique slot identifier */
  slotKey: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "expired"
    ],
    default: "pending"
  },

  price: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "paid",
      "failed",
      "refunded"
    ],
    default: "pending"
  },

  paymentMethod: {
    type: String,
    enum: [
      "cash",
      "online",
      "wallet"
    ],
    default: "cash"
  },

  notes: {
    type: String,
    maxlength: 500
  },

  cancellationReason: {
    type: String
  },

  cancelledBy: {
    type: String,
    enum: [
      "user",
      "owner",
      "admin"
    ]
  },

  reminderSent: {
    type: Boolean,
    default: false
  },

  checkInTime: {
    type: Date
  },

  completedAt: {
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


/* ================= DATABASE INDEXES ================= */

/* Prevent double booking */
bookingSchema.index(
  { slotKey: 1 },
  { unique: true }
);

/* Salon daily bookings */
bookingSchema.index(
  { salonId: 1, bookingDate: 1 }
);

/* Slot conflict detection */
bookingSchema.index(
  { salonId: 1, bookingDate: 1, slotStart: 1 }
);

/* User booking history */
bookingSchema.index(
  { userId: 1, bookingDate: -1 }
);

/* Status queries */
bookingSchema.index(
  { status: 1 }
);

/* Payment status queries */
bookingSchema.index(
  { paymentStatus: 1 }
);

/* Soft delete filtering */
bookingSchema.index(
  { isDeleted: 1 }
);


/* ================= METHODS ================= */

bookingSchema.methods.confirmBooking = function () {

  this.status = "confirmed";
  return this.save();

};


bookingSchema.methods.completeBooking = function () {

  this.status = "completed";
  this.completedAt = new Date();

  return this.save();

};


bookingSchema.methods.cancelBooking = function (reason, cancelledBy) {

  this.status = "cancelled";
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;

  return this.save();

};


/* ================= STATIC METHODS ================= */

bookingSchema.statics.findSalonBookings = function (salonId, date) {

  return this.find({
    salonId,
    bookingDate: date,
    status: { $in: ["pending", "confirmed"] }
  });

};


bookingSchema.statics.findUserBookings = function (userId) {

  return this.find({
    userId,
    isDeleted: false
  }).sort({ bookingDate: -1 });

};


const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;