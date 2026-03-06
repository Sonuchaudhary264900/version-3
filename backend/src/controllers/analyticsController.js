const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const Service = require("../models/Service");
const Review = require("../models/Review");

const asyncHandler = require("../helpers/asyncHandler");


/* ================= OWNER DASHBOARD ================= */

exports.ownerSummary = asyncHandler(async (req, res) => {

  const ownerId = req.user._id;

  const salons = await Salon.find({ ownerId });

  const salonIds = salons.map(s => s._id);

  const totalBookings = await Booking.countDocuments({
    salonId: { $in: salonIds }
  });

  const completedBookings = await Booking.countDocuments({
    salonId: { $in: salonIds },
    status: "completed"
  });

  const today = new Date();
  today.setHours(0,0,0,0);

  const todayBookings = await Booking.countDocuments({
    salonId: { $in: salonIds },
    createdAt: { $gte: today }
  });

  const revenue = await Booking.aggregate([
    {
      $match: {
        salonId: { $in: salonIds },
        status: "completed"
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalBookings,
      completedBookings,
      todayBookings,
      totalRevenue: revenue[0]?.totalRevenue || 0
    }
  });

});


exports.ownerRevenue = asyncHandler(async (req, res) => {

  const ownerId = req.user._id;

  const salons = await Salon.find({ ownerId });

  const salonIds = salons.map(s => s._id);

  const revenue = await Booking.aggregate([
    {
      $match: {
        salonId: { $in: salonIds },
        status: "completed"
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        revenue: { $sum: "$price" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  res.json({
    success: true,
    data: revenue
  });

});


exports.topServices = asyncHandler(async (req, res) => {

  const services = await Booking.aggregate([
    {
      $group: {
        _id: "$serviceId",
        bookings: { $sum: 1 }
      }
    },
    { $sort: { bookings: -1 } },
    { $limit: 5 }
  ]);

  res.json({
    success: true,
    data: services
  });

});


exports.recentBookings = asyncHandler(async (req, res) => {

  const ownerId = req.user._id;

  const salons = await Salon.find({ ownerId });

  const salonIds = salons.map(s => s._id);

  const bookings = await Booking.find({
    salonId: { $in: salonIds }
  })
  .populate("userId", "name")
  .populate("serviceId", "name")
  .sort({ createdAt: -1 })
  .limit(10);

  res.json({
    success: true,
    data: bookings
  });

});


/* ================= OWNER ANALYTICS ================= */

exports.getSalonOverview = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const totalBookings = await Booking.countDocuments({ salonId });

  const reviews = await Review.countDocuments({ salonId });

  res.json({
    success: true,
    data: {
      totalBookings,
      reviews
    }
  });

});


exports.getBookingAnalytics = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const bookings = await Booking.countDocuments({ salonId });

  res.json({
    success: true,
    bookings
  });

});


exports.getRevenueAnalytics = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const revenue = await Booking.aggregate([
    {
      $match: {
        salonId,
        status: "completed"
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" }
      }
    }
  ]);

  res.json({
    success: true,
    revenue: revenue[0]?.totalRevenue || 0
  });

});


exports.getServiceAnalytics = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const services = await Service.find({ salonId });

  res.json({
    success: true,
    services
  });

});


exports.getBookingTrends = asyncHandler(async (req, res) => {

  const trends = await Booking.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        bookings: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  res.json({
    success: true,
    trends
  });

});


/* ================= ADMIN ANALYTICS ================= */

exports.getPlatformAnalytics = asyncHandler(async (req, res) => {

  const totalSalons = await Salon.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalServices = await Service.countDocuments();
  const totalReviews = await Review.countDocuments();

  res.json({
    success: true,
    analytics: {
      totalSalons,
      totalBookings,
      totalServices,
      totalReviews
    }
  });

});


exports.getUserAnalytics = asyncHandler(async (req, res) => {

  const users = await Review.countDocuments();

  res.json({
    success: true,
    users
  });

});


exports.getSalonAnalytics = asyncHandler(async (req, res) => {

  const salons = await Salon.countDocuments();

  res.json({
    success: true,
    salons
  });

});


exports.getPlatformBookingAnalytics = asyncHandler(async (req, res) => {

  const bookings = await Booking.countDocuments();

  res.json({
    success: true,
    bookings
  });

});


exports.getPlatformRevenueAnalytics = asyncHandler(async (req, res) => {

  const revenue = await Booking.aggregate([
    {
      $match: { status: "completed" }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" }
      }
    }
  ]);

  res.json({
    success: true,
    revenue: revenue[0]?.totalRevenue || 0
  });

});


exports.getTopSalons = asyncHandler(async (req, res) => {

  const salons = await Salon.find().limit(5);

  res.json({
    success: true,
    salons
  });

});


exports.getTopServices = asyncHandler(async (req, res) => {

  const services = await Service.find().limit(5);

  res.json({
    success: true,
    services
  });

});