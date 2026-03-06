/**
 * Booking Controller
 * Handles booking operations
 */

const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const Service = require("../models/Service");

const asyncHandler = require("../helpers/asyncHandler");

const ERROR_MESSAGES = require("../constants/errorMessages");
const { BOOKING_STATUS } = require("../constants/bookingStatus");

const { emitBookingCreated } = require("../config/socket");


/* =========================================
   CREATE BOOKING
========================================= */

const createBooking = asyncHandler(async (req, res) => {

  const { salonId, serviceId, bookingDate, slotStart, slotEnd } = req.body;

  const userId = req.user.id;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }


  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }


  /* Check slot conflict */

  const existingBooking = await Booking.findOne({
    salonId,
    bookingDate,
    slotStart,
    status: {
      $in: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED
      ]
    }
  });

  if (existingBooking) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.BOOKING.SLOT_NOT_AVAILABLE
    });
  }


  const booking = await Booking.create({
    userId,
    salonId,
    serviceId,
    bookingDate,
    slotStart,
    slotEnd,
    slotKey: `${salonId}_${bookingDate}_${slotStart}`,
    price: service.price,
    status: BOOKING_STATUS.PENDING
  });


  /* Emit socket event */

  emitBookingCreated(booking);


  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking
  });

});


/* =========================================
   GET BOOKING CALENDAR
========================================= */

const getBookingCalendar = asyncHandler(async (req, res) => {

  const { salonId } = req.params;
  const { date } = req.query;

  const bookings = await Booking.find({
    salonId,
    bookingDate: date,
    status: {
      $in: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED
      ]
    }
  }).select("slotStart slotEnd");

  res.json({
    success: true,
    bookings
  });

});


/* =========================================
   CHECK SLOT AVAILABILITY
========================================= */

const checkSlotAvailability = asyncHandler(async (req, res) => {

  const { salonId, date, slotStart } = req.query;

  const booking = await Booking.findOne({
    salonId,
    bookingDate: date,
    slotStart,
    status: {
      $in: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED
      ]
    }
  });

  res.json({
    success: true,
    available: !booking
  });

});


/* =========================================
   GET USER BOOKINGS
========================================= */

const getUserBookings = asyncHandler(async (req, res) => {

  const bookings = await Booking.find({
    userId: req.user.id
  })
    .populate("salonId", "name location")
    .populate("serviceId", "name price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    bookings
  });

});


/* =========================================
   CANCEL BOOKING
========================================= */

const cancelBooking = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.BOOKING.BOOKING_NOT_FOUND
    });
  }

  booking.status = BOOKING_STATUS.CANCELLED;

  await booking.save();

  res.json({
    success: true,
    message: "Booking cancelled successfully"
  });

});


/* =========================================
   OWNER BOOKINGS
========================================= */

const getOwnerBookings = asyncHandler(async (req, res) => {

  const ownerId = req.user.id;

  const salons = await Salon.find({ ownerId });

  const salonIds = salons.map(s => s._id);

  const bookings = await Booking.find({
    salonId: { $in: salonIds }
  })
    .populate("userId", "name phone")
    .populate("serviceId", "name price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    bookings
  });

});


/* =========================================
   SALON BOOKINGS
========================================= */

const getSalonBookings = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const bookings = await Booking.find({ salonId })
    .populate("userId", "name phone")
    .populate("serviceId", "name price");

  res.json({
    success: true,
    bookings
  });

});


/* =========================================
   CONFIRM BOOKING
========================================= */

const confirmBooking = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.BOOKING.BOOKING_NOT_FOUND
    });
  }

  booking.status = BOOKING_STATUS.CONFIRMED;

  await booking.save();

  res.json({
    success: true,
    message: "Booking confirmed"
  });

});


/* =========================================
   COMPLETE BOOKING
========================================= */

const completeBooking = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.BOOKING.BOOKING_NOT_FOUND
    });
  }

  booking.status = BOOKING_STATUS.COMPLETED;
  booking.completedAt = new Date();

  await booking.save();

  res.json({
    success: true,
    message: "Booking completed"
  });

});


/* =========================================
   EXPORTS
========================================= */

module.exports = {
  createBooking,
  getBookingCalendar,
  checkSlotAvailability,
  getUserBookings,
  cancelBooking,
  getOwnerBookings,
  getSalonBookings,
  confirmBooking,
  completeBooking
};