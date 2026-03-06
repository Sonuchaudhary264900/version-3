/**
 * Notification Types
 */

const NOTIFICATION_TYPES = Object.freeze({

  /* Booking */

  BOOKING_CREATED: "booking_created",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_COMPLETED: "booking_completed",
  BOOKING_REMINDER: "booking_reminder",
  BOOKING_EXPIRED: "booking_expired",

  /* Review */

  REVIEW_ADDED: "review_added",
  REVIEW_UPDATED: "review_updated",

  /* Salon */

  SALON_APPROVED: "salon_approved",
  SALON_REJECTED: "salon_rejected",
  SALON_BLOCKED: "salon_blocked",

  /* Service */

  SERVICE_ADDED: "service_added",
  SERVICE_UPDATED: "service_updated",
  SERVICE_DELETED: "service_deleted",

  /* Account */

  ACCOUNT_BLOCKED: "account_blocked",
  ACCOUNT_UNBLOCKED: "account_unblocked",

  /* Admin */

  ADMIN_ALERT: "admin_alert",
  FRAUD_ALERT: "fraud_alert",

  /* System */

  SYSTEM_UPDATE: "system_update",
  SECURITY_ALERT: "security_alert"

});


/* Grouped types */

const BOOKING_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPES.BOOKING_CREATED,
  NOTIFICATION_TYPES.BOOKING_CONFIRMED,
  NOTIFICATION_TYPES.BOOKING_CANCELLED,
  NOTIFICATION_TYPES.BOOKING_COMPLETED,
  NOTIFICATION_TYPES.BOOKING_REMINDER,
  NOTIFICATION_TYPES.BOOKING_EXPIRED
];

const ADMIN_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPES.ADMIN_ALERT,
  NOTIFICATION_TYPES.FRAUD_ALERT,
  NOTIFICATION_TYPES.SECURITY_ALERT
];


const ALL_NOTIFICATION_TYPES = Object.values(NOTIFICATION_TYPES);


/* Validators */

function isValidNotificationType(type) {

  return ALL_NOTIFICATION_TYPES.includes(type);

}

function isBookingNotification(type) {

  return BOOKING_NOTIFICATION_TYPES.includes(type);

}

function isAdminNotification(type) {

  return ADMIN_NOTIFICATION_TYPES.includes(type);

}


module.exports = {

  NOTIFICATION_TYPES,

  ALL_NOTIFICATION_TYPES,

  BOOKING_NOTIFICATION_TYPES,

  ADMIN_NOTIFICATION_TYPES,

  isValidNotificationType,

  isBookingNotification,

  isAdminNotification

};