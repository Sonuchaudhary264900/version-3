/**
 * Global Constants
 * Used across the Smart Salon backend
 */


/**
 * Pagination defaults
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};



/**
 * Booking configuration
 */
const BOOKING_CONFIG = {
  DEFAULT_SLOT_DURATION: 30, // minutes
  MAX_ADVANCE_BOOKING_DAYS: 30,
  MIN_BUFFER_TIME: 5 // minutes between bookings
};



/**
 * Booking expiration settings
 */
const BOOKING_EXPIRATION = {
  PENDING_EXPIRATION_MINUTES: 15
};



/**
 * Cache settings
 */
const CACHE_CONFIG = {
  SALON_CACHE_TTL: 300, // seconds
  TRENDING_CACHE_TTL: 600,
  ANALYTICS_CACHE_TTL: 300
};



/**
 * Notification settings
 */
const NOTIFICATION_CONFIG = {
  MAX_USER_NOTIFICATIONS: 50,
  BOOKING_REMINDER_MINUTES: 60
};



/**
 * Roles
 */
const ROLES = {
  USER: "user",
  OWNER: "owner",
  ADMIN: "admin"
};



/**
 * Socket Events
 */
const SOCKET_EVENTS = {
  BOOKING_CREATED: "bookingCreated",
  BOOKING_CONFIRMED: "bookingConfirmed",
  BOOKING_CANCELLED: "bookingCancelled",
  BOOKING_COMPLETED: "bookingCompleted",
  SLOT_UPDATED: "slotsUpdated"
};



/**
 * System limits
 */
const LIMITS = {
  MAX_SALON_IMAGES: 10,
  MAX_SERVICE_IMAGES: 5,
  MAX_REVIEWS_PER_USER: 100
};



/**
 * File upload settings
 */
const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ]
};



/**
 * Analytics time ranges
 */
const ANALYTICS_RANGES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};



/**
 * Default coordinates (fallback location)
 */
const DEFAULT_LOCATION = {
  LAT: 30.7333,
  LNG: 76.7794
};



module.exports = {
  PAGINATION,
  BOOKING_CONFIG,
  BOOKING_EXPIRATION,
  CACHE_CONFIG,
  NOTIFICATION_CONFIG,
  ROLES,
  SOCKET_EVENTS,
  LIMITS,
  FILE_UPLOAD,
  ANALYTICS_RANGES,
  DEFAULT_LOCATION
};