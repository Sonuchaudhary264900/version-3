const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");


/* ================= ADMIN DASHBOARD ================= */

router.get(
  "/dashboard",
  requireAuth,
  requireAdmin,
  adminController.getDashboardStats
);


/* ================= PLATFORM ANALYTICS ================= */

router.get(
  "/top-salons",
  requireAuth,
  requireAdmin,
  adminController.getTopSalons
);

router.get(
  "/recent-bookings",
  requireAuth,
  requireAdmin,
  adminController.getRecentBookings
);


/* ================= USER MANAGEMENT ================= */

router.get(
  "/users",
  requireAuth,
  requireAdmin,
  adminController.getAllUsers
);

router.patch(
  "/users/:userId/block",
  requireAuth,
  requireAdmin,
  adminController.blockUser
);

router.patch(
  "/users/:userId/unblock",
  requireAuth,
  requireAdmin,
  adminController.unblockUser
);


/* ================= SALON MANAGEMENT ================= */

router.get(
  "/salons",
  requireAuth,
  requireAdmin,
  adminController.getAllSalons
);

router.patch(
  "/salons/:salonId/approve",
  requireAuth,
  requireAdmin,
  adminController.approveSalon
);


/* ================= REVIEW MODERATION ================= */

router.delete(
  "/reviews/:reviewId",
  requireAuth,
  requireAdmin,
  adminController.deleteReview
);


module.exports = router;