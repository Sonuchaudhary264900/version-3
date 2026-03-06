const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const { searchLimiter } = require("../middleware/rateLimiter");

const reviewController = require("../controllers/reviewController");


router.use(searchLimiter);


/* ================= USER REVIEW ROUTES ================= */

router.get(
  "/salon/:salonId",
  reviewController.getSalonReviews
);

router.get(
  "/user/my-reviews",
  requireAuth,
  reviewController.getUserReviews
);

router.post(
  "/",
  requireAuth,
  reviewController.createReview
);

router.patch(
  "/:reviewId/like",
  requireAuth,
  reviewController.likeReview
);

router.put(
  "/:reviewId",
  requireAuth,
  reviewController.updateReview
);

router.delete(
  "/:reviewId",
  requireAuth,
  reviewController.deleteReview
);


/* ================= ADMIN REVIEW MODERATION ================= */

router.get(
  "/admin/all",
  requireAuth,
  requireAdmin,
  reviewController.getAllReviews
);

router.patch(
  "/admin/:reviewId/hide",
  requireAuth,
  requireAdmin,
  reviewController.hideReview
);

router.patch(
  "/admin/:reviewId/unhide",
  requireAuth,
  requireAdmin,
  reviewController.unhideReview
);


module.exports = router;