/**
 * Review Indexes
 * Optimizes review queries and prevents duplicate reviews
 */

const Review = require("../models/Review");
const logger = require("../utils/logger");

const createReviewIndexes = async () => {

  try {

    /* Prevent duplicate reviews */

    await Review.collection.createIndex(
      { userId: 1, salonId: 1 },
      {
        unique: true,
        partialFilterExpression: {
          isDeleted: { $ne: true }
        },
        name: "unique_user_salon_review"
      }
    );


    /* Fast lookup for salon reviews */

    await Review.collection.createIndex(
      { salonId: 1, createdAt: -1 },
      { name: "salon_reviews_index" }
    );


    /* User review history */

    await Review.collection.createIndex(
      { userId: 1, createdAt: -1 },
      { name: "user_review_history_index" }
    );


    /* Salon rating sorting */

    await Review.collection.createIndex(
      { salonId: 1, rating: -1 },
      { name: "salon_rating_index" }
    );


    /* Analytics queries */

    await Review.collection.createIndex(
      { createdAt: -1 },
      { name: "review_analytics_index" }
    );


    logger.info("Review indexes created successfully");

  } catch (error) {

    logger.error(`Error creating review indexes: ${error.message}`);

  }

};

module.exports = createReviewIndexes;