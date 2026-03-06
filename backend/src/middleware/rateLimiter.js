const rateLimit = require("express-rate-limit");


/* AUTH RATE LIMITER */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later."
  }
});


/* OTP LIMITER */

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many OTP requests."
  }
});


/* SEARCH LIMITER */

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many search requests."
  }
});


/* BOOKING LIMITER */

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many booking requests."
  }
});


/* ADMIN LIMITER */

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Admin API limit exceeded."
  }
});


module.exports = {
  authLimiter,
  otpLimiter,
  searchLimiter,
  bookingLimiter,
  adminLimiter
};