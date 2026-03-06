/**
 * Salon Indexes
 * Optimizes salon discovery, search, and filtering
 */

const Salon = require("../models/Salon");
const logger = require("../utils/logger");


const createSalonIndexes = async () => {

  try {

    /* Owner dashboard lookup */

    await Salon.collection.createIndex(
      { ownerId: 1 },
      { name: "salon_owner_index" }
    );


    /* Geo search for nearby salons */

    await Salon.collection.createIndex(
      { location: "2dsphere" },
      { name: "salon_geo_index" }
    );


    /* Text search for salon discovery */

    await Salon.collection.createIndex(
      {
        name: "text",
        description: "text"
      },
      {
        name: "salon_search_index"
      }
    );


    /* Rating sorting */

    await Salon.collection.createIndex(
      { rating: -1 },
      { name: "salon_rating_index" }
    );


    /* Trending salons based on bookings */

    await Salon.collection.createIndex(
      { totalBookings: -1 },
      { name: "salon_trending_index" }
    );


    /* Approved salons filter */

    await Salon.collection.createIndex(
      { isApproved: 1 },
      { name: "salon_approval_index" }
    );


    /* Approved + rating sorting */

    await Salon.collection.createIndex(
      {
        isApproved: 1,
        rating: -1
      },
      {
        name: "salon_rating_filter_index"
      }
    );


    /* City discovery */

    await Salon.collection.createIndex(
      { city: 1 },
      { name: "salon_city_index" }
    );


    /* City + rating discovery */

    await Salon.collection.createIndex(
      {
        city: 1,
        rating: -1
      },
      {
        name: "salon_city_rating_index"
      }
    );


    /* Analytics queries */

    await Salon.collection.createIndex(
      { createdAt: -1 },
      { name: "salon_creation_index" }
    );


    logger.info("Salon indexes created successfully");

  } catch (error) {

    logger.error(`Error creating salon indexes: ${error.message}`);

  }

};


module.exports = createSalonIndexes;