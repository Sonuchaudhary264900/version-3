/**
 * User Controller
 * Handles customer operations
 */

const User = require("../models/User");
const Salon = require("../models/Salon");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const asyncHandler = require("../helpers/asyncHandler");
const ERROR_MESSAGES = require("../constants/errorMessages");


/* =================================
   GET USER PROFILE
================================= */

exports.getProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.USER.USER_NOT_FOUND
    });
  }

  res.json({
    success: true,
    user
  });

});


/* =================================
   UPDATE PROFILE
================================= */

exports.updateProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.USER.USER_NOT_FOUND
    });
  }

  Object.assign(user, req.body);

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user
  });

});


/* =================================
   ADD FAVORITE SALON
================================= */

exports.addFavoriteSalon = asyncHandler(async (req, res) => {

  const userId = req.user.id;
  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  const user = await User.findById(userId);

  if (!user.favoriteSalons.includes(salonId)) {

    user.favoriteSalons.push(salonId);

    await user.save();

  }

  res.json({
    success: true,
    message: "Salon added to favorites"
  });

});


/* =================================
   REMOVE FAVORITE SALON
================================= */

exports.removeFavoriteSalon = asyncHandler(async (req, res) => {

  const userId = req.user.id;
  const { salonId } = req.params;

  const user = await User.findById(userId);

  user.favoriteSalons = user.favoriteSalons.filter(
    id => id.toString() !== salonId
  );

  await user.save();

  res.json({
    success: true,
    message: "Salon removed from favorites"
  });

});


/* =================================
   GET FAVORITE SALONS
================================= */

exports.getFavoriteSalons = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id)
    .populate("favoriteSalons");

  res.json({
    success: true,
    salons: user.favoriteSalons
  });

});


/* =================================
   USER BOOKING HISTORY
================================= */

exports.getBookingHistory = asyncHandler(async (req, res) => {

  const bookings = await Booking.find({
    userId: req.user.id
  })
    .populate("salonId", "name location")
    .populate("serviceId", "name price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    bookings
  });

});


/* =================================
   USER REVIEWS
================================= */

exports.getUserReviews = asyncHandler(async (req, res) => {

  const reviews = await Review.find({
    userId: req.user.id
  })
    .populate("salonId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    reviews
  });

});


/* =================================
   DELETE ACCOUNT (SOFT DELETE)
================================= */

exports.deleteAccount = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.USER.USER_NOT_FOUND
    });
  }

  user.isDeleted = true;

  await user.save();

  res.json({
    success: true,
    message: "Account deleted successfully"
  });

});


/* =================================
   USER ACTIVITY OVERVIEW
================================= */

exports.getUserActivity = asyncHandler(async (req, res) => {

  const totalBookings = await Booking.countDocuments({
    userId: req.user.id
  });

  const totalReviews = await Review.countDocuments({
    userId: req.user.id
  });

  const favoriteCount = await User.findById(req.user.id)
    .then(user => user.favoriteSalons.length);

  res.json({
    success: true,
    activity: {
      totalBookings,
      totalReviews,
      favoriteSalons: favoriteCount
    }
  });

});