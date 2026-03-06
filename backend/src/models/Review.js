const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    maxlength: 500
  },

  isApproved: {
    type: Boolean,
    default: true
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

/* Prevent duplicate review per booking */
reviewSchema.index(
  { bookingId: 1 },
  { unique: true }
);

/* Salon reviews lookup */
reviewSchema.index(
  { salonId: 1, rating: -1 }
);

/* User review history */
reviewSchema.index(
  { userId: 1 }
);

/* Rating sorting */
reviewSchema.index(
  { rating: -1 }
);

/* Analytics queries */
reviewSchema.index(
  { createdAt: -1 }
);

/* Soft delete filtering */
reviewSchema.index(
  { isDeleted: 1 }
);


/* ================= METHODS ================= */

reviewSchema.methods.updateRating = function (newRating) {

  this.rating = newRating;
  return this.save();

};


/* ================= STATIC METHODS ================= */

reviewSchema.statics.findSalonReviews = function (salonId) {

  return this.find({
    salonId,
    isDeleted: false,
    isApproved: true
  }).sort({ createdAt: -1 });

};


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;