/**
 * Calculate Rating Utility
 * Calculates average rating for salons
 */

const Review = require("../models/Review");
const Salon = require("../models/Salon");


/**
 * Calculate average rating
 */
const calculateAverageRating = async (salonId) => {

  const result = await Review.aggregate([
    {
      $match: { salonId }
    },
    {
      $group: {
        _id: "$salonId",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (!result.length) {

    await Salon.findByIdAndUpdate(
      salonId,
      {
        rating: 0,
        reviewCount: 0
      }
    );

    return {
      rating: 0,
      reviewCount: 0
    };

  }

  const rating = Number(result[0].avgRating.toFixed(1));
  const reviewCount = result[0].reviewCount;

  /**
   * Update salon rating
   */
  await Salon.findByIdAndUpdate(
    salonId,
    {
      rating,
      reviewCount
    }
  );

  return {
    rating,
    reviewCount
  };

};



/**
 * Update rating after new review
 */
const updateRatingAfterReview = async (salonId) => {

  return calculateAverageRating(salonId);

};



/**
 * Update rating after review deletion
 */
const updateRatingAfterDelete = async (salonId) => {

  return calculateAverageRating(salonId);

};



/**
 * Get rating summary
 */
const getRatingSummary = async (salonId) => {

  const summary = await Review.aggregate([
    {
      $match: { salonId }
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 }
      }
    }
  ]);

  const ratingSummary = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  summary.forEach(item => {
    ratingSummary[item._id] = item.count;
  });

  return ratingSummary;

};



module.exports = {
  calculateAverageRating,
  updateRatingAfterReview,
  updateRatingAfterDelete,
  getRatingSummary
};