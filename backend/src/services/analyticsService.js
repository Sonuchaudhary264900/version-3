/**
 * Analytics Service
 * Handles analytics calculations for the platform
 */

const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const Service = require("../models/Service");
const User = require("../models/User");

const { BOOKING_STATUS } = require("../constants/bookingStatus");


/**
 * Get salon overview analytics
 */
const getSalonOverview = async (salonId) => {

  const totalBookings = await Booking.countDocuments({ salonId });

  const completedBookings = await Booking.countDocuments({
    salonId,
    status: BOOKING_STATUS.COMPLETED
  });

  const cancelledBookings = await Booking.countDocuments({
    salonId,
    status: BOOKING_STATUS.CANCELLED
  });

  const revenue = await Booking.aggregate([
    {
      $match: {
        salonId,
        status: BOOKING_STATUS.COMPLETED
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" }
      }
    }
  ]);

  return {
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue: revenue[0]?.totalRevenue || 0
  };

};



/**
 * Get booking trends
 */
const getBookingTrends = async (salonId) => {

  const trends = await Booking.aggregate([
    {
      $match: { salonId }
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        bookings: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
    }
  ]);

  return trends;

};



/**
 * Get revenue analytics
 */
const getRevenueAnalytics = async (salonId) => {

  const revenue = await Booking.aggregate([
    {
      $match: {
        salonId,
        status: BOOKING_STATUS.COMPLETED
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        revenue: { $sum: "$price" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  return revenue;

};



/**
 * Get service analytics
 */
const getServiceAnalytics = async (salonId) => {

  const services = await Booking.aggregate([
    {
      $match: { salonId }
    },
    {
      $group: {
        _id: "$serviceId",
        bookings: { $sum: 1 },
        revenue: { $sum: "$price" }
      }
    },
    {
      $sort: { bookings: -1 }
    }
  ]);

  return services;

};



/**
 * Get platform statistics
 */
const getPlatformStats = async () => {

  const totalUsers = await User.countDocuments();

  const totalSalons = await Salon.countDocuments();

  const totalBookings = await Booking.countDocuments();

  const completedBookings = await Booking.countDocuments({
    status: BOOKING_STATUS.COMPLETED
  });

  const totalRevenue = await Booking.aggregate([
    {
      $match: { status: BOOKING_STATUS.COMPLETED }
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$price" }
      }
    }
  ]);

  return {
    totalUsers,
    totalSalons,
    totalBookings,
    completedBookings,
    totalRevenue: totalRevenue[0]?.revenue || 0
  };

};



/**
 * Get top salons
 */
const getTopSalons = async () => {

  const salons = await Salon.find()
    .sort({ bookingCount: -1 })
    .limit(10);

  return salons;

};



/**
 * Get top services
 */
const getTopServices = async () => {

  const services = await Service.find()
    .sort({ bookingCount: -1 })
    .limit(10);

  return services;

};



module.exports = {
  getSalonOverview,
  getBookingTrends,
  getRevenueAnalytics,
  getServiceAnalytics,
  getPlatformStats,
  getTopSalons,
  getTopServices
};