/**
 * Salon Routes
 * Handles salon discovery and salon profile APIs
 */

const express = require("express");
const router = express.Router();

/**
 * Middlewares
 */
const { searchLimiter } = require("../middleware/rateLimiter");
const requireAuth = require("../middleware/requireAuth");
const requireOwner = require("../middleware/requireOwner");
const { uploadMultiple } = require("../middleware/uploadMiddleware");

/**
 * Controllers
 */
const salonController = require("../controllers/salonController");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");


/**
 * ------------------------------------------------
 * FAVORITE SALONS
 * ------------------------------------------------
 */

/**
 * Add salon to favorites
 */
router.post(
  "/favorites/:salonId",
  requireAuth,
  userController.addFavoriteSalon
);

/**
 * Remove salon from favorites
 */
router.delete(
  "/favorites/:salonId",
  requireAuth,
  userController.removeFavoriteSalon
);

/**
 * Get user's favorite salons
 */
router.get(
  "/favorites",
  requireAuth,
  userController.getFavoriteSalons
);



/**
 * ------------------------------------------------
 * APPLY RATE LIMITING
 * ------------------------------------------------
 */

router.use(searchLimiter);



/**
 * ------------------------------------------------
 * SALON DISCOVERY
 * ------------------------------------------------
 */

/**
 * Search salons
 */
router.get(
  "/search",
  salonController.searchSalons
);

/**
 * Get nearby salons
 */
router.get(
  "/nearby",
  salonController.getNearbySalons
);



/**
 * ------------------------------------------------
 * SALON DETAILS
 * ------------------------------------------------
 */

/**
 * Get salon details
 */
router.get(
  "/:salonId",
  salonController.getSalon
);

/**
 * Get salon services
 */
router.get(
  "/:salonId/services",
  salonController.getSalonServices
);

/**
 * Get salon reviews
 */
router.get(
  "/:salonId/reviews",
  reviewController.getSalonReviews
);



/**
 * ------------------------------------------------
 * EXPORT ROUTER
 * ------------------------------------------------
 */

module.exports = router;