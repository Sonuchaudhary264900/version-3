/**
 * Recommendation Service
 * Handles salon recommendation logic
 */

const Salon = require("../models/Salon");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const geoDistance = require("../utils/geoDistance");


/**
 * Get nearby salons
 */
const getNearbySalons = async (lat, lng, radius = 5000) => {

  const salons = await Salon.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: radius
      }
    },
    isActive: true
  })
    .limit(20);

  return salons;

};



/**
 * Get highly rated salons
 */
const getTopRatedSalons = async () => {

  const salons = await Salon.find({ isActive: true })
    .sort({ rating: -1 })
    .limit(20);

  return salons;

};



/**
 * Get trending salons
 * Based on booking count
 */
const getTrendingSalons = async () => {

  const salons = await Salon.find({ isActive: true })
    .sort({ bookingCount: -1 })
    .limit(20);

  return salons;

};



/**
 * Recommend salons based on service
 */
const recommendByService = async (serviceName) => {

  const salons = await Salon.find({
    services: { $regex: serviceName, $options: "i" },
    isActive: true
  })
    .sort({ rating: -1 })
    .limit(20);

  return salons;

};



/**
 * Personalized salon recommendations
 * Based on user's booking history
 */
const getPersonalizedRecommendations = async (userId) => {

  /**
   * Get user's previous bookings
   */
  const bookings = await Booking.find({ userId })
    .populate("serviceId")
    .limit(20);

  if (!bookings.length) {
    return getTrendingSalons();
  }

  /**
   * Extract services used by user
   */
  const services = bookings.map(b => b.serviceId.name);

  /**
   * Find salons offering similar services
   */
  const salons = await Salon.find({
    services: { $in: services },
    isActive: true
  })
    .sort({ rating: -1 })
    .limit(20);

  return salons;

};



/**
 * Recommend salons based on rating + popularity
 */
const getSmartRecommendations = async () => {

  const salons = await Salon.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$rating", 2] },
            { $multiply: ["$bookingCount", 0.1] }
          ]
        }
      }
    },
    {
      $sort: { score: -1 }
    },
    {
      $limit: 20
    }
  ]);

  return salons;

};



/**
 * Get similar salons
 */
const getSimilarSalons = async (salonId) => {

  const salon = await Salon.findById(salonId);

  if (!salon) {
    throw new Error("Salon not found");
  }

  const salons = await Salon.find({
    category: salon.category,
    _id: { $ne: salonId },
    isActive: true
  })
    .sort({ rating: -1 })
    .limit(10);

  return salons;

};



module.exports = {
  getNearbySalons,
  getTopRatedSalons,
  getTrendingSalons,
  recommendByService,
  getPersonalizedRecommendations,
  getSmartRecommendations,
  getSimilarSalons
};