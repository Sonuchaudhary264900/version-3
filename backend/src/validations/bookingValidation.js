/**
 * Booking Validation
 * Validates booking related requests
 */

const { body, param, query } = require("express-validator");


/**
 * Validate booking creation
 */
const validateCreateBooking = [

  body("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID"),

  body("serviceId")
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Invalid service ID"),

  body("date")
    .notEmpty()
    .withMessage("Booking date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Invalid time format (HH:MM)")

];



/**
 * Validate booking ID
 */
const validateBookingId = [

  param("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID")

];



/**
 * Validate slot request
 */
const validateSlotRequest = [

  param("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID"),

  query("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format")

];



/**
 * Validate owner slot booking (walk-in)
 */
const validateWalkInBooking = [

  body("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID"),

  body("serviceId")
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Invalid service ID"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Invalid time format (HH:MM)")

];



/**
 * Validate booking status update
 */
const validateBookingStatus = [

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "pending",
      "confirmed",
      "completed",
      "cancelled"
    ])
    .withMessage("Invalid booking status")

];



/**
 * Validate booking history pagination
 */
const validateBookingHistory = [

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")

];



module.exports = {
  validateCreateBooking,
  validateBookingId,
  validateSlotRequest,
  validateWalkInBooking,
  validateBookingStatus,
  validateBookingHistory
};