/**
 * Auth Validation
 * Validates authentication related inputs
 */

const { body } = require("express-validator");


/**
 * Phone number validation
 */
const validatePhone = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number format")
];


/**
 * OTP request validation
 */
const validateSendOTP = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number format")
];


/**
 * OTP verification validation
 */
const validateVerifyOTP = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number format"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 6 })
    .withMessage("OTP must be between 4 and 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers")
];


/**
 * Admin creation validation
 */
const validateCreateAdmin = [
  body("name")
    .notEmpty()
    .withMessage("Admin name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];


/**
 * Token refresh validation
 */
const validateRefreshToken = [
  body("token")
    .notEmpty()
    .withMessage("Token is required")
];


/**
 * Logout validation
 */
const validateLogout = [
  body("token")
    .optional()
];


/**
 * Export validations
 */
module.exports = {
  validatePhone,
  validateSendOTP,
  validateVerifyOTP,
  validateCreateAdmin,
  validateRefreshToken,
  validateLogout
};