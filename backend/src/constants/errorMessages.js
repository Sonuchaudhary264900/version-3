/**
 * Error Message Constants
 */

const ERROR_MESSAGES = {

  AUTH: {
    INVALID_CREDENTIALS: "Invalid credentials",
    TOKEN_MISSING: "Authentication token is required",
    TOKEN_INVALID: "Invalid or expired authentication token",
    UNAUTHORIZED: "You are not authorized to perform this action",
    OTP_INVALID: "Invalid OTP",
    OTP_EXPIRED: "OTP has expired"
  },

  USER: {
    USER_NOT_FOUND: "User not found",
    USER_ALREADY_EXISTS: "User already exists",
    INVALID_PHONE: "Invalid phone number",
    ACCOUNT_BLOCKED: "Your account has been blocked by admin"
  },

  SALON: {
    SALON_NOT_FOUND: "Salon not found",
    SALON_ALREADY_EXISTS: "Salon already registered",
    SALON_NOT_APPROVED: "Salon not approved by admin",
    SALON_BLOCKED: "Salon has been blocked",
    INVALID_SALON_DATA: "Invalid salon data"
  },

  SERVICE: {
    SERVICE_NOT_FOUND: "Service not found",
    SERVICE_ALREADY_EXISTS: "Service already exists",
    INVALID_SERVICE_DATA: "Invalid service data"
  },

  BOOKING: {
    BOOKING_NOT_FOUND: "Booking not found",
    SLOT_NOT_AVAILABLE: "Selected time slot is not available",
    DOUBLE_BOOKING: "This slot is already booked",
    BOOKING_CANCELLED: "Booking has already been cancelled",
    BOOKING_COMPLETED: "Booking has already been completed",
    INVALID_BOOKING_DATA: "Invalid booking data"
  },

  REVIEW: {
    REVIEW_NOT_FOUND: "Review not found",
    REVIEW_ALREADY_EXISTS: "You have already reviewed this salon",
    INVALID_RATING: "Rating must be between 1 and 5"
  },

  UPLOAD: {
    FILE_TOO_LARGE: "Uploaded file exceeds maximum size",
    INVALID_FILE_TYPE: "Invalid file type",
    IMAGE_UPLOAD_FAILED: "Image upload failed"
  },

  CACHE: {
    CACHE_FETCH_FAILED: "Cache fetch failed",
    CACHE_SET_FAILED: "Cache set operation failed"
  },

  DATABASE: {
    CONNECTION_FAILED: "Database connection failed",
    QUERY_FAILED: "Database query failed"
  },

  SYSTEM: {
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID_REQUEST: "Invalid request",
    RESOURCE_NOT_FOUND: "Requested resource not found",
    TOO_MANY_REQUESTS: "Too many requests, please try again later"
  }

};

Object.freeze(ERROR_MESSAGES);

module.exports = ERROR_MESSAGES;