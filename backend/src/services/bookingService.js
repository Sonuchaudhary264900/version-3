/**
 * Booking Service
 * Handles booking business logic
 */

const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const Service = require("../models/Service");

const { BOOKING_STATUS } = require("../constants/bookingStatus");


/**
 * Check if slot is available
 */
const checkSlotAvailability = async (salonId, date, startTime) => {

  const existingBooking = await Booking.findOne({
    salonId,
    date,
    startTime,
    status: {
      $in: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED
      ]
    }
  });

  return !existingBooking;

};



/**
 * Create booking
 */
const createBooking = async (bookingData) => {

  const { salonId, serviceId, date, startTime, userId } = bookingData;

  /**
   * Check slot availability
   */
  const slotAvailable = await checkSlotAvailability(
    salonId,
    date,
    startTime
  );

  if (!slotAvailable) {
    throw new Error("Selected slot is already booked");
  }
  const Booking = require("../models/Booking");
const {
  acquireSlotLock,
  releaseSlotLock
} = require("../utils/slotLock");


async function createBooking(data) {

  const {
    salonId,
    userId,
    serviceId,
    bookingDate,
    slotStart,
    slotEnd,
    price
  } = data;


  const lockAcquired = await acquireSlotLock(
    salonId,
    bookingDate,
    slotStart
  );

  if (!lockAcquired) {
    throw new Error("Slot already being booked by another user");
  }

  try {

    const existingBooking = await Booking.findOne({
      salonId,
      bookingDate,
      slotStart,
      status: { $in: ["pending", "confirmed"] }
    });

    if (existingBooking) {
      throw new Error("Slot already booked");
    }

    const booking = await Booking.create({
      salonId,
      userId,
      serviceId,
      bookingDate,
      slotStart,
      slotEnd,
      price,
      status: "pending"
    });

    return booking;

  } finally {

    await releaseSlotLock(
      salonId,
      bookingDate,
      slotStart
    );

  }

}


module.exports = {
  createBooking
};

  /**
   * Get service details
   */
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  /**
   * Calculate end time
   */
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(start.getTime() + service.duration * 60000);

  const endTime =
    end.getHours().toString().padStart(2, "0") +
    ":" +
    end.getMinutes().toString().padStart(2, "0");

  /**
   * Create booking
   */
  const booking = new Booking({
    userId,
    salonId,
    serviceId,
    date,
    startTime,
    endTime,
    price: service.price,
    status: BOOKING_STATUS.PENDING
  });

  await booking.save();

  /**
   * Update salon booking count
   */
  await Salon.findByIdAndUpdate(
    salonId,
    { $inc: { bookingCount: 1 } }
  );

  /**
   * Update service booking count
   */
  await Service.findByIdAndUpdate(
    serviceId,
    { $inc: { bookingCount: 1 } }
  );

  return booking;

};



/**
 * Cancel booking
 */
const cancelBooking = async (bookingId, reason = "") => {

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new Error("Booking already cancelled");
  }

  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancellationReason = reason;

  await booking.save();

  return booking;

};



/**
 * Confirm booking
 */
const confirmBooking = async (bookingId) => {

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  booking.status = BOOKING_STATUS.CONFIRMED;

  await booking.save();

  return booking;

};



/**
 * Complete booking
 */
const completeBooking = async (bookingId) => {

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  booking.status = BOOKING_STATUS.COMPLETED;

  await booking.save();

  return booking;

};



/**
 * Get user bookings
 */
const getUserBookings = async (userId) => {

  return await Booking.find({ userId })
    .populate("salonId")
    .populate("serviceId")
    .sort({ createdAt: -1 });

};



/**
 * Get salon bookings
 */
const getSalonBookings = async (salonId) => {

  return await Booking.find({ salonId })
    .populate("userId")
    .populate("serviceId")
    .sort({ createdAt: -1 });

};



/**
 * Get booking by ID
 */
const getBookingById = async (bookingId) => {

  return await Booking.findById(bookingId)
    .populate("userId")
    .populate("salonId")
    .populate("serviceId");

};



module.exports = {
  createBooking,
  cancelBooking,
  confirmBooking,
  completeBooking,
  checkSlotAvailability,
  getUserBookings,
  getSalonBookings,
  getBookingById
};