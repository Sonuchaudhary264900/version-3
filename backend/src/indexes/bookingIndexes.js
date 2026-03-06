/**
 * Booking Indexes
 * Optimizes booking queries and prevents double booking
 */

const Booking = require("../models/Booking");
const logger = require("../utils/logger");

const createBookingIndexes = async () => {

  try {

    /* Prevent double booking */

    await Booking.collection.createIndex(
      {
        salonId: 1,
        bookingDate: 1,
        slotStart: 1
      },
      {
        unique: true,
        partialFilterExpression: {
          status: { $in: ["pending", "confirmed"] }
        },
        name: "unique_active_booking_slot"
      }
    );


    /* User booking history */

    await Booking.collection.createIndex(
      {
        userId: 1,
        createdAt: -1
      },
      {
        name: "user_booking_history_index"
      }
    );


    /* Owner dashboard bookings */

    await Booking.collection.createIndex(
      {
        salonId: 1,
        createdAt: -1
      },
      {
        name: "salon_booking_dashboard_index"
      }
    );


    /* Booking status lookup */

    await Booking.collection.createIndex(
      {
        status: 1
      },
      {
        name: "booking_status_index"
      }
    );


    /* Analytics queries */

    await Booking.collection.createIndex(
      {
        createdAt: -1
      },
      {
        name: "booking_analytics_index"
      }
    );


    logger.info("Booking indexes created successfully");

  } catch (error) {

    logger.error(`Error creating booking indexes: ${error.message}`);

  }

};

module.exports = createBookingIndexes;