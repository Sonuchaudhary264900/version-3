/**
 * Owner Controller
 * Handles salon owner operations
 */

const Salon = require("../models/Salon");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

const asyncHandler = require("../helpers/asyncHandler");
const ERROR_MESSAGES = require("../constants/errorMessages");


/**
 * Register Salon
 */
exports.registerSalon = asyncHandler(async (req, res) => {

  const ownerId = req.user.id;

  const salon = await Salon.create({
    ownerId,
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    phone: req.body.phone
  });

  res.json({
    success: true,
    message: "Salon registered successfully",
    salon
  });

});


/**
 * Update salon details
 */
exports.updateSalon = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  Object.assign(salon, req.body);

  await salon.save();

  res.json({
    success: true,
    message: "Salon updated successfully",
    salon
  });

});


/**
 * Set working hours
 */
exports.setWorkingHours = asyncHandler(async (req, res) => {

  const { salonId } = req.params;
  const { openTime, closeTime } = req.body;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  salon.openTime = openTime;
  salon.closeTime = closeTime;

  await salon.save();

  res.json({
    success: true,
    message: "Working hours updated"
  });

});


/**
 * Set slot duration
 */
exports.setSlotDuration = asyncHandler(async (req, res) => {

  const { salonId } = req.params;
  const { slotDuration } = req.body;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  salon.slotDuration = slotDuration;

  await salon.save();

  res.json({
    success: true,
    message: "Slot duration updated"
  });

});


/**
 * Add service
 */
exports.addService = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const service = await Service.create({
    salonId,
    name: req.body.name,
    price: req.body.price,
    duration: req.body.duration,
    description: req.body.description
  });

  res.json({
    success: true,
    message: "Service added successfully",
    service
  });

});


/**
 * Update service
 */
exports.updateService = asyncHandler(async (req, res) => {

  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }

  Object.assign(service, req.body);

  await service.save();

  res.json({
    success: true,
    message: "Service updated",
    service
  });

});


/**
 * Delete service
 */
exports.deleteService = asyncHandler(async (req, res) => {

  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND
    });
  }

  await service.deleteOne();

  res.json({
    success: true,
    message: "Service deleted"
  });

});


/**
 * Upload salon photos
 */
exports.uploadSalonPhotos = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  const images = req.files.map(file => file.filename);

  salon.images = salon.images.concat(images);

  await salon.save();

  res.json({
    success: true,
    message: "Photos uploaded",
    images
  });

});


/**
 * Upload salon cover image
 */
exports.uploadSalonCover = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  salon.cover = req.file.filename;

  await salon.save();

  res.json({
    success: true,
    message: "Cover image uploaded",
    cover: salon.cover
  });

});


/**
 * View bookings for owner salons
 */
exports.getOwnerBookings = asyncHandler(async (req, res) => {

  const ownerId = req.user.id;

  const salons = await Salon.find({ ownerId });

  const salonIds = salons.map(s => s._id);

  const bookings = await Booking.find({
    salonId: { $in: salonIds }
  })
    .populate("userId", "name phone")
    .populate("serviceId", "name price");

  res.json({
    success: true,
    bookings
  });

});


/**
 * Add walk-in booking
 */
exports.addWalkInBooking = asyncHandler(async (req, res) => {

  const { salonId, serviceId, date, startTime } = req.body;

  const booking = await Booking.create({
    salonId,
    serviceId,
    date,
    startTime,
    status: "confirmed",
    walkIn: true
  });

  res.json({
    success: true,
    message: "Walk-in booking added",
    booking
  });

});


/**
 * Get owner salons
 */
exports.getOwnerSalons = asyncHandler(async (req, res) => {

  const ownerId = req.user.id;

  const salons = await Salon.find({ ownerId });

  res.json({
    success: true,
    salons
  });

});


/**
 * Delete salon
 */
exports.deleteSalon = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  if (salon.ownerId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized"
    });
  }

  await salon.deleteOne();

  res.json({
    success: true,
    message: "Salon deleted"
  });

});


/**
 * Get salon services
 */
exports.getSalonServices = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const services = await Service.find({
    salonId,
    isActive: true,
    isDeleted: false
  });

  res.json({
    success: true,
    services
  });

});


/**
 * Confirm booking
 */
exports.confirmBooking = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId).populate("salonId");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found"
    });
  }

  if (booking.salonId.ownerId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized"
    });
  }

  booking.status = "confirmed";

  await booking.save();

  res.json({
    success: true,
    message: "Booking confirmed",
    booking
  });

});


/**
 * Complete booking
 */
exports.completeBooking = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId).populate("salonId");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found"
    });
  }

  if (booking.salonId.ownerId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized"
    });
  }

  booking.status = "completed";

  await booking.save();

  res.json({
    success: true,
    message: "Booking completed",
    booking
  });

});


/**
 * Cancel booking
 */
exports.cancelBooking = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId).populate("salonId");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found"
    });
  }

  if (booking.salonId.ownerId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized"
    });
  }

  booking.status = "cancelled";

  await booking.save();

  res.json({
    success: true,
    message: "Booking cancelled",
    booking
  });

});


/**
 * Get salon analytics
 */
exports.getSalonAnalytics = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon || salon.ownerId.toString() !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  // Simple analytics
  const totalBookings = await Booking.countDocuments({ salonId });
  const completedBookings = await Booking.countDocuments({ salonId, status: "completed" });

  res.json({
    success: true,
    analytics: {
      totalBookings,
      completedBookings
    }
  });

});


/**
 * Get salon revenue
 */
exports.getSalonRevenue = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon || salon.ownerId.toString() !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  // Simple revenue
  const completedBookings = await Booking.find({ salonId, status: "completed" }).populate("serviceId");

  const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.serviceId ? booking.serviceId.price : 0), 0);

  res.json({
    success: true,
    revenue: totalRevenue
  });

});


/**
 * Get salon booking analytics
 */
exports.getSalonBookingAnalytics = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const salon = await Salon.findById(salonId);

  if (!salon || salon.ownerId.toString() !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: "Salon not found"
    });
  }

  const totalBookings = await Booking.countDocuments({ salonId });
  const pendingBookings = await Booking.countDocuments({ salonId, status: "pending" });
  const confirmedBookings = await Booking.countDocuments({ salonId, status: "confirmed" });
  const completedBookings = await Booking.countDocuments({ salonId, status: "completed" });

  res.json({
    success: true,
    analytics: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings
    }
  });

});