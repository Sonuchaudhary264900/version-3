const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
  validateSendOTP,
  validateVerifyOTP
} = require("../validations/authValidation");

const validateRequest = require("../middleware/validateRequest");
const requireAuth = require("../middleware/requireAuth");

const { otpLimiter } = require("../middleware/rateLimiter");

/* Send OTP */
router.post(
  "/send-otp",
  otpLimiter,
  validateSendOTP,
  validateRequest,
  authController.sendOTP
);

/* Verify OTP */
router.post(
  "/verify-otp",
  otpLimiter,
  validateVerifyOTP,
  validateRequest,
  authController.verifyOTP
);

/* Current logged-in user */
router.get(
  "/me",
  requireAuth,
  authController.getMe
);

/* Logout */
router.post(
  "/logout",
  requireAuth,
  authController.logout
);

module.exports = router;