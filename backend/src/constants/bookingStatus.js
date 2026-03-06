/**
 * Booking Status Constants
 */

const BOOKING_STATUS = Object.freeze({

  PENDING: "pending",

  CONFIRMED: "confirmed",

  COMPLETED: "completed",

  CANCELLED: "cancelled",

  EXPIRED: "expired"

});


/* Status groups */

const ACTIVE_BOOKING_STATUS = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.CONFIRMED
];

const FINISHED_BOOKING_STATUS = [
  BOOKING_STATUS.COMPLETED,
  BOOKING_STATUS.CANCELLED,
  BOOKING_STATUS.EXPIRED
];

const ALL_BOOKING_STATUS = Object.values(BOOKING_STATUS);


/* Validators */

function isValidBookingStatus(status) {

  return ALL_BOOKING_STATUS.includes(status);

}

function isActiveBooking(status) {

  return ACTIVE_BOOKING_STATUS.includes(status);

}

function isFinishedBooking(status) {

  return FINISHED_BOOKING_STATUS.includes(status);

}


module.exports = {

  BOOKING_STATUS,

  ALL_BOOKING_STATUS,

  ACTIVE_BOOKING_STATUS,

  FINISHED_BOOKING_STATUS,

  isValidBookingStatus,

  isActiveBooking,

  isFinishedBooking

};