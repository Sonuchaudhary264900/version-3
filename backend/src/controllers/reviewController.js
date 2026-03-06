const Review = require("../models/Review");
const Salon = require("../models/Salon");

const asyncHandler = require("../helpers/asyncHandler");
const ERROR_MESSAGES = require("../constants/errorMessages");


exports.createReview = asyncHandler(async (req, res) => {

  const { salonId, rating, comment } = req.body;
  const userId = req.user._id;

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.SALON.SALON_NOT_FOUND
    });
  }

  const existingReview = await Review.findOne({ salonId, userId });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.REVIEW.REVIEW_ALREADY_EXISTS
    });
  }

  const review = await Review.create({
    salonId,
    userId,
    rating,
    comment
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    review
  });

});


exports.updateReview = asyncHandler(async (req, res) => {

  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.REVIEW.REVIEW_NOT_FOUND
    });
  }

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;

  await review.save();

  res.json({
    success: true,
    message: "Review updated successfully",
    review
  });

});


exports.deleteReview = asyncHandler(async (req, res) => {

  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.REVIEW.REVIEW_NOT_FOUND
    });
  }

  await review.deleteOne();

  res.json({
    success: true,
    message: "Review deleted successfully"
  });

});


exports.getSalonReviews = asyncHandler(async (req, res) => {

  const { salonId } = req.params;

  const reviews = await Review.find({ salonId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    reviews
  });

});


exports.getUserReviews = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const reviews = await Review.find({ userId })
    .populate("salonId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    reviews
  });

});


exports.likeReview = asyncHandler(async (req, res) => {

  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.REVIEW.REVIEW_NOT_FOUND
    });
  }

  review.likes = (review.likes || 0) + 1;

  await review.save();

  res.json({
    success: true,
    message: "Review liked",
    review
  });

});


exports.hideReview = asyncHandler(async (req, res) => {

  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.REVIEW.REVIEW_NOT_FOUND
    });
  }

  review.hidden = true;

  await review.save();

  res.json({
    success: true,
    message: "Review hidden"
  });

});


exports.unhideReview = asyncHandler(async (req, res) => {

  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.REVIEW.REVIEW_NOT_FOUND
    });
  }

  review.hidden = false;

  await review.save();

  res.json({
    success: true,
    message: "Review unhidden"
  });

});


exports.getAllReviews = asyncHandler(async (req, res) => {

  const reviews = await Review.find()
    .populate("userId", "name")
    .populate("salonId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    reviews
  });

});