const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireOwner = require("../middleware/requireOwner");
const requireAdmin = require("../middleware/requireAdmin");

const { searchLimiter } = require("../middleware/rateLimiter");

const analyticsController = require("../controllers/analyticsController");


router.use(searchLimiter);


/* ================= OWNER ANALYTICS ================= */

router.get(
  "/owner/overview/:salonId",
  requireAuth,
  requireOwner,
  analyticsController.getSalonOverview
);

router.get(
  "/owner/bookings/:salonId",
  requireAuth,
  requireOwner,
  analyticsController.getBookingAnalytics
);

router.get(
  "/owner/revenue/:salonId",
  requireAuth,
  requireOwner,
  analyticsController.getRevenueAnalytics
);

router.get(
  "/owner/services/:salonId",
  requireAuth,
  requireOwner,
  analyticsController.getServiceAnalytics
);

router.get(
  "/owner/trends/:salonId",
  requireAuth,
  requireOwner,
  analyticsController.getBookingTrends
);

router.get(
  "/owner/summary",
  requireAuth,
  requireOwner,
  analyticsController.ownerSummary
);

router.get(
  "/owner/revenue-summary",
  requireAuth,
  requireOwner,
  analyticsController.ownerRevenue
);

router.get(
  "/owner/top-services",
  requireAuth,
  requireOwner,
  analyticsController.topServices
);

router.get(
  "/owner/recent-bookings",
  requireAuth,
  requireOwner,
  analyticsController.recentBookings
);


/* ================= ADMIN ANALYTICS ================= */

router.get(
  "/admin/platform",
  requireAuth,
  requireAdmin,
  analyticsController.getPlatformAnalytics
);

router.get(
  "/admin/users",
  requireAuth,
  requireAdmin,
  analyticsController.getUserAnalytics
);

router.get(
  "/admin/salons",
  requireAuth,
  requireAdmin,
  analyticsController.getSalonAnalytics
);

router.get(
  "/admin/bookings",
  requireAuth,
  requireAdmin,
  analyticsController.getPlatformBookingAnalytics
);

router.get(
  "/admin/revenue",
  requireAuth,
  requireAdmin,
  analyticsController.getPlatformRevenueAnalytics
);

router.get(
  "/admin/top-salons",
  requireAuth,
  requireAdmin,
  analyticsController.getTopSalons
);

router.get(
  "/admin/top-services",
  requireAuth,
  requireAdmin,
  analyticsController.getTopServices
);


module.exports = router;