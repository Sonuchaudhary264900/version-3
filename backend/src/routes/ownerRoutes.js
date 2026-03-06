/**
 * Owner Routes
 * Handles salon owner dashboard APIs
 */

const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireOwner = require("../middleware/requireOwner");
const { searchLimiter } = require("../middleware/rateLimiter");

const {
  uploadMultiple,
  uploadCover
} = require("../middleware/uploadMiddleware");

const ownerController = require("../controllers/ownerController");


/**
 * Apply security middleware
 */
router.use(requireAuth);
router.use(requireOwner);
router.use(searchLimiter);



/**
 * --------------------------------
 * SALON MANAGEMENT
 * --------------------------------
 */


/**
 * Create new salon
 */
router.post(
  "/salon",
  ownerController.registerSalon
);


/**
 * Update salon details
 */
router.put(
  "/salon/:salonId",
  ownerController.updateSalon
);


/**
 * Upload salon cover image
 */
router.post(
  "/salon/:salonId/cover",
  uploadCover,
  ownerController.uploadSalonCover
);


/**
 * Upload salon gallery images
 */
router.post(
  "/salon/:salonId/photos",
  uploadMultiple,
  ownerController.uploadSalonPhotos
);


/**
 * Get owner salons
 */
router.get(
  "/salons",
  ownerController.getOwnerSalons
);


/**
 * Delete salon
 */
router.delete(
  "/salon/:salonId",
  ownerController.deleteSalon
);



/**
 * --------------------------------
 * SERVICE MANAGEMENT
 * --------------------------------
 */


/**
 * Add service
 */
router.post(
  "/services",
  ownerController.addService
);


/**
 * Update service
 */
router.put(
  "/services/:serviceId",
  ownerController.updateService
);


/**
 * Delete service
 */
router.delete(
  "/services/:serviceId",
  ownerController.deleteService
);


/**
 * Get salon services
 */
router.get(
  "/services/:salonId",
  ownerController.getSalonServices
);



/**
 * --------------------------------
 * BOOKING MANAGEMENT
 * --------------------------------
 */


/**
 * Get bookings for salon
 */
router.get(
  "/bookings/:salonId",
  ownerController.getOwnerBookings
);


/**
 * Confirm booking
 */
router.patch(
  "/bookings/:bookingId/confirm",
  ownerController.confirmBooking
);


/**
 * Complete booking
 */
router.patch(
  "/bookings/:bookingId/complete",
  ownerController.completeBooking
);


/**
 * Cancel booking
 */
router.patch(
  "/bookings/:bookingId/cancel",
  ownerController.cancelBooking
);



/**
 * --------------------------------
 * OWNER ANALYTICS
 * --------------------------------
 */


/**
 * Get salon analytics overview
 */
router.get(
  "/analytics/:salonId",
  ownerController.getSalonAnalytics
);


/**
 * Get revenue analytics
 */
router.get(
  "/analytics/:salonId/revenue",
  ownerController.getSalonRevenue
);


/**
 * Get booking analytics
 */
router.get(
  "/analytics/:salonId/bookings",
  ownerController.getSalonBookingAnalytics
);


module.exports = router;