/**
 * Salon Validation
 * Validates salon related requests
 */

const { body, param, query } = require("express-validator");


/**
 * Validate salon creation
 */
const validateCreateSalon = [

  body("name")
    .notEmpty()
    .withMessage("Salon name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Salon name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("address")
    .notEmpty()
    .withMessage("Salon address is required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number format"),

  body("location.lat")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude value"),

  body("location.lng")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude value")

];



/**
 * Validate salon update
 */
const validateUpdateSalon = [

  param("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Salon name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number format")

];



/**
 * Validate salon ID
 */
const validateSalonId = [

  param("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID")

];



/**
 * Validate salon working hours
 */
const validateWorkingHours = [

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Invalid time format (HH:MM)"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Invalid time format (HH:MM)")

];



/**
 * Validate salon search filters
 */
const validateSalonSearch = [

  query("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  query("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  query("radius")
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage("Radius must be between 0.1 and 100 km"),

  query("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

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
 * Validate salon service addition
 */
const validateSalonService = [

  body("name")
    .notEmpty()
    .withMessage("Service name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),

  body("price")
    .notEmpty()
    .withMessage("Service price is required")
    .isFloat({ min: 0 })
    .withMessage("Invalid service price"),

  body("duration")
    .notEmpty()
    .withMessage("Service duration is required")
    .isInt({ min: 5, max: 300 })
    .withMessage("Service duration must be between 5 and 300 minutes")

];



/**
 * Validate salon image upload
 */
const validateSalonImageUpload = [

  param("salonId")
    .notEmpty()
    .withMessage("Salon ID is required")
    .isMongoId()
    .withMessage("Invalid salon ID")

];



module.exports = {
  validateCreateSalon,
  validateUpdateSalon,
  validateSalonId,
  validateWorkingHours,
  validateSalonSearch,
  validateSalonService,
  validateSalonImageUpload
};