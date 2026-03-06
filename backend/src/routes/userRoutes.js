/**
 * User Routes
 * Handles user account and profile APIs
 */

const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { searchLimiter } = require("../middleware/rateLimiter");

const userController = require("../controllers/userController");


/* =================================
   SECURITY
================================= */

router.use(requireAuth);


/* =================================
   USER PROFILE
================================= */

/* Get user profile */
router.get(
  "/profile",
  userController.getProfile
);

/* Update user profile */
router.put(
  "/profile",
  userController.updateProfile
);


/* =================================
   FAVORITE SALONS
================================= */

/* Get favorite salons */
router.get(
  "/favorites",
  searchLimiter,
  userController.getFavoriteSalons
);

/* Add favorite salon */
router.post(
  "/favorites/:salonId",
  userController.addFavoriteSalon
);

/* Remove favorite salon */
router.delete(
  "/favorites/:salonId",
  userController.removeFavoriteSalon
);


/* =================================
   BOOKINGS
================================= */

/* Get all bookings */
router.get(
  "/bookings",
  searchLimiter,
  userController.getBookingHistory
);

/* Booking history */
router.get(
  "/bookings/history",
  searchLimiter,
  userController.getBookingHistory
);


/* =================================
   USER REVIEWS
================================= */

/* Get user reviews */
router.get(
  "/reviews",
  searchLimiter,
  userController.getUserReviews
);


/* =================================
   USER ACTIVITY
================================= */

/* Activity overview */
router.get(
  "/activity",
  userController.getUserActivity
);


/* =================================
   ACCOUNT SETTINGS
================================= */

/* Delete user account */
router.delete(
  "/account",
  userController.deleteAccount
);


module.exports = router;