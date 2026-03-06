/**
 * Review Validation
 * Validates review related requests
 */

const { body, param, query } = require("express-validator");


/**
 * Validate create review
 */
const validateCreateReview = [

  body("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID"),

  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage("Comment must be between 3 and 500 characters")
    .trim()

];



/**
 * Validate update review
 */
const validateUpdateReview = [

  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid review ID"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage("Comment must be between 3 and 500 characters")
    .trim()

];



/**
 * Validate delete review
 */
const validateDeleteReview = [

  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid review ID")

];



/**
 * Validate salon review fetch
 */
const validateSalonReviews = [

  param("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")

];



/**
 * Validate review like
 */
const validateReviewLike = [

  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid review ID")

];



/**
 * Validate admin moderation
 */
const validateReviewModeration = [

  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Invalid review ID"),

  body("action")
    .notEmpty()
    .withMessage("Moderation action is required")
    .isIn(["approve", "reject", "remove"])
    .withMessage("Invalid moderation action")

];



module.exports = {
  validateCreateReview,
  validateUpdateReview,
  validateDeleteReview,
  validateSalonReviews,
  validateReviewLike,
  validateReviewModeration
};