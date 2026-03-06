/**
 * Booking Routes
 * Handles all booking related APIs
 */

const express = require("express");
const router = express.Router();

/* Middleware */
const requireAuth = require("../middleware/requireAuth");
const requireOwner = require("../middleware/requireOwner");
const { bookingLimiter, searchLimiter } = require("../middleware/rateLimiter");

/* Controller */
const bookingController = require("../controllers/bookingController");


/* =====================================================
   USER BOOKING ROUTES
===================================================== */

/**
 * Create booking
 */
router.post(
  "/",
  requireAuth,
  bookingLimiter,
  bookingController.createBooking
);


/**
 * Get booking calendar (available slots)
 */
router.get(
  "/calendar/:salonId",
  searchLimiter,
  bookingController.getBookingCalendar
);


/**
 * Check slot availability
 */
router.get(
  "/check-slot",
  searchLimiter,
  bookingController.checkSlotAvailability
);


/**
 * Get logged in user's bookings
 */
router.get(
  "/my-bookings",
  requireAuth,
  bookingController.getUserBookings
);


/**
 * Cancel booking
 */
router.patch(
  "/:bookingId/cancel",
  requireAuth,
  bookingController.cancelBooking
);



/* =====================================================
   OWNER BOOKING MANAGEMENT
===================================================== */

/**
 * Get bookings for all salons owned by owner
 */
router.get(
  "/owner/bookings",
  requireAuth,
  requireOwner,
  bookingController.getOwnerBookings
);


/**
 * Get bookings for a specific salon
 */
router.get(
  "/owner/salon/:salonId",
  requireAuth,
  requireOwner,
  bookingController.getSalonBookings
);


/**
 * Confirm booking
 */
router.patch(
  "/owner/:bookingId/confirm",
  requireAuth,
  requireOwner,
  bookingController.confirmBooking
);


/**
 * Complete booking
 */
router.patch(
  "/owner/:bookingId/complete",
  requireAuth,
  requireOwner,
  bookingController.completeBooking
);


/* =====================================================
   EXPORT ROUTER
===================================================== */

module.exports = router;